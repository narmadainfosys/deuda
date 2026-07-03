import { Routes, Route, Link } from "react-router-dom";
import { siteConfig } from "./generated/config.js";
import { pages } from "./generated/pages.js";
import PageShell from "./PageShell.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<PageShell />}>
        {pages.map((page) => (
          <Route
            key={page.slug}
            path={page.slug === "index" ? "/" : `/${page.slug}`}
            element={<PageContent page={page} />}
          />
        ))}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

function PageContent({ page }) {
  return (
    <article>
      <h1>{page.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: page.html }} />
    </article>
  );
}

function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
      <h1>404</h1>
      <p>The page you're looking for doesn't exist.</p>
      <p><Link to={siteConfig.base || "/"}>Go home</Link></p>
    </div>
  );
}
