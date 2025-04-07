import { ReactNode } from 'react';

interface DeviceFrameProps {
  children: ReactNode;
  className?: string;
}

export const DeviceFrame = ({ children, className = '' }: DeviceFrameProps) => {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#001707]">
      <div className={`w-[800px] h-[500px] bg-black relative overflow-hidden rounded-2xl ${className}`}>
        {children}
      </div>
    </div>
  );
}; 