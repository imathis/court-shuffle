import { useCallback, useRef } from "react";

interface TouchClickOptions {
  onAction: () => void;
  disabled?: boolean;
  preventDoubleTouch?: boolean;
  doubleTouchDelay?: number;
}

export const useTouchClick = ({
  onAction,
  disabled = false,
  preventDoubleTouch = true,
  doubleTouchDelay = 300,
}: TouchClickOptions) => {
  const lastActionRef = useRef<number>(0);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const touchHandledRef = useRef<boolean>(false);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled) return;
      const touch = e.touches[0];
      startPosRef.current = { x: touch.clientX, y: touch.clientY };
      touchHandledRef.current = true;
    },
    [disabled],
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (disabled || !startPosRef.current) return;

      const touch = e.changedTouches[0];
      const start = startPosRef.current;

      // Check for drag (movement > 10px)
      const deltaX = Math.abs(touch.clientX - start.x);
      const deltaY = Math.abs(touch.clientY - start.y);
      if (deltaX > 10 || deltaY > 10) {
        startPosRef.current = null;
        return;
      }

      // Prevent double touch
      if (preventDoubleTouch) {
        const now = Date.now();
        if (now - lastActionRef.current < doubleTouchDelay) {
          startPosRef.current = null;
          return;
        }
        lastActionRef.current = now;
      }

      e.preventDefault();
      onAction();
      startPosRef.current = null;

      // Reset flag after synthetic click delay
      setTimeout(() => {
        touchHandledRef.current = false;
      }, 100);
    },
    [disabled, onAction, preventDoubleTouch, doubleTouchDelay],
  );

  const handleClick = useCallback(
    (_e: React.MouseEvent) => {
      if (disabled) return;

      // Don't handle click if touch just occurred
      if (touchHandledRef.current) return;

      // Prevent double click
      if (preventDoubleTouch) {
        const now = Date.now();
        if (now - lastActionRef.current < doubleTouchDelay) return;
        lastActionRef.current = now;
      }

      onAction();
    },
    [disabled, onAction, preventDoubleTouch, doubleTouchDelay],
  );

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onClick: handleClick,
  };
};
