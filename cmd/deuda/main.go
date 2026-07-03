package main

import (
	"fmt"
	"os"

	"github.com/narmadainfosys/deuda/internal/command"
)

func main() {
	if err := command.Run(os.Args); err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}
}
