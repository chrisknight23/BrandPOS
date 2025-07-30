import { useCallback, useRef } from 'react';

interface GestureHandlerProps {
  children: React.ReactNode;
  onDrawerOpen: () => void;
}

export const GestureHandler: React.FC<GestureHandlerProps> = ({ children, onDrawerOpen }) => {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isTracking = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    const screenWidth = window.innerWidth;
    const edgeThreshold = 30;

    // Only start tracking if touch begins near the right edge
    if (screenWidth - touch.clientX <= edgeThreshold) {
      touchStartX.current = touch.clientX;
      touchStartY.current = touch.clientY;
      isTracking.current = true;
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isTracking.current || touchStartX.current === null || touchStartY.current === null) return;

    const touch = e.touches[0];
    const deltaX = touchStartX.current - touch.clientX;
    const deltaY = Math.abs(touchStartY.current - touch.clientY);

    // If horizontal swipe is greater than vertical movement and swipe is leftward
    if (deltaX > 20 && deltaY < deltaX) {
      onDrawerOpen();
      isTracking.current = false;
      touchStartX.current = null;
      touchStartY.current = null;
      e.preventDefault(); // Prevent page scroll
    }
  }, [onDrawerOpen]);

  const handleTouchEnd = useCallback(() => {
    isTracking.current = false;
    touchStartX.current = null;
    touchStartY.current = null;
  }, []);

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="fixed inset-0 z-[10000] pointer-events-none"
    >
      <div className="pointer-events-auto">
        {children}
      </div>
    </div>
  );
};