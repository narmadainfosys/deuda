import { Link, Outlet } from "react-router-dom";
import { siteConfig } from "./generated/config.js";

export default function PageShell() {
  return (
    <div className="site-wrapper">
      <header className="site-header">
        <nav className="site-nav">
          <Link to="/" className="site-logo">
            {siteConfig.title}
          </Link>
          {siteConfig.nav && siteConfig.nav.length > 0 && (
            <ul className="nav-links">
              {siteConfig.nav.map((item) => (
                <li key={item.path}>
                  <Link to={item.path}>{item.label}</Link>
                </li>
              ))}
            </ul>
          )}
        </nav>
      </header>
      <main className="site-main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <p>&copy; {new Date().getFullYear()} {siteConfig.title}</p>
      </footer>
    </div>
  );
}
