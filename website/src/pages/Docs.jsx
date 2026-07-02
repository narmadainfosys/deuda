import { Link } from "react-router-dom";

const SECTIONS = [
  {
    id: "overview",
    title: "Overview",
    content: (
      <>
        <p>
          <strong>Deuda</strong> is a static site generator written in Go. Named after the
          traditional circle dance of farwest Nepal, it brings rhythm and structure to how
          you build websites.
        </p>
        <p>
          Unlike traditional SSGs that output plain HTML, or heavy frameworks that require
          a running server, Deuda gives you the best of both worlds: static HTML pages that
          load instantly, hydrating into a full React SPA for seamless navigation.
        </p>
      </>
    ),
  },
  {
    id: "features",
    title: "Features",
    content: (
      <>
        <h3>Static Prerendering</h3>
        <p>
          Every page is rendered to static HTML at build time. No server round-trips,
          no JavaScript required for initial content. Your pages load instantly and work
          even with JavaScript disabled.
        </p>

        <h3>React SPA Hydration</h3>
        <p>
          Once loaded, the static HTML hydrates into a fully interactive React SPA.
          Navigation between pages is instant — no full page reloads. This gives you
          the SEO and performance of a static site with the UX of a modern web app.
        </p>

        <h3>Component Reuse</h3>
        <p>
          Define layouts, headers, footers, and partials once. Share them across all your
          sites. Deuda composes these into every page at build time — no runtime overhead.
        </p>

        <h3>Built-in API Server</h3>
        <p>
          Need a contact form, email subscription, or auth? Deuda ships an optional
          API server. Same binary, same deployment. SQLite-backed, ready to go.
        </p>

        <h3>Single Binary</h3>
        <p>
          Everything — the build tool, the dev server, the API server — is a single Go
          binary. No Node.js, no Ruby, no Python runtime needed on your server.
        </p>
      </>
    ),
  },
  {
    id: "configuration",
    title: "Configuration",
    content: (
      <>
        <p>
          Every Deuda project needs a <code>deuda.yaml</code> at its root:
        </p>
        <pre>{`title: "My Site"
description: "Built with Deuda"
base_url: "https://example.com"
language: "en"
author: "Your Name"

theme: "default"
pages_dir: "pages"
output_dir: "dist"
static_dir: "static"

navigation:
  - label: Home
    path: /
  - label: About
    path: /about

api:
  enabled: true
  port: 8080`}</pre>
      </>
    ),
  },
  {
    id: "pages",
    title: "Pages & Content",
    content: (
      <>
        <p>
          Pages are Markdown files with YAML frontmatter placed in the <code>pages/</code> directory:
        </p>
        <pre>{`---
title: About Pemba Sherpa
layout: default
date: 2026-01-04
published: true
---

Pemba Sherpa is the first kidney transplant survivor to
successfully summit Mount Everest on **May 14, 2025**.

## The Climb

After receiving a life-saving kidney transplant in 2023,
Pemba trained for two years to achieve what many thought
impossible.`}</pre>
        <p>
          Deuda renders each page to static HTML, applies the layout, and generates
          a React route for client-side navigation.
        </p>
      </>
    ),
  },
  {
    id: "deploy",
    title: "Deployment",
    content: (
      <>
        <p>Build your site and deploy the output directory anywhere:</p>
        <pre>{`# Build
deuda build

# Output goes to dist/
# Deploy dist/ to any static host:
# - Nginx on your VPS
# - GitHub Pages
# - Cloudflare Pages
# - Netlify
# - S3 + CloudFront`}</pre>
      </>
    ),
  },
];

export default function Docs() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-display font-bold text-ink mb-2">Documentation</h1>
      <p className="text-stone-600 mb-12">
        Everything you need to know about Deuda.
      </p>

      <div className="flex gap-2 flex-wrap mb-10 pb-6 border-b border-stone-200">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="text-sm px-3 py-1 rounded-full bg-stone-100 text-stone-600 hover:bg-ridge/10 hover:text-ridge transition-colors"
          >
            {s.title}
          </a>
        ))}
      </div>

      <div className="prose-deuda">
        {SECTIONS.map((s) => (
          <section key={s.id} id={s.id}>
            <h2 className="text-2xl font-display font-bold text-ink mt-12 mb-4">{s.title}</h2>
            {s.content}
          </section>
        ))}
      </div>

      <div className="mt-16 p-6 rounded-2xl bg-ridge/5 border border-ridge/10 text-center">
        <p className="text-sm text-stone-700">
          Deuda is in active development. The API may change before v1.0.
        </p>
        <p className="text-sm text-stone-500 mt-1">
          Follow along on{" "}
          <a
            href="https://github.com/narmadainfosys/deuda"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ridge hover:underline"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </div>
  );
}
