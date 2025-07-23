import { ReactNode } from 'react';

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
  
  if (isPWA) {
    // Calculate the scale needed to fit within viewport while maintaining aspect ratio
    // Original size is 800x500, so we need to scale down from the desired size
    return (
      <div className="w-[100vw] h-[100vh] bg-red-500 flex items-center justify-center">
        <div 
          className="relative overflow-hidden flex items-center justify-center"
          style={{
            width: 'calc(100vw / 1.3)', // Compensate for scale to prevent overflow
            height: 'calc(100vh / 1.3)',
            transform: 'scale(1.3)',
            transformOrigin: 'center'
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