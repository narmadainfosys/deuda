package api

import (
	"encoding/json"
	"net/http"
	"strings"
)

type subscribeRequest struct {
	Email string `json:"email"`
}

type contactRequest struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Message string `json:"message"`
}

type apiResponse struct {
	Status  string `json:"status"`
	Message string `json:"message,omitempty"`
	Error   string `json:"error,omitempty"`
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(v)
}

func writeError(w http.ResponseWriter, status int, msg string) {
	writeJSON(w, status, apiResponse{Status: "error", Error: msg})
}

func writeOK(w http.ResponseWriter, msg string) {
	writeJSON(w, http.StatusOK, apiResponse{Status: "ok", Message: msg})
}

func (s *Server) handleSubscribe() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			writeError(w, http.StatusMethodNotAllowed, "POST required")
			return
		}

		var req subscribeRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			writeError(w, http.StatusBadRequest, "invalid JSON")
			return
		}

		req.Email = strings.TrimSpace(req.Email)
		if req.Email == "" || !strings.Contains(req.Email, "@") {
			writeError(w, http.StatusBadRequest, "valid email is required")
			return
		}

		token, err := s.db.AddSubscriber(req.Email)
		if err != nil {
			if strings.Contains(err.Error(), "UNIQUE") {
				writeError(w, http.StatusConflict, "email already subscribed")
				return
			}
			writeError(w, http.StatusInternalServerError, "failed to subscribe")
			return
		}

		if err := s.mail.SendVerification(req.Email, s.siteURL, token); err != nil {
			writeError(w, http.StatusInternalServerError, "failed to send verification")
			return
		}

		writeOK(w, "check your email to verify subscription")
	}
}

func (s *Server) handleVerify() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			writeError(w, http.StatusMethodNotAllowed, "GET required")
			return
		}

		token := r.URL.Query().Get("token")
		if token == "" {
			writeError(w, http.StatusBadRequest, "token is required")
			return
		}

		email, err := s.db.VerifySubscriber(token)
		if err != nil {
			w.Header().Set("Content-Type", "text/html; charset=utf-8")
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Verification Failed</title></head><body style="font-family:sans-serif;padding:2rem;text-align:center;"><h2>Verification Failed</h2><p>The link is invalid or expired.</p></body></html>`))
			return
		}

		if err := s.mail.SendWelcome(email, s.siteName); err != nil {
			_ = err // log but don't block response
		}

		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Verified!</title></head><body style="font-family:sans-serif;padding:2rem;text-align:center;"><h2>Email Verified!</h2><p>Thank you for subscribing.</p></body></html>`))
	}
}

func (s *Server) handleContact() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			writeError(w, http.StatusMethodNotAllowed, "POST required")
			return
		}

		var req contactRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			writeError(w, http.StatusBadRequest, "invalid JSON")
			return
		}

		req.Name = strings.TrimSpace(req.Name)
		req.Email = strings.TrimSpace(req.Email)
		req.Message = strings.TrimSpace(req.Message)

		if req.Name == "" || req.Email == "" || req.Message == "" {
			writeError(w, http.StatusBadRequest, "name, email, and message are required")
			return
		}

		if _, err := s.db.AddContact(req.Name, req.Email, req.Message); err != nil {
			writeError(w, http.StatusInternalServerError, "failed to save message")
			return
		}

		if err := s.mail.SendContactNotification(req.Name, req.Email, req.Message, s.siteName); err != nil {
			_ = err // log but don't block response
		}

		writeOK(w, "message received")
	}
}

func (s *Server) handleHealth() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		count, _ := s.db.CountSubscribers()
		writeJSON(w, http.StatusOK, map[string]any{
			"status":             "ok",
			"verified_subscribers": count,
		})
	}
}
