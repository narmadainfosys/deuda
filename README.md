# Deuda

A static site generator from Farwest Nepal — makes your components dance together.

Born in the foothills of the Himalayas, Deuda is a Go-based static site generator that produces lightning-fast, SEO-optimized React single-page applications. Named after the iconic circle dance of farwest Nepal, it orchestrates content, components, and data into harmonious static sites that can optionally serve a built-in API backend.

## Philosophy

- **Fast by default** — Static prerendering with zero runtime overhead
- **SEO built-in** — Every page is fully rendered HTML before JavaScript loads
- **Component reusability** — Shared layouts, headers, footers, and partials across all your sites
- **Single binary** — The build tool, dev server, and optional API server are one Go binary
- **SPA hydration** — Static HTML hydrates into a React SPA for silky navigation

## Quick Start

```bash
# Install
go install github.com/narmadainfosys/deuda/cmd/deuda@latest

# Create a new site
deuda new my-site

# Build
cd my-site && deuda build

# Develop
deuda serve
```

## Sites Built with Deuda

- [Pemba Sherpa](https://psherpa.me) — First kidney transplant survivor to summit Everest
- Chintan Raj Bhandari — Coming soon
- Bipin Karki — Coming soon

## License

MIT
