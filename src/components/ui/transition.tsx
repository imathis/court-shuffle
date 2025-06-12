import clsx from "clsx";
import React, { useEffect, useState } from "react";

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
  className,
  children,
  ...rest
}) => {
  const exitDuration = durationExit ?? duration;
  const [shouldRender, setShouldRender] = useState(toggleProp);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (toggleProp) {
      // Mount the component first
      setShouldRender(true);
    } else {
      // Start the exit animation
      setIsVisible(false);
      // Unmount after animation completes
      if (unmountOnExit) {
        const timer = setTimeout(() => {
          setShouldRender(false);
        }, exitDuration);
        return () => clearTimeout(timer);
      }
    }
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

  const getTransitionClasses = () => {
    // Map duration to standard Tailwind classes
    const getDurationClass = (ms: number) => {
      if (ms <= 100) return "duration-100";
      if (ms <= 150) return "duration-150";
      if (ms <= 200) return "duration-200";
      if (ms <= 250) return "duration-[250ms]";
      if (ms <= 300) return "duration-300";
      if (ms <= 400) return "duration-400";
      if (ms <= 500) return "duration-500";
      if (ms <= 700) return "duration-700";
      return "duration-1000"; // fallback for very long durations
    };

    const currentDuration = isVisible ? duration : exitDuration;
    const durationClass = getDurationClass(currentDuration);
    const baseClasses = `transition-all ${durationClass} ease-in-out`;

    // Custom from/to transitions take precedence
    if (from && to) {
      return clsx(baseClasses, isVisible ? to : from);
    }

    // Predefined type transitions with guaranteed Tailwind classes
    switch (type) {
      case "slide-up":
        return clsx(
          baseClasses,
          isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        );
      case "slide-down":
        return clsx(
          baseClasses,
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0",
        );
      case "slide-panel":
        return clsx(
          baseClasses,
          isVisible ? "translate-y-0" : "translate-y-full",
        );
      case "fade":
        return clsx(baseClasses, isVisible ? "opacity-100" : "opacity-0");
      case "scale":
        return clsx(
          baseClasses,
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0",
        );
      default:
        return baseClasses;
    }
  };

  return (
    <div className={clsx(getTransitionClasses(), className)} {...rest}>
      {children}
    </div>
  );
};
