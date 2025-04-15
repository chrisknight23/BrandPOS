import React, { useState, useEffect } from 'react';
import { AnimatedQRCode } from './index';

// Redefine the props to match exactly what's in AnimatedQRCode
interface AnimatedQRCodeProps {
  value: string;
  size?: number;
  autoAnimate?: boolean;
  pattern?: 'random' | 'inside-out' | 'outside-in' | 'wave' | 'sequential';
  speed?: number;
  darkColor?: string;
  lightColor?: string;
  placeholderOpacity?: number;
  onAnimationComplete?: () => void;
  logo?: string | React.ReactNode;
  errorCorrection?: 'L' | 'M' | 'Q' | 'H';
  className?: string;
}

interface DelayedQRCodeProps extends AnimatedQRCodeProps {
  isFlipped: boolean;
  flipDelay?: number;
}

/**
 * QR Code that delays animation until after card flip is complete
 */
export const DelayedQRCode: React.FC<DelayedQRCodeProps> = ({
  isFlipped,
  flipDelay = 600,
  value,
  size = 260,
  pattern = 'outside-in',
  speed = 1,
  darkColor = '#FFFFFF',
  lightColor = 'transparent',
  placeholderOpacity = 0.5,
  onAnimationComplete,
  logo,
  errorCorrection = 'M',
  className = ''
}) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  
  // Reset animation when flipped state changes
  useEffect(() => {
    // When flipped to back, wait for animation to complete before starting QR animation
    if (isFlipped) {
      setShouldAnimate(false);
      const timer = setTimeout(() => {
        console.log('DelayedQRCode: Starting QR animation after flip delay');
        setShouldAnimate(true);
      }, flipDelay);
      
      return () => {
        clearTimeout(timer);
      };
    } else {
      // When flipped to front, reset animation state
      setShouldAnimate(false);
    }
  }, [isFlipped, flipDelay]);
  
  // Create a unique key based on flip state to force re-mounting the component
  const animationKey = `qr-code-${isFlipped ? 'flipped' : 'front'}-${shouldAnimate ? 'animate' : 'wait'}`;
  
  return (
    <AnimatedQRCode
      key={animationKey}
      value={value}
      size={size}
      autoAnimate={shouldAnimate}
      pattern={pattern}
      speed={speed}
      darkColor={darkColor}
      lightColor={lightColor}
      placeholderOpacity={placeholderOpacity}
      onAnimationComplete={onAnimationComplete}
      logo={logo}
      errorCorrection={errorCorrection}
      className={className}
    />
  );
};

export default DelayedQRCode; 