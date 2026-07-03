package config

import (
	"fmt"
	"os"

	"gopkg.in/yaml.v3"
)

type SiteConfig struct {
	Title       string    `yaml:"title"`
	Description string    `yaml:"description"`
	Base        string    `yaml:"base"`
	Language    string    `yaml:"language"`
	Author      string    `yaml:"author"`
	Navigation  []NavItem `yaml:"navigation"`
}

type NavItem struct {
	Label string `yaml:"label"`
	Path  string `yaml:"path"`
}

func Load(path string) (*SiteConfig, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("reading config: %w", err)
	}

	var cfg SiteConfig
	if err := yaml.Unmarshal(data, &cfg); err != nil {
		return nil, fmt.Errorf("parsing config: %w", err)
	}

	if cfg.Base == "" {
		cfg.Base = "/"
	}
	if cfg.Language == "" {
		cfg.Language = "en"
	}

	return &cfg, nil
}

func Default(name string) *SiteConfig {
	return &SiteConfig{
		Title:       name,
		Description: "A site built with Deuda",
		Base:        "/",
		Language:    "en",
		Navigation: []NavItem{
			{Label: "Home", Path: "/"},
		},
	}
}
