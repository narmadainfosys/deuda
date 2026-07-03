package scaffold

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/narmadainfosys/deuda/internal/config"
	"github.com/narmadainfosys/deuda/internal/template"
)

func New(name, dir string) error {
	dest := filepath.Join(dir, name)

	if _, err := os.Stat(dest); err == nil {
		return fmt.Errorf("%q already exists", dest)
	}

	if err := copyEmbedded(dest); err != nil {
		return fmt.Errorf("copying template: %w", err)
	}

	cfg := config.Default(name)
	if err := writeConfig(dest, cfg); err != nil {
		return fmt.Errorf("writing config: %w", err)
	}

	if err := updateHTMLTitle(dest, name); err != nil {
		return fmt.Errorf("updating html title: %w", err)
	}

	fmt.Printf("Created new Deuda project at %s\n", dest)
	fmt.Printf("  cd %s\n", dest)
	fmt.Printf("  npm install\n")
	fmt.Printf("  deuda build\n")

	return nil
}

func copyEmbedded(dest string) error {
	return fsCopy(template.Files, "files", dest)
}

func fsCopy(srcFS interface{ ReadDir(string) ([]os.DirEntry, error); ReadFile(string) ([]byte, error) }, prefix, dest string) error {
	entries, err := srcFS.ReadDir(prefix)
	if err != nil {
		return err
	}

	for _, entry := range entries {
		srcPath := filepath.Join(prefix, entry.Name())
		destPath := filepath.Join(dest, entry.Name())

		if entry.IsDir() {
			if err := os.MkdirAll(destPath, 0755); err != nil {
				return err
			}
			if err := fsCopy(srcFS, srcPath, destPath); err != nil {
				return err
			}
		} else {
			data, err := srcFS.ReadFile(srcPath)
			if err != nil {
				return err
			}
			if err := os.WriteFile(destPath, data, 0644); err != nil {
				return err
			}
		}
	}

	return nil
}

func updateHTMLTitle(dir, name string) error {
	path := filepath.Join(dir, "index.html")
	data, err := os.ReadFile(path)
	if err != nil {
		return err
	}
	updated := strings.ReplaceAll(string(data), "Deuda Site", name)
	return os.WriteFile(path, []byte(updated), 0644)
}

func writeConfig(dir string, cfg *config.SiteConfig) error {
	path := filepath.Join(dir, "deuda.yaml")

	yml := fmt.Sprintf(`title: %q
description: %q
base: "/"
language: "en"

navigation:
  - label: "Home"
    path: "/"
`, cfg.Title, cfg.Description)

	return os.WriteFile(path, []byte(yml), 0644)
}
