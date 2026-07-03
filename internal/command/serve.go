package command

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/narmadainfosys/deuda/internal/config"
	"github.com/narmadainfosys/deuda/internal/generate"
)

type ServeCommand struct{}

func (c *ServeCommand) Name() string  { return "serve" }
func (c *ServeCommand) Usage() string { return "deuda serve [--dir <path>] [--port <port>]" }
func (c *ServeCommand) Short() string { return "Start the development server" }

func (c *ServeCommand) Run(args []string) error {
	fs := newFlagSet("serve")
	dir := fs.String("dir", ".", "project directory")
	port := fs.String("port", "5173", "dev server port")

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

	fmt.Printf("Starting dev server at http://localhost:%s\n", *port)
	cmd := exec.Command("npm", "run", "dev", "--", "--port", *port)
	cmd.Dir = projDir
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Stdin = os.Stdin

	if err := cmd.Run(); err != nil {
		return fmt.Errorf("dev server: %w", err)
	}

	return nil
}
