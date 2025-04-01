import { ReactNode } from 'react';

interface ScreenContainerProps {
  children: ReactNode;
  className?: string;
}

export const ScreenContainer = ({ children, className = '' }: ScreenContainerProps) => {
  return (
    <div className={`relative w-full h-screen overflow-hidden bg-white ${className}`}>
      {children}
    </div>
  );
}; 