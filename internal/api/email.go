package api

import (
	"fmt"
	"net/smtp"
	"os"
)

type Mailer struct {
	host     string
	port     string
	username string
	password string
	sender   string
	siteName string
}

func NewMailer() *Mailer {
	return &Mailer{
		host:     envOrDefault("SMTP_HOST", "email-smtp.us-east-1.amazonaws.com"),
		port:     envOrDefault("SMTP_PORT", "587"),
		username: os.Getenv("SMTP_USERNAME"),
		password: os.Getenv("SMTP_PASSWORD"),
		sender:   envOrDefault("SENDER_EMAIL", "i@psherpa.me"),
		siteName: envOrDefault("SITE_NAME", ""),
	}
}

func (m *Mailer) Send(to, subject, body string) error {
	if m.username == "" || m.password == "" {
		return fmt.Errorf("SMTP credentials not configured (set SMTP_USERNAME and SMTP_PASSWORD)")
	}

	from := m.sender
	if m.siteName != "" {
		from = fmt.Sprintf("%s <%s>", m.siteName, m.sender)
	}

	headers := fmt.Sprintf("From: %s\r\nTo: %s\r\nSubject: %s\r\nMIME-Version: 1.0\r\nContent-Type: text/html; charset=UTF-8\r\n", from, to, subject)
	msg := headers + "\r\n" + body

	addr := fmt.Sprintf("%s:%s", m.host, m.port)
	auth := smtp.PlainAuth("", m.username, m.password, m.host)

	return smtp.SendMail(addr, auth, m.sender, []string{to}, []byte(msg))
}

func (m *Mailer) SendVerification(email, siteURL, token string) error {
	link := fmt.Sprintf("%s/api/verify?token=%s", siteURL, token)
	subject := "Verify your email subscription"
	body := fmt.Sprintf(`<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: sans-serif; padding: 2rem; max-width: 600px;">
  <h2>Please verify your email</h2>
  <p>Thanks for subscribing! Click the link below to confirm your email address:</p>
  <p><a href="%s" style="display: inline-block; padding: 12px 24px; background: #1a1a2e; color: #fff; text-decoration: none; border-radius: 6px;">Verify Email</a></p>
  <p style="color: #666; font-size: 14px;">If you didn't subscribe, you can ignore this email.</p>
</body>
</html>`, link)

	return m.Send(email, subject, body)
}

func (m *Mailer) SendWelcome(email, siteName string) error {
	subject := "Welcome to " + siteName
	body := fmt.Sprintf(`<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: sans-serif; padding: 2rem; max-width: 600px;">
  <h2>Welcome to %s!</h2>
  <p>Your email has been verified. You'll now receive updates from us.</p>
  <p style="color: #666; font-size: 14px;">You can unsubscribe at any time.</p>
</body>
</html>`, siteName)

	return m.Send(email, subject, body)
}

func (m *Mailer) SendContactNotification(name, email, message, siteName string) error {
	subject := "New contact from " + siteName
	body := fmt.Sprintf(`<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: sans-serif; padding: 2rem; max-width: 600px;">
  <h2>New Contact Message</h2>
  <table style="width: 100%%; border-collapse: collapse;">
    <tr><td style="padding: 8px; font-weight: bold; color: #666;">Name:</td><td style="padding: 8px;">%s</td></tr>
    <tr><td style="padding: 8px; font-weight: bold; color: #666;">Email:</td><td style="padding: 8px;">%s</td></tr>
    <tr><td style="padding: 8px; font-weight: bold; color: #666;">Message:</td><td style="padding: 8px;">%s</td></tr>
  </table>
</body>
</html>`, name, email, message)

	return m.Send(os.Getenv("NOTIFY_EMAIL"), subject, body)
}

func envOrDefault(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}
