import { useEffect, useState } from 'react';

export const useIsPWA = () => {
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    const checkPWAMode = () => {
      const standaloneMode = window.matchMedia('(display-mode: standalone)').matches;
      const fullscreenMode = window.matchMedia('(display-mode: fullscreen)').matches;
      const navigatorStandalone = (window.navigator as any).standalone === true;
      
      return standaloneMode || fullscreenMode || navigatorStandalone;
    };

    setIsPWA(checkPWAMode());

    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = (e: MediaQueryListEvent) => setIsPWA(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isPWA;
}; 