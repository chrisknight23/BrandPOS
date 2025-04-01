import { ReactNode } from 'react';
import { ScreenProps } from '../../types/screen';

interface BaseScreenProps extends ScreenProps {
  children: ReactNode;
  className?: string;
}

export const BaseScreen = ({ children, className = '', onNext }: BaseScreenProps) => {
  return (
    <div className={`flex items-center justify-center w-full h-full ${className}`}>
      {children}
    </div>
  );
}; 