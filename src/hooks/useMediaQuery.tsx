import { useState, useEffect } from "react";

// Tailwind v4 breakpoint CSS variable names
const tailwindBreakpointVars = {
  sm: "--breakpoint-sm",
  md: "--breakpoint-md",
  lg: "--breakpoint-lg",
  xl: "--breakpoint-xl",
  "2xl": "--breakpoint-2xl",
} as const;

type TailwindBreakpoint = keyof typeof tailwindBreakpointVars;

/**
 * Get breakpoint value from Tailwind's CSS custom properties
 * Falls back to default values if CSS vars aren't available
 */
const getBreakpointValue = (breakpoint: TailwindBreakpoint): string => {
  if (typeof window === "undefined") {
    // SSR fallback values (Tailwind v4 defaults)
    const fallbacks = {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    };
    return fallbacks[breakpoint];
  }

  // Try to get the value from CSS custom properties
  const cssVarName = tailwindBreakpointVars[breakpoint];
  const computedStyle = getComputedStyle(document.documentElement);
  const cssVarValue = computedStyle.getPropertyValue(cssVarName).trim();

  if (cssVarValue) {
    return cssVarValue;
  }

  // Fallback if CSS var isn't found
  const fallbacks = {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  };

  return fallbacks[breakpoint];
};

/**
 * Custom hook for responsive design using CSS media queries
 * Supports both standard CSS media queries and Tailwind v4 breakpoint shortcuts
 *
 * @param query - CSS media query string or Tailwind breakpoint
 * @returns boolean indicating if the media query matches
 *
 * @example
 * // Standard CSS media queries
 * const isDesktop = useMediaQuery("(min-width: 768px)");
 * const isDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
 * const isPortrait = useMediaQuery("(orientation: portrait)");
 *
 * // Tailwind breakpoint shortcuts (reads from CSS custom properties)
 * const isMdUp = useMediaQuery("md"); // Uses --breakpoint-md CSS variable
 * const isLgUp = useMediaQuery("lg"); // Uses --breakpoint-lg CSS variable
 */
export function useMediaQuery(query: string | TailwindBreakpoint): boolean {
  // Convert Tailwind breakpoint to CSS media query if needed
  const getMediaQuery = (q: string | TailwindBreakpoint): string => {
    if (q in tailwindBreakpointVars) {
      const breakpointValue = getBreakpointValue(q as TailwindBreakpoint);
      return `(min-width: ${breakpointValue})`;
    }
    return q;
  };

  const mediaQuery = getMediaQuery(query);

  // Initialize state with current match status
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false; // SSR safe default
    }
    return window.matchMedia(mediaQuery).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQueryList = window.matchMedia(mediaQuery);

    // Handler for media query changes
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Set initial value
    setMatches(mediaQueryList.matches);

    // Add listener
    mediaQueryList.addEventListener("change", handleChange);

    // Cleanup
    return () => {
      mediaQueryList.removeEventListener("change", handleChange);
    };
  }, [mediaQuery]);

  return matches;
}

// Optional: Export utility functions for common breakpoint checks
export const useBreakpoint = () => {
  const isSm = useMediaQuery("sm");
  const isMd = useMediaQuery("md");
  const isLg = useMediaQuery("lg");
  const isXl = useMediaQuery("xl");
  const is2Xl = useMediaQuery("2xl");

  // Determine current breakpoint
  const getCurrentBreakpoint = (): TailwindBreakpoint | "xs" => {
    if (is2Xl) return "2xl";
    if (isXl) return "xl";
    if (isLg) return "lg";
    if (isMd) return "md";
    if (isSm) return "sm";
    return "xs";
  };

  const currentBreakpoint = getCurrentBreakpoint();

  return {
    isSm,
    isMd,
    isLg,
    isXl,
    is2Xl,
    currentBreakpoint,
    // Convenience properties
    isMobile: !isSm,
    isTablet: isSm && !isLg,
    isDesktop: isLg,
  };
};

/**
 * Utility function to get the current breakpoint values from Tailwind
 * Useful for debugging or accessing raw values
 */
export const getTailwindBreakpoints = (): Record<
  TailwindBreakpoint,
  string
> => {
  return {
    sm: getBreakpointValue("sm"),
    md: getBreakpointValue("md"),
    lg: getBreakpointValue("lg"),
    xl: getBreakpointValue("xl"),
    "2xl": getBreakpointValue("2xl"),
  };
};

// Type exports for convenience
export type { TailwindBreakpoint };
