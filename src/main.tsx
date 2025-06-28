import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";

// Global error handler for cache corruption
const handleGlobalError = (event: ErrorEvent) => {
  const error = event.error || event.message;
  const errorStr = error?.toString() || "";

  // Check for cache-related errors
  if (
    errorStr.includes("Unexpected EOF") ||
    errorStr.includes("Loading chunk") ||
    errorStr.includes("Failed to fetch")
  ) {
    console.error(
      "Cache corruption detected, clearing caches and reloading:",
      errorStr,
    );

    // Clear all caches and reload
    if ("caches" in window) {
      caches.keys().then((names) => {
        Promise.all(names.map((name) => caches.delete(name))).then(() =>
          location.reload(),
        );
      });
    } else {
      location.reload();
    }
  }
};

// Set up global error handlers
window.addEventListener("error", handleGlobalError);
window.addEventListener("unhandledrejection", (event) => {
  const errorStr = event.reason?.toString() || "";
  if (
    errorStr.includes("Unexpected EOF") ||
    errorStr.includes("Loading chunk") ||
    errorStr.includes("Failed to fetch")
  ) {
    console.error("Promise rejection - cache corruption detected:", errorStr);
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
