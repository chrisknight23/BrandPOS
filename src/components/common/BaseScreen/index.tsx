import React, { ReactNode } from 'react';
import { DeviceFrame } from '../DeviceFrame';

interface BaseScreenProps {
  children: ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  title?: string;
  hideBackButton?: boolean;
  hideNextButton?: boolean;
}

export const BaseScreen: React.FC<BaseScreenProps> = ({
  children,
  onBack,
  onNext,
  title,
  hideBackButton = false,
  hideNextButton = false,
}) => {
  return (
    <div className="min-h-screen min-w-full flex items-center justify-center">
      <DeviceFrame>
        {children}
      </DeviceFrame>
    </div>
  );
}; 