import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { siteConfig } from "./generated/config.js";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename={siteConfig.base || "/"}>
      <App />
    </BrowserRouter>
  </StrictMode>
);
