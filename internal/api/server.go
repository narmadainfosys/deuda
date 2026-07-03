package api

import (
	"fmt"
	"log"
	"net/http"
	"time"
)

type Server struct {
	db       *DB
	mail     *Mailer
	port     int
	siteName string
	siteURL  string
}

type Config struct {
	Port     int
	DataDir  string
	SiteName string
	SiteURL  string
}

func New(cfg Config) (*Server, error) {
	db, err := OpenDB(cfg.DataDir)
	if err != nil {
		return nil, fmt.Errorf("database: %w", err)
	}

	mail := NewMailer()

	return &Server{
		db:       db,
		mail:     mail,
		port:     cfg.Port,
		siteName: cfg.SiteName,
		siteURL:  cfg.SiteURL,
	}, nil
}

func (s *Server) Start() error {
	mux := http.NewServeMux()

	mux.HandleFunc("/api/subscribe", s.handleSubscribe())
	mux.HandleFunc("/api/verify", s.handleVerify())
	mux.HandleFunc("/api/contact", s.handleContact())
	mux.HandleFunc("/api/health", s.handleHealth())

	handler := corsMiddleware(mux)

	addr := fmt.Sprintf(":%d", s.port)
	srv := &http.Server{
		Addr:         addr,
		Handler:      handler,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	log.Printf("API server starting on %s (site: %q)", addr, s.siteName)
	return srv.ListenAndServe()
}

func (s *Server) Close() error {
	return s.db.Close()
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}
