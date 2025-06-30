import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";

// Simple error recovery for cache issues
window.addEventListener("error", (event) => {
  const errorStr = event.error?.toString() || event.message || "";
  if (
    errorStr.includes("Unexpected EOF") ||
    errorStr.includes("Loading chunk")
  ) {
    console.error("Cache issue detected, reloading:", errorStr);
    location.reload();
  }
});

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <ConvexProvider client={convex}>
        <App />
      </ConvexProvider>
    </ErrorBoundary>
  </StrictMode>,
);
