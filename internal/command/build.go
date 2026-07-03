package command

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/narmadainfosys/deuda/internal/config"
	"github.com/narmadainfosys/deuda/internal/generate"
)

type BuildCommand struct{}

func (c *BuildCommand) Name() string  { return "build" }
func (c *BuildCommand) Usage() string { return "deuda build [--dir <path>]" }
func (c *BuildCommand) Short() string { return "Build the site" }

func (c *BuildCommand) Run(args []string) error {
	fs := newFlagSet("build")
	dir := fs.String("dir", ".", "project directory")

	if err := fs.Parse(args); err != nil {
		return err
	}

	projDir := *dir

	cfgPath := filepath.Join(projDir, "deuda.yaml")
	cfg, err := config.Load(cfgPath)
	if err != nil {
		return fmt.Errorf("loading config: %w", err)
	}

	gen := generate.New(projDir)
	if err := gen.Run(cfg); err != nil {
		return fmt.Errorf("generating pages: %w", err)
	}

	fmt.Println("Running Vite build...")
	cmd := exec.Command("npm", "run", "build")
	cmd.Dir = projDir
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	if err := cmd.Run(); err != nil {
		return fmt.Errorf("build failed: %w", err)
	}

	distDir := filepath.Join(projDir, "dist")
	src := filepath.Join(distDir, "index.html")
	dst := filepath.Join(distDir, "404.html")
	if input, err := os.ReadFile(src); err == nil {
		os.WriteFile(dst, input, 0644)
	}

	fmt.Println("Build complete! Output in", distDir)
	return nil
}
