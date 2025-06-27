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

  const applyUpdate = () => {
    console.log("Applying update - reloading page");
    window.location.reload();
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
