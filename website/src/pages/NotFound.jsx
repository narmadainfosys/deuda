import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center">
      <span className="text-6xl font-display font-bold text-stone-300">404</span>
      <h1 className="text-2xl font-display font-bold text-ink mt-4">
        This page does not dance
      </h1>
      <p className="text-stone-600 mt-2">
        The page you're looking for isn't part of the circle.
      </p>
      <Link
        to="/"
        className="inline-block mt-6 px-6 py-2.5 bg-ink text-fog rounded-full font-medium text-sm hover:bg-ink/90 transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
