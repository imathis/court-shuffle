import { useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";

/**
 * Hook to fix viewport height issues on mobile browsers
 * Sets a CSS variable --vh that can be used instead of vh units
 * Usage example: max-height: calc(var(--vh, 1vh) * 100);
 */
const useFixVh = () => {
  // Create a debounced function to update the --vh CSS variable
  const updateVh = useDebouncedCallback(() => {
    // Calculate viewport height in pixels (1% of the window height)
    const vh = window.innerHeight * 0.01;
    // Set the --vh CSS variable on the document root
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }, 100); // 100ms debounce is usually sufficient

  useEffect(() => {
    // Set the initial value
    updateVh();

    // Add event listener for window resize
    window.addEventListener("resize", updateVh);

    // Add event listener for orientation change (important for mobile)
    window.addEventListener("orientationchange", updateVh);

    // Clean up event listeners and cancel pending debounced calls on unmount
    return () => {
      window.removeEventListener("resize", updateVh);
      window.removeEventListener("orientationchange", updateVh);
      updateVh.cancel();
    };
  }, [updateVh]);
};

export { useFixVh };
