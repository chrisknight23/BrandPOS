import React, { ReactNode } from 'react';

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
    <div className="h-full w-full flex items-center justify-center shadow-[0_8px_32px_0_rgba(0,0,0,0.18)]">
      {children}
    </div>
  );
}; 