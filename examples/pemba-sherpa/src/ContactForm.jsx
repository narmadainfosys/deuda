import { useState } from "react";
import { siteConfig } from "./generated/config.js";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setMsg("");

    try {
      const res = await fetch(`${siteConfig.apiUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMsg(data.message || "Message sent!");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
        setMsg(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMsg("Could not reach the server.");
    }
  }

  return (
    <div className="hero-card">
      <h2 className="h4 mb-3">Get in Touch</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input type="text" className="subscribe-input w-100" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required disabled={status === "loading"} />
        </div>
        <div className="mb-3">
          <input type="email" className="subscribe-input w-100" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={status === "loading"} />
        </div>
        <div className="mb-3">
          <textarea className="subscribe-input w-100" placeholder="Your message..." value={message} onChange={(e) => setMessage(e.target.value)} required rows={5} disabled={status === "loading"} style={{ resize: "vertical" }} />
        </div>
        <button type="submit" className="subscribe-btn" disabled={status === "loading"}>
          {status === "loading" ? "Sending..." : "Send Message"}
        </button>
      </form>
      {msg && (
        <div className={`subscribe-message ${status}`} style={{ display: "block", marginTop: "1rem" }}>
          {msg}
        </div>
      )}
    </div>
  );
}
