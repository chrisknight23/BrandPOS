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
    // PWA: Full viewport with content scaling
    return (
      <div className="w-screen h-screen bg-black relative overflow-hidden">
        <div 
          style={{
            fontSize: '1.3em',
            transform: 'scale(1.1)',
            transformOrigin: 'center',
            width: '100%',
            height: '100%'
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