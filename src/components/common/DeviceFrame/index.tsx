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
  
  return (
    <div className="w-screen h-screen flex items-center justify-center p-4">
      <div className={`
        ${isPWA 
          ? 'w-full max-w-[800px] aspect-[8/5] max-h-[calc(100vh-2rem)]' 
          : 'w-[800px] h-[500px]'
        } 
        bg-black relative overflow-hidden rounded-[16px] border border-[#222] flex items-center justify-center ${className}
      `}>
        {children}
      </div>
    </div>
  );
}; 