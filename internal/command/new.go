package command

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/narmadainfosys/deuda/internal/scaffold"
)

type NewCommand struct{}

func (c *NewCommand) Name() string  { return "new" }
func (c *NewCommand) Usage() string { return "deuda new [--dir <path>] [--skip-install] <name>" }
func (c *NewCommand) Short() string { return "Create a new Deuda project" }

func (c *NewCommand) Run(args []string) error {
	fs := newFlagSet("new")
	dir := fs.String("dir", ".", "parent directory for the project")
	skipInstall := fs.Bool("skip-install", false, "skip npm install")

	if err := fs.Parse(args); err != nil {
		return err
	}

	if fs.NArg() < 1 {
		return fmt.Errorf("project name is required\nUsage: %s", c.Usage())
	}

	name := fs.Arg(0)
	projDir := filepath.Join(*dir, name)

	if err := scaffold.New(name, *dir); err != nil {
		return fmt.Errorf("scaffold: %w", err)
	}

	if !*skipInstall {
		fmt.Println("Installing dependencies...")
		cmd := exec.Command("npm", "install")
		cmd.Dir = projDir
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr
		if err := cmd.Run(); err != nil {
			return fmt.Errorf("npm install: %w", err)
		}
	}

	return nil
}
