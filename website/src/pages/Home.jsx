import { Link } from "react-router-dom";

const FEATURES = [
  {
    emoji: "⚡",
    title: "Blazing Fast",
    desc: "Static prerendering with zero runtime overhead. Pages load instantly.",
  },
  {
    emoji: "🔍",
    title: "SEO Built-in",
    desc: "Every page is fully rendered HTML. Search engines love it.",
  },
  {
    emoji: "🧩",
    title: "Component Reuse",
    desc: "Shared layouts, headers, footers, and partials across all your sites.",
  },
  {
    emoji: "🕺",
    title: "SPA Hydration",
    desc: "Static HTML hydrates into a React SPA for smooth navigation.",
  },
  {
    emoji: "📦",
    title: "Single Binary",
    desc: "Build tool, dev server, and API server — all one Go binary.",
  },
  {
    emoji: "🔌",
    title: "API Built-in",
    desc: "Optional API backend for forms, auth, and data persistence.",
  },
];

const SITES = [
  {
    name: "Pemba Sherpa",
    url: "https://psherpa.me",
    desc: "First kidney transplant survivor to summit Mount Everest (May 14, 2025).",
    status: "Live",
  },
  {
    name: "Chintan Raj Bhandari",
    url: "#",
    desc: "Personal biography site — coming soon.",
    status: "In progress",
  },
  {
    name: "Bipin Karki",
    url: "#",
    desc: "Personal biography site — coming soon.",
    status: "In progress",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-ridge/10 text-ridge text-xs font-medium rounded-full mb-6">
          v0.1.0 — Just danced out of farwest
        </div>
        <h1 className="text-5xl md:text-6xl font-display font-bold text-ink leading-tight">
          A static site generator
          <br />
          from{" "}
          <span className="text-sunset relative">
            Farwest Nepal
            <span className="absolute -bottom-1 left-0 right-0 h-1 bg-sunset/30 rounded-full" />
          </span>
        </h1>
        <p className="mt-6 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
          Deuda makes your components dance together. Born in the foothills of the Himalayas,
          it orchestrates content and components into lightning-fast, SEO-optimized React SPAs.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            to="/docs"
            className="px-6 py-2.5 bg-ink text-fog rounded-full font-medium text-sm hover:bg-ink/90 transition-colors"
          >
            Get Started
          </Link>
          <a
            href="https://github.com/narmadainfosys/deuda"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 border border-stone-300 rounded-full font-medium text-sm text-stone-700 hover:border-stone-400 transition-colors"
          >
            View on GitHub
          </a>
        </div>
      </section>

      {/* The dance — visual metaphor */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <div className="relative h-32 flex items-center justify-center">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full animate-pulse"
              style={{
                backgroundColor: i % 2 === 0 ? "#2f6f6d" : "#e86b3a",
                animationDelay: `${i * 0.3}s`,
                transform: `rotate(${i * 60}deg) translateY(-40px)`,
                opacity: 0.7,
              }}
            />
          ))}
          <span className="text-4xl font-display font-bold text-stone-300">⟳</span>
        </div>
        <p className="text-center text-stone-500 text-sm mt-4 italic">
          Six dancers, one rhythm — the Deuda circle
        </p>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-display font-bold text-ink text-center mb-12">
          Why Deuda?
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-2xl border border-stone-200 bg-white hover:border-sunset/20 hover:shadow-sm transition-all"
            >
              <span className="text-2xl">{f.emoji}</span>
              <h3 className="mt-3 font-semibold text-ink">{f.title}</h3>
              <p className="mt-1.5 text-sm text-stone-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sites powered by Deuda */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-display font-bold text-ink text-center mb-12">
          Powered by Deuda
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {SITES.map((site) => (
            <a
              key={site.name}
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-2xl border border-stone-200 bg-white hover:border-ridge/20 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-ink group-hover:text-ridge transition-colors">
                  {site.name}
                </h3>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    site.status === "Live"
                      ? "bg-green-100 text-green-700"
                      : "bg-stone-100 text-stone-500"
                  }`}
                >
                  {site.status}
                </span>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed">{site.desc}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Quick Start */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-display font-bold text-ink text-center mb-8">
          Quick Start
        </h2>
        <div className="bg-ink rounded-2xl p-6 text-sm font-mono text-fog overflow-x-auto">
          <pre>{`# Install
go install github.com/narmadainfosys/deuda/cmd/deuda@latest

# Create a new site
deuda new my-site

# Build static files
cd my-site && deuda build

# Start dev server with hot reload
deuda serve`}</pre>
        </div>
        <p className="text-center text-stone-500 text-sm mt-4">
          That's it. Your React SPA is ready to deploy.
        </p>
      </section>
    </>
  );
}
