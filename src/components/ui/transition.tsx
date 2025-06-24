import clsx from "clsx";
import React, { useEffect, useState, useRef, useMemo } from "react";

type TransitionProps = {
  toggle?: boolean;
  duration?: 100 | 150 | 200 | 250 | 300 | 400 | 500 | 700 | 1000;
  durationExit?: 100 | 150 | 200 | 250 | 300 | 400 | 500 | 700 | 1000;
  type?:
    | "fade-blur"
    | "slide-up"
    | "slide-down"
    | "fade"
    | "scale"
    | "slide-panel";
  from?: string;
  to?: string;
  transitionProperties?: string;
  unmountOnExit?: boolean;
  className?: string | undefined;
  children?: React.ReactNode;
  style?: object | undefined;
};

export const Transition: React.FC<TransitionProps> = ({
  toggle: toggleProp = true,
  duration = 250,
  durationExit,
  unmountOnExit = true,
  type,
  from,
  to,
  transitionProperties = "all",
  className,
  children,
  style,
  ...rest
}) => {
  const exitDuration = durationExit ?? duration;
  const [shouldRender, setShouldRender] = useState(toggleProp);
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  const durationClass = useMemo(() => {
    const currentDuration = isVisible ? duration : exitDuration;
    if (currentDuration <= 100) return "duration-100";
    if (currentDuration <= 150) return "duration-150";
    if (currentDuration <= 200) return "duration-200";
    if (currentDuration <= 250) return "duration-[250ms]";
    if (currentDuration <= 300) return "duration-300";
    if (currentDuration <= 400) return "duration-400";
    if (currentDuration <= 500) return "duration-500";
    if (currentDuration <= 700) return "duration-700";
    return "duration-1000";
  }, [duration, exitDuration, isVisible]);

  const { transitionClass, transitionStyle } = useMemo(() => {
    let transitionClass: string;
    const transitionStyle: React.CSSProperties = {};

    if (transitionProperties === "all") {
      transitionClass = "transition-all";
    } else if (transitionProperties.startsWith("transition-")) {
      // It's a Tailwind class, use it directly
      transitionClass = transitionProperties;
    } else {
      // It's CSS properties, generate the style and use generic transition class
      transitionClass = "transition";
      transitionStyle.transitionProperty = transitionProperties;
    }

    return {
      transitionClass: `${transitionClass} ${durationClass} ease-in-out`,
      transitionStyle,
    };
  }, [transitionProperties, durationClass]);

  const finalClasses = useMemo(() => {
    // Custom from/to transitions take precedence
    if (from && to) {
      return clsx(transitionClass, isVisible ? to : from);
    }

    // Predefined type transitions with guaranteed Tailwind classes
    switch (type) {
      case "slide-up":
        return clsx(
          transitionClass,
          isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        );
      case "slide-down":
        return clsx(
          transitionClass,
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0",
        );
      case "slide-panel":
        return clsx(
          transitionClass,
          isVisible ? "translate-y-0" : "translate-y-full",
        );
      case "fade":
        return clsx(transitionClass, isVisible ? "opacity-100" : "opacity-0");
      case "scale":
        return clsx(
          transitionClass,
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0",
        );
      default:
        return transitionClass;
    }
  }, [transitionClass, isVisible, from, to, type]);

  useEffect(() => {
    if (toggleProp) {
      // Mount the component first
      setShouldRender(true);
    } else {
      // Start the exit animation
      setIsVisible(false);
      // Unmount after animation completes
      if (unmountOnExit) {
        timeoutRef.current = window.setTimeout(() => {
          setShouldRender(false);
        }, exitDuration);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [toggleProp, exitDuration, unmountOnExit]);

  // Handle the enter animation after mounting
  useEffect(() => {
    if (shouldRender && toggleProp && !isVisible) {
      // Force a reflow to ensure "from" styles are applied
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    }
  }, [shouldRender, toggleProp, isVisible]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={clsx(finalClasses, className)}
      style={{ ...transitionStyle, ...style }}
      {...rest}
    >
      {children}
    </div>
  );
};
