import { useEffect, useRef } from "react";

// Custom hook to watch the element's background color and update the theme color
export const useSyncThemeColorToBackground = (ref) => {
  const animationFrameId = useRef(null);
  const isTransitioning = useRef(false);

  // Function to update the PWA theme color meta tag
  const updateThemeColor = (color) => {
    let metaTag = document.querySelector('meta[name="theme-color"]');
    if (!metaTag) {
      metaTag = document.createElement("meta");
      metaTag.name = "theme-color";
      document.head.appendChild(metaTag);
    }
    metaTag.content = color;
  };

  const setColor = () => {
    const computedStyle = window.getComputedStyle(ref.current);
    const currentColor = computedStyle.backgroundColor;
    updateThemeColor(currentColor);
  };

  // Function to get the current background color and update the theme color
  const updateColor = () => {
    if (ref.current && isTransitioning.current) {
      setColor();
      animationFrameId.current = requestAnimationFrame(updateColor);
    }
  };

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    setColor(); // sync color on load

    // Start polling when the transition begins
    const handleTransitionStart = (event) => {
      if (event.propertyName === "background-color") {
        isTransitioning.current = true;
        // Cancel any existing animation frame to avoid duplicates
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
        // Start the requestAnimationFrame loop
        updateColor();
      }
    };

    // Stop polling when the transition ends
    const handleTransitionEnd = (event) => {
      if (event.propertyName === "background-color") {
        isTransitioning.current = false;
        // Cancel the animation frame loop
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
        // Update one last time to ensure the final color is set
        const computedStyle = window.getComputedStyle(element);
        const finalColor = computedStyle.backgroundColor;
        updateThemeColor(finalColor);
      }
    };

    // Add event listeners
    element.addEventListener("transitionstart", handleTransitionStart);
    element.addEventListener("transitionend", handleTransitionEnd);

    // Cleanup event listeners and animation frame on unmount
    return () => {
      element.removeEventListener("transitionstart", handleTransitionStart);
      element.removeEventListener("transitionend", handleTransitionEnd);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      isTransitioning.current = false;
    };
  }, [ref]);

  return null;
};
