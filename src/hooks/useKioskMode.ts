import { useState, useEffect, useRef, useCallback } from 'react';

interface UseKioskModeOptions {
  longPressDuration?: number; // Duration in milliseconds for long press
  excludeElements?: string[]; // CSS selectors to exclude from long press detection
}

interface UseKioskModeReturn {
  isKioskMode: boolean;
  toggleKioskMode: () => void;
  setKioskMode: (enabled: boolean) => void;
}

/**
 * Custom hook for managing kiosk mode with long press gesture
 * 
 * @param options Configuration options for kiosk mode
 * @returns Object with kiosk mode state and controls
 */
export const useKioskMode = (options: UseKioskModeOptions = {}): UseKioskModeReturn => {
  const {
    longPressDuration = 3000, // 3 seconds default
    excludeElements = [
      '.settings-panel',
      '.drop-menu', 
      '.pill-button',
      'button',
      '[role="button"]'
    ]
  } = options;

  const [isKioskMode, setIsKioskModeState] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPressing = useRef(false);

  // Function to check if target element should be excluded
  const isExcludedElement = useCallback((target: EventTarget | null): boolean => {
    if (!target || !(target instanceof Element)) return false;
    
    return excludeElements.some(selector => {
      try {
        return target.closest(selector) !== null;
      } catch {
        return false;
      }
    });
  }, [excludeElements]);

  // Handle long press start
  const handleLongPressStart = useCallback((event: TouchEvent | MouseEvent) => {
    // Don't trigger on excluded elements
    if (isExcludedElement(event.target)) return;
    
    // Prevent default to avoid context menus on long press
    event.preventDefault();
    
    isLongPressing.current = true;
    
    longPressTimer.current = setTimeout(() => {
      if (isLongPressing.current) {
        setIsKioskModeState(prev => !prev);
        
        // Provide haptic feedback on supported devices
        if ('vibrate' in navigator) {
          navigator.vibrate(100);
        }
        
        console.log('Kiosk mode toggled via long press');
      }
    }, longPressDuration);
  }, [longPressDuration, isExcludedElement]);

  // Handle long press end
  const handleLongPressEnd = useCallback(() => {
    isLongPressing.current = false;
    
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  // Set up event listeners
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => handleLongPressStart(e);
    const handleTouchEnd = () => handleLongPressEnd();
    const handleTouchCancel = () => handleLongPressEnd();
    const handleMouseDown = (e: MouseEvent) => handleLongPressStart(e);
    const handleMouseUp = () => handleLongPressEnd();
    const handleMouseLeave = () => handleLongPressEnd();
    
    // Add event listeners
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('touchcancel', handleTouchCancel);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      // Clean up event listeners
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchCancel);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      
      // Clean up timer
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, [handleLongPressStart, handleLongPressEnd]);

  // Manual controls
  const toggleKioskMode = useCallback(() => {
    setIsKioskModeState(prev => !prev);
  }, []);

  const setKioskMode = useCallback((enabled: boolean) => {
    setIsKioskModeState(enabled);
  }, []);

  return {
    isKioskMode,
    toggleKioskMode,
    setKioskMode
  };
}; 