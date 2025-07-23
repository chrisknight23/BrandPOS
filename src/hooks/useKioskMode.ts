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

// Device detection utilities
const isIpad = () => {
  // Modern iPadOS detection - check for multiple indicators
  const userAgent = navigator.userAgent;
  
  // Traditional iPad detection
  if (/iPad/.test(userAgent)) return true;
  
  // Modern iPadOS reports as Mac, so check for Mac + touch + specific characteristics
  if (/Macintosh/.test(userAgent) && 'ontouchend' in document) {
    // Additional checks for iPad masquerading as Mac
    return navigator.maxTouchPoints > 1 || screen.height > screen.width;
  }
  
  // Check for mobile Safari characteristics on larger screens
  if (/Safari/.test(userAgent) && !/Chrome/.test(userAgent)) {
    return navigator.maxTouchPoints > 1 && (screen.width >= 768 || screen.height >= 768);
  }
  
  return false;
};

const isPWAMode = () => {
  // Check multiple ways to detect PWA mode
  const standaloneMode = window.matchMedia('(display-mode: standalone)').matches;
  const fullscreenMode = window.matchMedia('(display-mode: fullscreen)').matches;
  const navigatorStandalone = (window.navigator as any).standalone === true;
  
  return standaloneMode || fullscreenMode || navigatorStandalone;
};

const isIpadPWA = () => {
  return isIpad() && isPWAMode();
};

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

  const [isKioskMode, setIsKioskModeState] = useState(() => {
    // Automatically enable kiosk mode for iPad PWA only
    return isIpadPWA();
  });
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

  // Set up event listeners only if NOT on iPad PWA
  useEffect(() => {
    // Skip long press setup for iPad PWA - they get automatic kiosk mode
    if (isIpadPWA()) {
      return;
    }

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