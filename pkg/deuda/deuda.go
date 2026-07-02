package deuda

// SiteConfig defines the configuration for a Deuda site.
type SiteConfig struct {
	Title       string `yaml:"title" json:"title"`
	Description string `yaml:"description" json:"description"`
	BaseURL     string `yaml:"base_url" json:"base_url"`
	Language    string `yaml:"language" json:"language"`
	Author      string `yaml:"author" json:"author"`

	Theme    string   `yaml:"theme" json:"theme"`
	PagesDir string   `yaml:"pages_dir" json:"pages_dir"`
	OutputDir string  `yaml:"output_dir" json:"output_dir"`
	StaticDir string  `yaml:"static_dir" json:"static_dir"`

	Navigation []NavItem    `yaml:"navigation" json:"navigation"`
	Plugins    []PluginConfig `yaml:"plugins" json:"plugins"`
	API        *APIConfig    `yaml:"api" json:"api,omitempty"`
}

type NavItem struct {
	Label string `yaml:"label" json:"label"`
	Path  string `yaml:"path" json:"path"`
}

type PluginConfig struct {
	Name   string         `yaml:"name" json:"name"`
	Config map[string]any `yaml:"config" json:"config"`
}

type APIConfig struct {
	Enabled bool   `yaml:"enabled" json:"enabled"`
	Port    int    `yaml:"port" json:"port"`
}

// Page represents a single page in the site.
type Page struct {
	Slug      string            `yaml:"-" json:"-"`
	Title     string            `yaml:"title" json:"title"`
	Layout    string            `yaml:"layout" json:"layout"`
	Published bool              `yaml:"published" json:"published"`
	Date      string            `yaml:"date" json:"date"`
	Draft     bool              `yaml:"draft" json:"draft"`
	Params    map[string]any    `yaml:"-" json:"-"`
	Content   string            `yaml:"-" json:"-"`
	HTML      string            `yaml:"-" json:"-"`
}
