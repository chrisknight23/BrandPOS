import { useCallback, useEffect, useState } from 'react';
import { useIsPWA } from '../../../hooks/useIsPWA';
import { DrawerContent } from './DrawerContent';
import { GestureHandler } from './GestureHandler';

export const PwaSettingsDrawer = () => {
  const isPWA = useIsPWA();
  const [isVisible, setIsVisible] = useState(false);

  const handleDrawerOpen = useCallback(() => {
    setIsVisible(true);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setIsVisible(false);
  }, []);

  // Handle escape key to close drawer
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleDrawerClose();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isVisible, handleDrawerClose]);

  if (!isPWA) return null;

  return (
    <GestureHandler onDrawerOpen={handleDrawerOpen}>
      <DrawerContent 
        isVisible={isVisible}
        onClose={handleDrawerClose}
      />
    </GestureHandler>
  );
};