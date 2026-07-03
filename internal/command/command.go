package command

import (
	"flag"
	"fmt"
	"io"
	"os"
)

type Command interface {
	Name() string
	Usage() string
	Short() string
	Run(args []string) error
}

func newFlagSet(name string) *flag.FlagSet {
	fs := flag.NewFlagSet(name, flag.ContinueOnError)
	fs.SetOutput(os.Stderr)
	fs.Usage = func() {
		fmt.Fprintf(fs.Output(), "Usage: deuda %s [options]\n\nOptions:\n", name)
		fs.PrintDefaults()
	}
	return fs
}

var commands = []Command{
	&NewCommand{},
	&BuildCommand{},
	&ServeCommand{},
}

func Run(args []string) error {
	if len(args) < 2 {
		printUsage(os.Stderr)
		return fmt.Errorf("a command is required")
	}

	sub := args[1]
	for _, cmd := range commands {
		if cmd.Name() == sub {
			return cmd.Run(args[2:])
		}
	}

	if sub == "help" || sub == "--help" || sub == "-h" {
		printUsage(os.Stdout)
		return nil
	}

	printUsage(os.Stderr)
	return fmt.Errorf("unknown command: %q", sub)
}

func printUsage(w io.Writer) {
	fmt.Fprintf(w, "Usage: deuda <command> [options]\n\nCommands:\n")
	for _, cmd := range commands {
		fmt.Fprintf(w, "  %-10s %s\n", cmd.Name(), cmd.Short())
	}
	fmt.Fprintf(w, "\nRun 'deuda <command> --help' for more information.\n")
}
