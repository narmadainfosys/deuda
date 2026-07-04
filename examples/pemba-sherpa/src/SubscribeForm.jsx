import { useState } from "react";
import { siteConfig } from "./generated/config.js";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setMsg("");

    try {
      const res = await fetch(`${siteConfig.apiUrl}/api/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMsg(data.message || "Check your email to verify.");
        setEmail("");
      } else if (res.status === 409) {
        setStatus("error");
        setMsg("This email is already subscribed.");
      } else {
        setStatus("error");
        setMsg(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMsg("Unable to connect to the server.");
    }
  }

  return (
    <div className="subscribe-card">
      <div className="text-center">
        <div className="subscribe-icon mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
          </svg>
        </div>
        <h2 className="h4 mb-2">Stay Inspired</h2>
        <p className="mb-4">Subscribe to receive updates about Pemba's journey and inspiring stories from the mountains.</p>
      </div>
      <form onSubmit={handleSubmit} className="row g-3 justify-content-center">
        <div className="col-md-8">
          <input
            type="email"
            className="subscribe-input w-100"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === "loading"}
            aria-label="Email address"
          />
        </div>
        <div className="col-md-4">
          <button type="submit" className="subscribe-btn w-100" disabled={status === "loading"}>
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </button>
        </div>
      </form>
      {msg && (
        <div className={`subscribe-message ${status}`} style={{ display: "block" }}>
          {msg}
        </div>
      )}
    </div>
  );
}
