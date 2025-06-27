import { useCallback, useRef } from "react";

interface TouchOptimizedOptions {
  onAction: () => void;
  disabled?: boolean;
  preventDoubleTouch?: boolean;
  doubleTouchDelay?: number;
}

export const useTouchOptimized = ({
  onAction,
  disabled = false,
  preventDoubleTouch = true,
  doubleTouchDelay = 300,
}: TouchOptimizedOptions) => {
  const lastTouchRef = useRef<number>(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled) return;

      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    },
    [disabled],
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (disabled || !touchStartRef.current) return;

      const touch = e.changedTouches[0];
      const startPos = touchStartRef.current;

      // Check if touch moved too much (drag vs tap)
      const deltaX = Math.abs(touch.clientX - startPos.x);
      const deltaY = Math.abs(touch.clientY - startPos.y);
      const maxDelta = 10; // pixels

      if (deltaX > maxDelta || deltaY > maxDelta) {
        touchStartRef.current = null;
        return;
      }

      // Prevent double touch if enabled
      if (preventDoubleTouch) {
        const now = Date.now();
        if (now - lastTouchRef.current < doubleTouchDelay) {
          touchStartRef.current = null;
          return;
        }
        lastTouchRef.current = now;
      }

      // Prevent default click event
      e.preventDefault();
      e.stopPropagation();

      onAction();
      touchStartRef.current = null;
    },
    [disabled, onAction, preventDoubleTouch, doubleTouchDelay],
  );

  // Fallback click handler for non-touch devices
  const handleClick = useCallback(
    (_e: React.MouseEvent) => {
      if (disabled) return;

      // Only handle click if no touch events occurred
      if (touchStartRef.current === null) {
        onAction();
      }
    },
    [disabled, onAction],
  );

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onClick: handleClick,
    style: { touchAction: "manipulation" } as React.CSSProperties,
  };
};
