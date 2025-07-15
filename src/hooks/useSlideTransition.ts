import { useState, useCallback, useRef, useEffect } from 'react';

export interface SlideTransitionConfig {
  /** Delay before navigation (ms) - allows button press animation to be visible */
  navigationDelay?: number;
  /** Animation spring configuration */
  springConfig?: {
    stiffness: number;
    damping: number;
    duration: number;
  };
  /** Slide distance (px) */
  slideDistance?: number;
  /** Opacity during transition */
  transitionOpacity?: number;
}

const DEFAULT_CONFIG: Required<SlideTransitionConfig> = {
  navigationDelay: 150,
  springConfig: {
    stiffness: 300,
    damping: 30,
    duration: 0.4
  },
  slideDistance: 800,
  transitionOpacity: 0.8
};

export const useSlideTransition = (
  onNavigate: () => void,
  config: SlideTransitionConfig = {}
) => {
  const [isExiting, setIsExiting] = useState(false);
  const navigationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (navigationTimer.current) {
        clearTimeout(navigationTimer.current);
        navigationTimer.current = null;
      }
    };
  }, []);

  const triggerTransition = useCallback(() => {
    setIsExiting(true);
    
    navigationTimer.current = setTimeout(() => {
      onNavigate();
    }, finalConfig.navigationDelay);
  }, [onNavigate, finalConfig.navigationDelay]);

  const resetTransition = useCallback(() => {
    setIsExiting(false);
    if (navigationTimer.current) {
      clearTimeout(navigationTimer.current);
      navigationTimer.current = null;
    }
  }, []);

  // Animation properties for exit transition
  const exitAnimation = {
    x: isExiting ? -finalConfig.slideDistance : 0,
    opacity: isExiting ? finalConfig.transitionOpacity : 1
  };

  // Animation properties for enter transition
  const enterAnimation = {
    initial: { x: finalConfig.slideDistance, opacity: finalConfig.transitionOpacity },
    animate: { x: 0, opacity: 1 },
    exit: { x: -finalConfig.slideDistance, opacity: finalConfig.transitionOpacity }
  };

  return {
    isExiting,
    triggerTransition,
    resetTransition,
    exitAnimation,
    enterAnimation,
    springConfig: finalConfig.springConfig
  };
}; 