import { ReactNode, useEffect } from 'react';

interface DeviceFrameProps {
  children: ReactNode;
  className?: string;
}

// PWA detection utility (same as in useKioskMode)
const isPWAMode = () => {
  const standaloneMode = window.matchMedia('(display-mode: standalone)').matches;
  const fullscreenMode = window.matchMedia('(display-mode: fullscreen)').matches;
  const navigatorStandalone = (window.navigator as any).standalone === true;
  
  return standaloneMode || fullscreenMode || navigatorStandalone;
};

export const DeviceFrame = ({ children, className = '' }: DeviceFrameProps) => {
  const isPWA = isPWAMode();

  // Prevent scroll only in PWA mode
  useEffect(() => {
    if (isPWA) {
      const preventDefault = (e: TouchEvent) => {
        e.preventDefault();
      };
      document.addEventListener('touchmove', preventDefault, { passive: false });
      return () => {
        document.removeEventListener('touchmove', preventDefault);
      };
    }
  }, [isPWA]);
  
  if (isPWA) {
    return (
      <div className="w-[100vw] h-[100vh] bg-black overflow-hidden flex items-center justify-center">
        <div 
          className="relative overflow-hidden flex items-center justify-center"
          style={{
            width: 'calc(100vw / 1.3)',
            height: 'calc(100vh / 1.3)',
            transform: 'scale(1.3)',
            transformOrigin: 'center',
            paddingTop: 'env(safe-area-inset-top)',
            paddingBottom: 'env(safe-area-inset-bottom)',
            paddingLeft: 'env(safe-area-inset-left)',
            paddingRight: 'env(safe-area-inset-right)'
          }}
        >
          {children}
        </div>
      </div>
    );
  }
  
  // Safari: Original framed experience
  return (
    <div className="w-screen h-screen flex items-center justify-center p-4">
      <div className={`w-[800px] h-[500px] bg-black relative overflow-hidden rounded-[16px] border border-[#222] flex items-center justify-center ${className}`}>
        {children}
      </div>
    </div>
  );
}; 