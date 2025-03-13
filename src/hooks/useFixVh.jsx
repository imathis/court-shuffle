import { useEffect } from "react";
import { useDebouncedUiCallback } from "./useDebounce";

/**
 * Hook to fix viewport height issues on mobile browsers
 * Sets a CSS variable --vh that can be used instead of vh units
 * Usage example: max-height: calc(var(--vh, 1vh) * 100);
 */
const useFixVh = () => {
  // Create a debounced function to update the --vh CSS variable
  const updateVh = useDebouncedUiCallback(
    () => {
      // Calculate viewport height in pixels (1% of the window height)
      const vh = window.innerHeight * 0.01;
      // Set the --vh CSS variable on the document root
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    },
    [],
    100,
  ); // 100ms debounce is usually sufficient

  useEffect(() => {
    // Set the initial value
    updateVh();

    // Add event listener for window resize
    window.addEventListener("resize", updateVh);

    // Add event listener for orientation change (important for mobile)
    window.addEventListener("orientationchange", updateVh);

    // Clean up event listeners on unmount
    return () => {
      window.removeEventListener("resize", updateVh);
      window.removeEventListener("orientationchange", updateVh);
    };
  }, [updateVh]);
};

export { useFixVh };
