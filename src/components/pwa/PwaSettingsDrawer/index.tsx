import { useCallback, useEffect, useState } from 'react';
import { useIsPWA } from '../../../hooks/useIsPWA';
import { DrawerContent } from './DrawerContent';
import { GestureHandler } from './GestureHandler';

interface PwaSettingsDrawerProps {
  children: React.ReactNode;
}

export const PwaSettingsDrawer: React.FC<PwaSettingsDrawerProps> = ({ children }) => {
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

  if (!isPWA) return <>{children}</>;

  return (
    <GestureHandler onDrawerOpen={handleDrawerOpen}>
      {children}
      <DrawerContent 
        isVisible={isVisible}
        onClose={handleDrawerClose}
      />
    </GestureHandler>
  );
};