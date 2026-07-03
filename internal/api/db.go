package api

import (
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"fmt"
	"os"
	"path/filepath"
	"time"

	_ "modernc.org/sqlite"
)

type DB struct {
	db *sql.DB
}

type Subscriber struct {
	ID        int64  `json:"id"`
	Email     string `json:"email"`
	Verified  bool   `json:"verified"`
	CreatedAt string `json:"created_at"`
}

type Contact struct {
	ID        int64  `json:"id"`
	Name      string `json:"name"`
	Email     string `json:"email"`
	Message   string `json:"message"`
	CreatedAt string `json:"created_at"`
}

type Sponsor struct {
	ID        int64  `json:"id"`
	Name      string `json:"name"`
	Email     string `json:"email"`
	Amount    string `json:"amount,omitempty"`
	Message   string `json:"message,omitempty"`
	CreatedAt string `json:"created_at"`
}

func OpenDB(dataDir string) (*DB, error) {
	if err := os.MkdirAll(dataDir, 0755); err != nil {
		return nil, fmt.Errorf("creating data dir: %w", err)
	}

	path := filepath.Join(dataDir, "deuda.db")
	db, err := sql.Open("sqlite", path+"?_journal_mode=WAL&_busy_timeout=5000")
	if err != nil {
		return nil, fmt.Errorf("opening db: %w", err)
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("pinging db: %w", err)
	}

	d := &DB{db: db}
	if err := d.migrate(); err != nil {
		return nil, fmt.Errorf("migrating: %w", err)
	}

	return d, nil
}

func (d *DB) Close() error {
	return d.db.Close()
}

func (d *DB) migrate() error {
	schema := `
	CREATE TABLE IF NOT EXISTS subscribers (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		email TEXT UNIQUE NOT NULL,
		verified INTEGER DEFAULT 0,
		token TEXT UNIQUE,
		created_at TEXT DEFAULT (datetime('now'))
	);

	CREATE TABLE IF NOT EXISTS contacts (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		email TEXT NOT NULL,
		message TEXT NOT NULL,
		created_at TEXT DEFAULT (datetime('now'))
	);

	CREATE TABLE IF NOT EXISTS sponsors (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		email TEXT NOT NULL,
		amount TEXT DEFAULT '',
		message TEXT DEFAULT '',
		created_at TEXT DEFAULT (datetime('now'))
	);
	`
	_, err := d.db.Exec(schema)
	return err
}

func (d *DB) AddSubscriber(email string) (string, error) {
	token, err := generateToken()
	if err != nil {
		return "", err
	}

	_, err = d.db.Exec(
		"INSERT INTO subscribers (email, token) VALUES (?, ?)",
		email, token,
	)
	if err != nil {
		return "", fmt.Errorf("adding subscriber: %w", err)
	}

	return token, nil
}

func (d *DB) VerifySubscriber(token string) (string, error) {
	var email string
	err := d.db.QueryRow(
		"UPDATE subscribers SET verified = 1, token = NULL WHERE token = ? RETURNING email",
		token,
	).Scan(&email)

	if err == sql.ErrNoRows {
		return "", fmt.Errorf("invalid or expired token")
	}
	if err != nil {
		return "", fmt.Errorf("verifying subscriber: %w", err)
	}

	return email, nil
}

func (d *DB) AddContact(name, email, message string) (int64, error) {
	res, err := d.db.Exec(
		"INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)",
		name, email, message,
	)
	if err != nil {
		return 0, fmt.Errorf("adding contact: %w", err)
	}

	return res.LastInsertId()
}

func (d *DB) CountSubscribers() (int, error) {
	var count int
	err := d.db.QueryRow("SELECT COUNT(*) FROM subscribers WHERE verified = 1").Scan(&count)
	return count, err
}

func generateToken() (string, error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", fmt.Errorf("generating token: %w", err)
	}

	t := hex.EncodeToString(b)
	ts := fmt.Sprintf("%x", time.Now().UnixNano())
	return ts + t[:16], nil
}
