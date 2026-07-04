import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
      <h1>404</h1>
      <p>The page you're looking for doesn't exist.</p>
      <p><Link to="/">Go home</Link></p>
    </div>
  );
}
