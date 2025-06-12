import React, { useEffect, useRef } from "react";

// Custom hook to sync the PWA theme color with an element's background color
export const useSyncThemeColorToBackground = (
  ref: React.RefObject<HTMLElement | null>,
) => {
  const animationFrameRef = useRef<number>(undefined);

  // Update the PWA theme color meta tag immediately
  const updateThemeColor = React.useCallback(() => {
    if (!ref?.current) return;
    const color = window.getComputedStyle(ref.current).backgroundColor;
    if (!color) return;

    let metaTag = document.querySelector('meta[name="theme-color"]');
    if (!metaTag) {
      metaTag = document.createElement("meta");
      metaTag.setAttribute("name", "theme-color");
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute("content", color);
  }, [ref]);

  // Continuously update during transitions using requestAnimationFrame
  const startTransitionTracking = React.useCallback(() => {
    const trackTransition = () => {
      updateThemeColor();
      animationFrameRef.current = requestAnimationFrame(trackTransition);
    };
    trackTransition();
  }, [updateThemeColor]);

  useEffect(() => {
    // Skip in non-browser environments
    if (typeof window === "undefined") return;

    const element = ref?.current;
    if (!element) return;

    // Set initial color
    updateThemeColor();

    // Start tracking during transitions
    element.addEventListener("transitionstart", startTransitionTracking);
    element.addEventListener("transitionend", stopTransitionTracking);
    element.addEventListener("transitioncancel", stopTransitionTracking);

    function stopTransitionTracking() {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
    }

    return () => {
      element.removeEventListener("transitionstart", startTransitionTracking);
      element.removeEventListener("transitionend", stopTransitionTracking);
      element.removeEventListener("transitioncancel", stopTransitionTracking);
      stopTransitionTracking();
    };
  }, [ref, startTransitionTracking, updateThemeColor]);
};
