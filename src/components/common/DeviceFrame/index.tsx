import { ReactNode } from 'react';

interface DeviceFrameProps {
  children: ReactNode;
  className?: string;
}

export const DeviceFrame = ({ children, className = '' }: DeviceFrameProps) => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className={`w-[800px] h-[500px] bg-black relative overflow-hidden rounded-[16px] border border-[#222] flex items-center justify-center ${className}`}>
        {children}
      </div>
    </div>
  );
}; 