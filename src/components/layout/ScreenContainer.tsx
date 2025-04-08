import { ReactNode } from 'react';

interface ScreenContainerProps {
  children: ReactNode;
}

export const ScreenContainer = ({ children }: ScreenContainerProps) => {
  return (
    <div className="w-screen h-screen bg-black overflow-hidden flex items-center justify-center">
      <div className="relative w-[800px] h-[500px] overflow-hidden rounded-2xl">
        {children}
      </div>
    </div>
  );
}; 