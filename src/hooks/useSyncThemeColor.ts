import React, { useEffect, useRef } from "react";

// Custom hook to sync the PWA theme color with an element's background color
export const useSyncThemeColorToBackground = (
  ref: React.RefObject<HTMLElement | null>,
) => {
  const animationFrameRef = useRef<number>(undefined);
  const metaTagRef = useRef<HTMLMetaElement | null>(null);
  const lastColorRef = useRef<string>("");
  const frameCountRef = useRef<number>(0);

  // Update the PWA theme color meta tag immediately
  const updateThemeColor = React.useCallback(() => {
    if (!ref?.current) return;
    
    const color = window.getComputedStyle(ref.current).backgroundColor;
    if (!color || color === lastColorRef.current) return;
    
    // Cache meta tag reference to avoid repeated DOM queries
    if (!metaTagRef.current) {
      metaTagRef.current = document.querySelector('meta[name="theme-color"]');
      if (!metaTagRef.current) {
        metaTagRef.current = document.createElement("meta");
        metaTagRef.current.setAttribute("name", "theme-color");
        document.head.appendChild(metaTagRef.current);
      }
    }
    
    metaTagRef.current.setAttribute("content", color);
    lastColorRef.current = color;
  }, [ref]);

  // Stop transition tracking - memoized to avoid recreating
  const stopTransitionTracking = React.useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }
  }, []);

  // Transition event handlers that only respond to events on the target element
  const handleTransitionStart = React.useCallback((event: TransitionEvent) => {
    // Only respond to transitions on the target element, not bubbled events
    if (event.target !== ref.current) return;
    
    // Prevent multiple RAF loops if already tracking
    if (animationFrameRef.current) return;
    
    frameCountRef.current = 0;
    const trackTransition = () => {
      // Throttle updates - only check every 2-3 frames for better performance
      frameCountRef.current++;
      if (frameCountRef.current % 2 === 0) {
        updateThemeColor();
      }
      animationFrameRef.current = requestAnimationFrame(trackTransition);
    };
    trackTransition();
  }, [updateThemeColor, ref]);

  const handleTransitionEnd = React.useCallback((event: TransitionEvent) => {
    // Only respond to transitions on the target element, not bubbled events
    if (event.target !== ref.current) return;
    stopTransitionTracking();
  }, [ref, stopTransitionTracking]);

  useEffect(() => {
    // Skip in non-browser environments
    if (typeof window === "undefined") return;

    const element = ref?.current;
    if (!element) return;

    // Set initial color
    updateThemeColor();

    // Use passive listeners for better performance
    const options = { passive: true };

    // Start tracking during transitions (with bubbling event prevention)
    element.addEventListener("transitionstart", handleTransitionStart, options);
    element.addEventListener("transitionend", handleTransitionEnd, options);
    element.addEventListener("transitioncancel", handleTransitionEnd, options);

    return () => {
      element.removeEventListener("transitionstart", handleTransitionStart);
      element.removeEventListener("transitionend", handleTransitionEnd);
      element.removeEventListener("transitioncancel", handleTransitionEnd);
      stopTransitionTracking();
    };
  }, [ref, handleTransitionStart, handleTransitionEnd, stopTransitionTracking, updateThemeColor]);
};
