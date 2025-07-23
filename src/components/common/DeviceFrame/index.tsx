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
    // Calculate the scale needed to fit within viewport while maintaining aspect ratio
    // Original size is 800x500, so we need to scale down from the desired size
    return (
      <div className="w-[100vw] h-[100vh] bg-black overflow-hidden flex items-center justify-center">
        <div 
          className="relative overflow-hidden flex items-center justify-center"
          style={{
            width: 'calc(100vw / 1.3)', // Compensate for scale to prevent overflow
            height: 'calc((100vh - env(safe-area-inset-top)) / 1.3)', // Account for status bar
            transform: 'scale(1.3)',
            transformOrigin: 'center',
            marginTop: 'env(safe-area-inset-top)' // Add top margin for status bar
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