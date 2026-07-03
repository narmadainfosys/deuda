package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"os/signal"
	"path/filepath"
	"syscall"

	"github.com/narmadainfosys/deuda/internal/api"
)

func main() {
	port := flag.Int("port", 8080, "HTTP port")
	site := flag.String("site", "default", "site name (used for data directory)")
	dataDir := flag.String("data", "", "data directory (default: ./data/<site>)")
	siteURL := flag.String("url", "http://localhost:8080", "public URL of the site")
	siteName := flag.String("name", "", "display name for the site (defaults to --site)")

	flag.Parse()

	if *dataDir == "" {
		*dataDir = filepath.Join(".", "data", *site)
	}

	name := *siteName
	if name == "" {
		name = *site
	}

	cfg := api.Config{
		Port:     *port,
		DataDir:  *dataDir,
		SiteName: name,
		SiteURL:  *siteURL,
	}

	srv, err := api.New(cfg)
	if err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}

	go func() {
		sig := make(chan os.Signal, 1)
		signal.Notify(sig, syscall.SIGINT, syscall.SIGTERM)
		<-sig
		log.Println("Shutting down...")
		if err := srv.Close(); err != nil {
			log.Printf("Error closing: %v", err)
		}
		os.Exit(0)
	}()

	fmt.Printf("Deuda API server for %q\n", *site)
	fmt.Printf("  Port:     %d\n", *port)
	fmt.Printf("  Data:     %s\n", *dataDir)
	fmt.Printf("  URL:      %s\n", *siteURL)
	fmt.Println()

	if err := srv.Start(); err != nil {
		log.Fatalf("Server error: %v", err)
	}
}
