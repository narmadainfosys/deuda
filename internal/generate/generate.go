package generate

import (
	"bytes"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"text/template"

	"github.com/narmadainfosys/deuda/internal/config"
	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark/extension"
	"github.com/yuin/goldmark/renderer/html"
	"gopkg.in/yaml.v3"
)

type Page struct {
	Slug    string
	Title   string
	HTML    string
	Date    string
	Content string
}

type pageFrontmatter struct {
	Title string `yaml:"title"`
	Date  string `yaml:"date"`
	Draft bool   `yaml:"draft"`
}

const fmDelim = "---"

func absPath(base, p string) string {
	if filepath.IsAbs(p) {
		return p
	}
	return filepath.Join(base, p)
}

func LoadPages(contentDir string) ([]Page, error) {
	entries, err := os.ReadDir(contentDir)
	if err != nil {
		return nil, fmt.Errorf("reading content dir: %w", err)
	}

	md := goldmark.New(
		goldmark.WithExtensions(extension.GFM, extension.Typographer),
		goldmark.WithRendererOptions(html.WithUnsafe()),
	)

	var pages []Page
	for _, entry := range entries {
		if entry.IsDir() || !strings.HasSuffix(entry.Name(), ".md") {
			continue
		}

		data, err := os.ReadFile(filepath.Join(contentDir, entry.Name()))
		if err != nil {
			return nil, fmt.Errorf("reading %s: %w", entry.Name(), err)
		}

		slug := strings.TrimSuffix(entry.Name(), ".md")
		fm, body := parseFrontmatter(data)

		if fm.Draft {
			continue
		}

		var buf bytes.Buffer
		if err := md.Convert([]byte(body), &buf); err != nil {
			return nil, fmt.Errorf("converting %s: %w", entry.Name(), err)
		}

		title := fm.Title
		if title == "" {
			title = strings.ReplaceAll(slug, "-", " ")
			title = strings.ReplaceAll(title, "_", " ")
			if len(title) > 0 {
				title = strings.ToUpper(title[:1]) + title[1:]
			}
		}

		pages = append(pages, Page{
			Slug:    slug,
			Title:   title,
			HTML:    strings.TrimSpace(buf.String()),
			Date:    fm.Date,
			Content: strings.TrimSpace(body),
		})
	}

	sort.Slice(pages, func(i, j int) bool {
		if pages[i].Date != pages[j].Date {
			return pages[i].Date < pages[j].Date
		}
		return pages[i].Slug < pages[j].Slug
	})

	return pages, nil
}

func parseFrontmatter(data []byte) (pageFrontmatter, string) {
	raw := strings.TrimSpace(string(data))

	if !strings.HasPrefix(raw, fmDelim) {
		return pageFrontmatter{}, raw
	}

	rest := strings.TrimPrefix(raw, fmDelim)
	idx := strings.Index(rest, fmDelim)
	if idx < 0 {
		return pageFrontmatter{}, raw
	}

	fmRaw := strings.TrimSpace(rest[:idx])
	body := strings.TrimSpace(rest[idx+len(fmDelim):])

	var fm pageFrontmatter
	if err := yaml.Unmarshal([]byte(fmRaw), &fm); err != nil {
		return pageFrontmatter{}, raw
	}

	return fm, body
}

type Generator struct {
	ProjectDir string
}

func New(projectDir string) *Generator {
	return &Generator{ProjectDir: projectDir}
}

func (g *Generator) Run(cfg *config.SiteConfig) error {
	contentDir := filepath.Join(g.ProjectDir, "content", "pages")
	pages, err := LoadPages(contentDir)
	if err != nil {
		return fmt.Errorf("loading pages: %w", err)
	}

	if err := g.writeConfigJS(cfg); err != nil {
		return fmt.Errorf("writing config: %w", err)
	}

	if err := g.writePagesJS(pages); err != nil {
		return fmt.Errorf("writing pages: %w", err)
	}

	return nil
}

func (g *Generator) writeConfigJS(cfg *config.SiteConfig) error {
	genDir := filepath.Join(g.ProjectDir, "src", "generated")
	if err := os.MkdirAll(genDir, 0755); err != nil {
		return err
	}

	navJS := ""
	for i, item := range cfg.Navigation {
		if i > 0 {
			navJS += ", "
		}
		navJS += fmt.Sprintf(`{label: %q, path: %q}`, item.Label, item.Path)
	}

	src := fmt.Sprintf(`export const siteConfig = {
  title: %q,
  description: %q,
  base: %q,
  language: %q,
  nav: [%s],
};
`, cfg.Title, cfg.Description, cfg.Base, cfg.Language, navJS)

	return os.WriteFile(filepath.Join(genDir, "config.js"), []byte(src), 0644)
}

func (g *Generator) writePagesJS(pages []Page) error {
	genDir := filepath.Join(g.ProjectDir, "src", "generated")
	if err := os.MkdirAll(genDir, 0755); err != nil {
		return err
	}

	tmpl := template.Must(template.New("pages").Parse(jsTemplate))

	var buf bytes.Buffer
	if err := tmpl.Execute(&buf, pages); err != nil {
		return err
	}

	return os.WriteFile(filepath.Join(genDir, "pages.js"), buf.Bytes(), 0644)
}

const jsTemplate = `export const pages = [
{{- range .}}
  {
    slug: {{printf "%q" .Slug}},
    title: {{printf "%q" .Title}},
    html: {{printf "%q" .HTML}},
    date: {{printf "%q" .Date}},
  },
{{- end}}
];
`


