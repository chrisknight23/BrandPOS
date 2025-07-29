import { useState, useEffect, useCallback } from 'react';
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
  
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!isPWA) return;
    
    const touch = e.touches[0];
    const startX = touch.clientX;
    const windowWidth = window.innerWidth;
    
    // Only activate if touch starts from right edge
    if (startX >= windowWidth - 20) {
      setIsGestureActive(true);
    }
  }, [isPWA]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isPWA || !isGestureActive) return;
    
    const touch = e.touches[0];
    const currentX = touch.clientX;
    const windowWidth = window.innerWidth;
    const swipeDistance = windowWidth - currentX;
    
    // If swiped far enough, trigger the gesture
    if (swipeDistance > threshold) {
      setIsGestureActive(false);
      if (onGestureComplete) {
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
  }, [isPWA]);

  useEffect(() => {
    // Only set up listeners in PWA mode
    if (!isPWA) return;

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
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