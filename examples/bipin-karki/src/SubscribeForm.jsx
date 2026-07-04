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
    <div className="deuda-form subscribe-form">
      <h3>Stay Updated</h3>
      <p>Subscribe to receive news and updates.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === "loading"}
        />
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Sending..." : "Subscribe"}
        </button>
      </form>
      {msg && <p className={`form-msg ${status}`}>{msg}</p>}
    </div>
  );
}
