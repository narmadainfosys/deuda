import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { siteConfig } from "./generated/config.js";
import "./pemba.css";

const navItems = [
  { label: "Home", path: "/", icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" },
  { label: "Gallery", path: "/gallery", icon: "M3 3h18v18H3z M8.5 8.5h.01 M21 15l-5-5-11 11" },
  { label: "Journey Map", path: "/journey-map", icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z M12 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" },
  { label: "Videos", path: "/videos", icon: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M10 8l6 4-6 4z" },
  { label: "Philanthropy", path: "/philanthropy", icon: "M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 11c0 5.65-7 10-7 10z" },
  { label: "7-Summit", path: "/7-summit", icon: "M7 20h10l-5-6-5 6z M12 4v10 M5 10l7-6 7 6" },
  { label: "Subscribe", path: "/#subscribe", icon: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6" },
  { label: "Contact", path: "/contact", icon: "M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" },
];

function NavIcon({ d }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {d.split(" M").map((part, i) => {
        const path = i === 0 ? part : "M" + part;
        const isCircle = path.startsWith("M") && !path.includes(" ");
        if (isCircle && path.includes("z")) return <circle key={i} cx={path.split(" ")[1]} cy={path.split(" ")[2]} r={path.split(" ")[3]?.replace("z","")} />;
        return <path key={i} d={path} />;
      })}
    </svg>
  );
}

function MobileMenu({ open, onClose }) {
  const [theme, setThemeState] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  function toggleMobileTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setThemeState(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    window.dispatchEvent(new CustomEvent("themechange", { detail: { theme: next } }));
  }

  return (
    <>
      <div className={`mobile-menu-overlay ${open ? "active" : ""}`} onClick={onClose} />
      <div className={`mobile-menu ${open ? "active" : ""}`}>
        <div className="mobile-menu-header">
          <div className="mobile-menu-title">Menu</div>
          <button className="mobile-menu-close" onClick={onClose} aria-label="Close menu">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <nav className="mobile-menu-nav">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className="nav-link" onClick={onClose}>
              <NavIcon d={item.icon} /> {item.label}
            </Link>
          ))}
        </nav>
        <div className="mobile-menu-divider" />
        <div className="mobile-menu-social">
          <a href="https://www.instagram.com/psher.paa/" className="social-link" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37a4 4 0 1 1-1.37-1.37 4 4 0 0 1 1.37 1.37z" /><line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
            </svg>
          </a>
          <button className="theme-toggle" onClick={toggleMobileTheme} aria-label="Toggle dark mode">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

export default function PembaShell() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const handler = (e) => setTheme(e.detail.theme);
    window.addEventListener("themechange", handler);
    return () => window.removeEventListener("themechange", handler);
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  }

  function isActive(path) {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  }

  return (
    <div className="site-wrapper">
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="toolbar">
        <button className="mobile-menu-toggle" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div className="toolbar-left">
          {navItems.slice(0, 6).map((item) => (
            <Link key={item.path} to={item.path} className={`nav-link ${isActive(item.path) ? "active" : ""}`}>
              <NavIcon d={item.icon} /> {item.label}
            </Link>
          ))}
        </div>
        <div className="toolbar-right">
          <div id="google_translate_element" />
          <a href="https://www.instagram.com/psher.paa/" className="social-link" target="_blank" rel="noopener noreferrer" aria-label="Instagram @psher.paa">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37a4 4 0 1 1-1.37-1.37 4 4 0 0 1 1.37 1.37z" /><line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
            </svg>
          </a>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle dark mode">
            <svg style={{ display: theme === "dark" ? "none" : "block" }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            <svg style={{ display: theme === "dark" ? "block" : "none" }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>
        </div>
      </div>

      <main className="site-main container">
        <Outlet />
      </main>

      <a href="https://wa.me/9779849656231" className="whatsapp-btn" target="_blank" rel="noopener noreferrer" aria-label="Contact Pemba on WhatsApp">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>

      <footer className="py-4 text-center site-footer">
        <div>About Pemba Sherpa &mdash; resilience, recovery, and the heights of human spirit.</div>
        <div className="mt-1 small">Follow on Instagram: <a href="https://www.instagram.com/psher.paa/">@psher.paa</a></div>
        <div className="mt-1 small">Made for Son of Nepal, by sons/daughters of Nepal.</div>
      </footer>
    </div>
  );
}
