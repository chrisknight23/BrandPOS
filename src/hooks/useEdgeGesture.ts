import { useState, useEffect, useCallback, useRef } from 'react';
import { useIsPWA } from './useIsPWA';

interface UseEdgeGestureOptions {
  onGestureComplete?: () => void;
  threshold?: number;
}

interface UseEdgeGestureReturn {
  isGestureActive: boolean;
}

/**
 * Hook for detecting edge swipe gestures in PWA mode
 * Only activates in PWA mode, no-op in browser
 */
export const useEdgeGesture = (options: UseEdgeGestureOptions = {}): UseEdgeGestureReturn => {
  const {
    onGestureComplete,
    threshold = 100 // pixels from edge to trigger
  } = options;

  const isPWA = useIsPWA();
  const [isGestureActive, setIsGestureActive] = useState(false);
  const touchStartXRef = useRef<number | null>(null);
  
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!isPWA) return;
    
    const touch = e.touches[0];
    const startX = touch.clientX;
    const windowWidth = window.innerWidth;
    
    // Only activate if touch starts from right edge
    if (startX >= windowWidth - 20) {
      e.preventDefault(); // Prevent default to ensure we can handle the gesture
      touchStartXRef.current = startX;
      setIsGestureActive(true);
      console.log('Edge gesture started:', { startX, windowWidth });
    }
  }, [isPWA]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isPWA || !isGestureActive || touchStartXRef.current === null) return;
    
    const touch = e.touches[0];
    const currentX = touch.clientX;
    const startX = touchStartXRef.current;
    const swipeDistance = startX - currentX; // Distance swiped left from start point
    
    console.log('Edge gesture move:', { currentX, startX, swipeDistance, threshold });
    
    // If swiped far enough left, trigger the gesture
    if (swipeDistance > threshold) {
      e.preventDefault(); // Prevent default when triggering
      setIsGestureActive(false);
      touchStartXRef.current = null;
      if (onGestureComplete) {
        console.log('Edge gesture complete');
        onGestureComplete();
        // Provide haptic feedback
        if ('vibrate' in navigator) {
          navigator.vibrate(100);
        }
      }
    }
  }, [isPWA, isGestureActive, threshold, onGestureComplete]);

  const handleTouchEnd = useCallback(() => {
    if (!isPWA) return;
    setIsGestureActive(false);
    touchStartXRef.current = null;
    console.log('Edge gesture ended');
  }, [isPWA]);

  useEffect(() => {
    // Only set up listeners in PWA mode
    if (!isPWA) return;

    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [isPWA, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return { isGestureActive };
}; 