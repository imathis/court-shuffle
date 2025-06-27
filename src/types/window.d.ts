/// <reference types="vite-plugin-pwa/client" />

declare global {
  interface Window {
    courtShuffle?: {
      gameRecoveryNeeded?: boolean;
    };
  }
}

export {};
