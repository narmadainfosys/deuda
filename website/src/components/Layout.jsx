import { Link, Outlet, useLocation } from "react-router-dom";

const NAV = [
  { label: "Home", path: "/" },
  { label: "Docs", path: "/docs" },
  { label: "GitHub", path: "https://github.com/narmadainfosys/deuda", external: true },
];

export default function Layout() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="w-8 h-8 rounded-full border-2 border-sunset flex items-center justify-center text-xs font-bold text-ridge">
              d
            </span>
            <span className="font-display text-lg font-bold text-ink">Deuda</span>
          </Link>
          <nav className="flex items-center gap-6">
            {NAV.map((item) =>
              item.external ? (
                <a
                  key={item.label}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-stone-600 hover:text-ink transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`text-sm transition-colors ${
                    pathname === item.path
                      ? "text-ink font-semibold"
                      : "text-stone-600 hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-stone-200 py-8 mt-16">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-stone-500">
          <p>
            Built with pride in{" "}
            <span className="font-semibold text-ink">Sudurpashchim</span>, Nepal
          </p>
          <p className="mt-1">
            <span className="text-sunset">Deuda</span> — the circle dance of farwest, reimagined as code.
          </p>
        </div>
      </footer>
    </div>
  );
}
