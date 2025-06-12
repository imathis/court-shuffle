declare global {
  interface Window {
    courtShuffle?: {
      gameRecoveryNeeded?: boolean;
    };
  }
}

export {};