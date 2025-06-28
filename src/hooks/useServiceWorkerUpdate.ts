import { useState, useEffect } from "react";

export const useServiceWorkerUpdate = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Simple service worker update detection
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready
        .then((registration) => {
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  setUpdateAvailable(true);
                }
              });
            }
          });
        })
        .catch((error) => {
          console.log("SW ready error:", error);
        });
    }
  }, []);

  const applyUpdate = async () => {
    console.log("Applying update - clearing caches and reloading");

    try {
      // Clear all caches before reloading
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }

      // Clear service worker registrations
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((reg) => reg.unregister()));
      }
    } catch (error) {
      console.error("Cache clearing failed:", error);
    }

    // Force reload with cache bypass
    location.reload();
  };

  const dismissUpdate = () => {
    console.log("Dismissing update");
    setUpdateAvailable(false);
  };

  return {
    updateAvailable,
    applyUpdate,
    dismissUpdate,
  };
};
