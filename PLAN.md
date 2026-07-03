# Deuda — Plan

## Identity

Deuda is a Go static site generator that produces React SPAs. Named after the circle dance of farwest Nepal, it orchestrates content, components, and data into harmonious static sites with an optional API backend.

**Single binary. One toolchain. Zero server runtime.**

---

## Architecture

```
┌─────────────────────────────────────────────┐
│                  deuda CLI                   │
│  new  │  build  │  serve  │  (api)  │  reg   │
└──────────┬──────────────────────┬───────────┘
           │                      │
           ▼                      ▼
   ┌──────────────┐     ┌──────────────────┐
   │  content/    │     │   React SPA      │
   │  pages/*.md  │────▶│   src/generated/ │────▶ dist/
   │  deuda.yaml  │     │   pages.js       │       ├── index.html
   └──────────────┘     │   config.js      │       ├── 404.html
                        └──────────────────┘       └── assets/
```

### Static sites (no backend needed)
- `deuda build` → `dist/` → deploy to any static host (Netcup, GitHub Pages, S3)
- Full React SPA hydration from static HTML
- 404.html fallback for client-side routing

### Sites with a backend
- Set `api.enabled: true` in `deuda.yaml`
- `deuda build` generates site + compiles the Go API binary
- Docker image embeds both: nginx for static files, Go binary for API
- SQLite for persistence

---

## Current State (v0.1.0)

### What works
- `deuda new`: Scaffolds a project from embedded React template, runs `npm install`
- `deuda build`: Reads markdown from `content/pages/`, generates React page data, runs Vite build, copies 404.html
- `deuda serve`: Generates + starts Vite dev server on port 4444 (configurable with `--port`)
- Default template: minimal Vite + React SPA with dynamic routing, responsive CSS, nav/footer shell
- `deuda.narmadainfosys.github.io` — marketing site live via GitHub Actions + Pages
- Goldmark markdown parsing with GFM, YAML frontmatter, draft filtering

### Code structure
```
cmd/deuda/main.go        CLI entry
internal/
  command/               new, build, serve commands
  config/                deuda.yaml loader
  generate/              markdown → React page data generator
  scaffold/              project scaffolder (copies embedded template)
  template/              go:embed of the React template
pkg/deuda/               public Go API types
website/                 Deuda's own marketing site (Vite + React + Tailwind)
```

---

## Deployment Strategy

### Primary: Netcup VPS (152.53.209.149)

```
deuda.narmadainfosys.com ──▶ Netcup VPS ──▶ Docker ──▶ nginx + (optional) Go API
                                                                       │
                                                                       ▼
                                                                   SQLite
```

**Why Netcup over GitHub Pages:**
| Capability | GitHub Pages | Netcup VPS |
|------------|-------------|------------|
| Custom API/backend | ❌ | ✅ Go API binary |
| SQLite / persistence | ❌ | ✅ Docker volumes |
| Built with Deuda registry | ❌ | ✅ self-hosted |
| Custom nginx config | ❌ | ✅ full control |
| Server-side rendering | ❌ | ✅ possible |
| WebSockets | ❌ | ✅ |
| Multiple sites on one host | ❌ | ✅ nginx server blocks |

**Deployment pipeline:**
1. GitHub Actions builds the site (`deuda build`)
2. Action pushes to server via rsync over SSH
3. nginx serves `dist/` directly (zero-downtime with symlink swap)

### Fallback: GitHub Pages
- `narmadainfosys.github.io/deuda` mirrors the marketing site
- Automatically deploys on push to `main` (when `website/` changes)
- Used as CDN fallback

---

## Domain Plan

| Domain | Purpose | Host | Status |
|--------|---------|------|--------|
| `deuda.narmadainfosys.com` | Deuda marketing site, docs, registry | Netcup VPS | ❌ Not set up |
| `psherpa.me` + `pemba.narmadainfosys.com` | Pemba Sherpa biography | Netcup VPS | ❌ Migrating from AWS |
| `chintan.narmadainfosys.com` | Chintan Raj Bhandari biography | Netcup VPS | ❌ Not started |
| `bipin.narmadainfosys.com` | Bipin Karki biography | Netcup VPS | ❌ Not started |
| `narmadainfosys.github.io/deuda` | GitHub Pages fallback for Deuda | GitHub Pages | ✅ Live |
| `narmadainfosys.com` | Org homepage (WordPress) | Current hosting | ✅ Live |

**Setup `deuda.narmadainfosys.com`:**
1. Add A record pointing to `152.53.209.149` (Netcup) on the DNS provider for `narmadainfosys.com`
2. Configure nginx server block for `deuda.narmadainfosys.com`
3. Get SSL via Let's Encrypt (certbot)
4. Deploy the build output

**Showcase on narmadainfosys.com:**
- Add a "Projects" section or "Tools" page on the WordPress site linking to `deuda.narmadainfosys.com`
- Short description: "Deuda — a static site generator from Farwest Nepal"

---

## "Built with Deuda" Registry

### How it works

In `deuda.yaml`:
```yaml
build_with_deuda: true
```

During `deuda build`, the CLI POSTs to `deuda.narmadainfosys.com/api/register`:
```json
{
  "title": "Pemba Sherpa",
  "url": "https://psherpa.me",
  "description": "First kidney transplant survivor to summit Everest",
  "version": "deuda v0.1.0"
}
```

**Registry API** (Go, runs on Netcup):
- `POST /api/register` — accepts site metadata, stores in SQLite
- `GET /api/sites` — returns all registered sites (JSON)
- `GET /built-with-deuda` — static showcase page, regenerated on registration

**Privacy**: Only what's in `deuda.yaml` — title, description, URL. No tracking. Opt-in only.

---

## Biography Site Migrations

All three sites share the same target architecture:

```
Cloudflare DNS ──▶ Netcup VPS ──▶ Docker ──▶ nginx ──▶ static files
                                                │
                                                └──▶ Go API (if needed)
                                                      │
                                                      ▼
                                                    SQLite
```

### 1. Pemba Sherpa (psherpa.me / pemba.narmadainfosys.com)

**Source**: AWS (S3 + CloudFront + 5 Lambda + 3 DynamoDB + SES + API Gateway)

**Migration steps**:
1. Create Deuda project at `examples/pemba-sherpa/`
2. Convert existing HTML pages to markdown, preserve design
3. Replace 5 Lambda functions with one Go API binary:
   - `POST /api/subscribe` — email subscriptions (SES)
   - `POST /api/contact` — contact form
   - `GET /api/verify` — email verification
   - Replace DynamoDB tables with SQLite (subscribers, contacts, sponsors tables)
4. Deploy to Netcup Docker: nginx + Go API + SQLite
5. Switch Cloudflare DNS from CloudFront to Netcup
6. Keep AWS as rollback for 30 days

**Data already exported**: 3 DynamoDB tables → JSON in `infra_admin/01_docs/system/deployments/pemba-sherpa-migration-discovery/`

### 2. Chintan Raj Bhandari (chintan.narmadainfosys.com)

**Source**: S3 bucket (gwoe AWS account) + CloudFront E3HHKMWD74DNOV

**Migration steps**:
1. Inspect S3 bucket for content
2. Create Deuda project at `examples/chintan-bio/`
3. Convert content to markdown
4. Deploy to same Netcup server (additional nginx server block)
5. Set up DNS via Cloudflare

### 3. Bipin Karki (bipin.narmadainfosys.com)

**Source**: Local Vue 3 + Vite project at `/Users/bishisht/work/biographical_websites/bipindai/`

**Migration steps**:
1. Read existing Vue project, extract content and design patterns
2. Rebuild as markdown + Deuda React template at `examples/bipin-karki/`
3. Preserve visual design language
4. Deploy alongside others on Netcup

---

## Roadmap

### v0.1.0 (Current)
- ✅ CLI scaffold, build, serve
- ✅ Markdown + frontmatter → React SPA
- ✅ Embedded template
- ✅ GitHub Pages deployment

### v0.2.0 (Next)
- Set up `deuda.narmadainfosys.com` on Netcup (Docker + nginx + SSL)
- Migrate Deuda's own site from GitHub Pages to Netcup as primary
- `deuda deploy` command (SSH + rsync)
- `build_with_deuda` — registry API + CLI integration
- Pemba Sherpa → Deuda project (content + Go API replacement)

### v0.3.0
- Chintan Raj Bhandari site migration
- Bipin Karki site migration
- `deuda.yaml` schema validation
- Deuda badge in generated sites

### v0.4.0
- Custom themes support
- Image optimization pipeline
- Pagination, tags, archive pages
- RSS/Atom feed generation

### v1.0.0
- Stable API
- Full documentation
- Website showcase at `deuda.narmadainfosys.com/built-with-deuda`

---

## Design Decisions

1. **Go + React + Vite**: Go for the CLI and API backend (single binary), React for the SPA (rich ecosystem), Vite for the build (fast, modern)
2. **Markdown content, not CMS**: Simpler, git-friendly, portable. No database needed for content.
3. **No runtime dependencies**: The built site is pure static files. No PHP, no Node.js, no Ruby on the server.
4. **Optional API in the same binary**: Embed an HTTP server in the Deuda binary. One deploy for both site and backend.
5. **SQLite over PostgreSQL**: Simpler for single-server deployments. No daemon to manage. One file per site.
