import { useEffect, useState } from 'react';

export const useServiceWorkerUpdate = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(reg => {
        if (reg) {
          setRegistration(reg);
          
          // Check for updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setUpdateAvailable(true);
                }
              });
            }
          });
        }
      });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', event => {
        if (event.data && event.data.type === 'CACHE_UPDATED') {
          setUpdateAvailable(true);
        }
      });
    }
  }, []);

  const applyUpdate = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  const dismissUpdate = () => {
    setUpdateAvailable(false);
  };

  return {
    updateAvailable,
    applyUpdate,
    dismissUpdate,
  };
};