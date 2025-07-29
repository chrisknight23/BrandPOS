import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateQRData } from './generateQRData';
import { QRDot } from './types';
import QRLogo from '../../../assets/images/QRLogo.svg';

interface AnimatedQRCodeProps {
  // The value to encode in the QR code (URL, text, etc.)
  value: string;
  
  // Size of the QR code container (defaults to square)
  size?: number;
  
  // Animation pattern - could be 'random', 'inside-out', 'wave', etc.
  animateIn?: 'random' | 'inside-out' | 'outside-in' | 'wave' | 'sequential' | false;
  
  // Animation pattern - could be 'random', 'inside-out', 'wave', etc.
  animateOut?: 'fade' | 'random' | 'inside-out' | 'outside-in' | 'wave' | 'sequential' | false;
  
  // Animation speed (1 is default, 2 is twice as fast, 0.5 is half speed)
  speed?: number;
  
  // Colors
  darkColor?: string;
  lightColor?: string;
  placeholderOpacity?: number;
  
  // Callback when animation completes
  onAnimationComplete?: () => void;
  
  // Optional logo to display in center
  logo?: string | React.ReactNode;
  
  // QR code correction level (affects how much data can be damaged)
  errorCorrection?: 'L' | 'M' | 'Q' | 'H';
  
  // Optional className for container
  className?: string;
  
  // Disable animation
  disableAnimation?: boolean;
  
  // Add a new prop to control visibility
  visible?: boolean;
}

export const AnimatedQRCode: React.FC<AnimatedQRCodeProps & { visible?: boolean }> = ({
  value,
  size = 300,
  animateIn = 'outside-in',
  animateOut = false,
  disableAnimation = false,
  speed = 1,
  darkColor = '#00B843',
  lightColor = 'transparent',
  placeholderOpacity = 0.3,
  onAnimationComplete,
  logo,
  errorCorrection = 'M',
  className = '',
  visible = true
}) => {
  const [dots, setDots] = useState<QRDot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Generate QR data when component mounts or value changes
  useEffect(() => {
    console.log('AnimatedQRCode: Loading QR data, disableAnimation:', disableAnimation);
    setIsLoading(true);
    
    const loadQRData = async () => {
      try {
        console.log('AnimatedQRCode: Fetching QR data for value:', value);
        const qrData = await generateQRData({
          value, 
          size,
          errorCorrection
        });
        
        console.log('AnimatedQRCode: QR data loaded, dots:', qrData.length);
        setDots(qrData);
        setIsLoading(false);
        
        // Start animation if disableAnimation is false and animateIn is provided
        if (!disableAnimation && animateIn) {
          console.log('AnimatedQRCode: Will start animation after delay');
          setTimeout(() => {
            console.log('AnimatedQRCode: Starting animation now');
            setIsAnimating(true);
          }, 300);
        } else {
          console.log('AnimatedQRCode: Auto-animation disabled');
          setIsAnimating(false);
        }
      } catch (error) {
        console.error('Error loading QR data:', error);
        setIsLoading(false);
      }
    };
    
    loadQRData();
  }, [value, size, errorCorrection, disableAnimation, animateIn]);
  
  // Function to manually trigger animation
  const startAnimation = () => {
    setIsAnimating(true);
  };
  
  // Separate position markers from regular dots
  const positionMarkers = dots.filter(dot => dot.isPositionMarker);
  const regularDots = dots.filter(dot => !dot.isPositionMarker);
  
  // Animation order logic
  const getAnimationOrder = () => {
    if (!animateIn || disableAnimation) return regularDots;
    switch(animateIn) {
      case 'inside-out':
        return [...regularDots].sort((a, b) => a.distanceFromCenter - b.distanceFromCenter);
      case 'outside-in':
        return [...regularDots].sort((a, b) => b.distanceFromCenter - a.distanceFromCenter);
      case 'wave':
        return [...regularDots].sort((a, b) => a.y - b.y);
      case 'sequential':
        return [...regularDots].sort((a, b) => a.row === b.row ? a.col - b.col : a.row - b.row);
      case 'random':
      default:
        return [...regularDots].sort(() => Math.random() - 0.5);
    }
  };
  
  // Get animation sequence based on pattern
  const animationOrder = getAnimationOrder();
  
  // Styling for QR dots based on whether they are position markers
  const getDotStyle = (dot: QRDot, isAnimating: boolean, color: string, placeholderOpacity: number) => {
    if (dot.isHollow) {
      // For hollow squares (position markers outer square)
      return {
        position: 'absolute' as const,
        left: dot.x,
        top: dot.y,
        width: dot.size,
        height: dot.size,
        backgroundColor: 'transparent',
        border: `${Math.max(dot.size * 0.12, 2)}px solid ${color}`,
        borderRadius: dot.cornerRadius ? `${dot.cornerRadius}px` : (dot.isRound ? '50%' : '15%'),
        opacity: isAnimating ? 1 : placeholderOpacity,
        boxSizing: 'border-box' as const
      };
    }
    
    // Regular dots or solid squares
    return {
      position: 'absolute' as const,
      left: dot.x,
      top: dot.y,
      width: dot.size,
      height: dot.size,
      backgroundColor: color,
      borderRadius: dot.cornerRadius ? `${dot.cornerRadius}px` : (dot.isRound ? '50%' : '15%'),
      opacity: isAnimating ? 1 : placeholderOpacity
    };
  };
  
  // If disableAnimation, show QR code instantly
  if (disableAnimation && !isLoading) {
    if (dots.length === 0) {
      // Show loading spinner or fallback if dots are not ready
      return (
        <div
          className={`animated-qr-code ${className}`}
          style={{
            position: 'relative',
            width: size,
            height: size,
            backgroundColor: lightColor,
            overflow: 'hidden'
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: darkColor
          }}>
            <span>Loading...</span>
          </div>
        </div>
      );
    }
    return (
      <div 
        className={`animated-qr-code ${className}`}
        style={{
          position: 'relative',
          width: size,
          height: size,
          backgroundColor: lightColor,
          overflow: 'hidden' // Prevent any content from spilling outside
        }}
      >
        {/* Position markers */}
        <div className="qr-position-markers" style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          zIndex: 2  // Ensure markers are above placeholder dots
        }}>
          {positionMarkers.map((dot, idx) => (
            <div
              key={`marker-${idx}`}
              style={{
                ...getDotStyle(dot, true, darkColor, 1),
                opacity: 1
              }}
            />
          ))}
        </div>
        
        {/* All dots visible instantly */}
        <div className="qr-dots" style={{
          position: 'relative',
          width: '100%',
          height: '100%'
        }}>
          {regularDots.map((dot, idx) => (
            <div
              key={`dot-${idx}`}
              style={{
                ...getDotStyle(dot, true, darkColor, 1),
                opacity: 1
              }}
            />
          ))}
        </div>
        
        {/* Logo overlay if provided */}
        {logo && (
          <div
            className="qr-logo"
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '62px',
              height: '62px',
              zIndex: 10
            }}
          >
            {typeof logo === 'string' ? (
              logo === 'cash-icon' ? (
                <img
                  src={QRLogo}
                  alt="Cash App Logo"
                  width={62}
                  height={62}
                />
              ) : (
                <img
                  src={logo}
                  alt="QR Logo"
                  width={62}
                  height={62}
                />
              )
            ) : (
              logo
            )}
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div 
      className={`animated-qr-code ${className}`}
      style={{
        position: 'relative',
        width: size,
        height: size,
        backgroundColor: 'transparent',
        overflow: 'hidden' // Prevent any content from spilling outside
      }}
    >

      
      {/* AnimatePresence for animate out */}
      <AnimatePresence>
        {!isLoading && visible && (
          <React.Fragment key="qr-anim-in">
            {/* Position markers - fade in with animation */}
            <div className="qr-position-markers" style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              zIndex: 2  // Ensure markers are above placeholder dots
            }}>
              {positionMarkers.map((dot, idx) => (
                <motion.div
                  key={`marker-${idx}`}
                  style={getDotStyle(dot, true, darkColor, 1)}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={isAnimating ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                  transition={{
                    delay: 0, // Start immediately with animation
                    duration: 0.3,
                    ease: 'easeOut'
                  }}
                />
              ))}
            </div>
            
            {/* Base layer - placeholder QR (darker version) */}
            <div className="qr-placeholder" style={{
              position: 'relative',
              width: '100%',
              height: '100%'
            }}>
              {regularDots.map((dot, idx) => (
                <div
                  key={`base-${idx}`}
                  style={getDotStyle(dot, false, darkColor, placeholderOpacity)}
                />
              ))}
            </div>
            
            {/* Animation layer - only for regular dots, not position markers */}
            {isAnimating && (
              <>
                {animationOrder.map((dot, idx) => (
                  <motion.div
                    key={`anim-${idx}`}
                    style={getDotStyle(dot, true, darkColor, 1)}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={
                      animateOut
                        ? (animateOut === 'fade'
                            ? { opacity: 0, scale: 0.5 }
                            : { opacity: 0 })
                        : { opacity: 0 }
                    }
                    transition={{
                      delay: idx * (0.0015 / speed),
                      duration: 0.3,
                      ease: 'easeOut'
                    }}
                    onAnimationComplete={() => {
                      if (idx === animationOrder.length - 1 && onAnimationComplete) {
                        onAnimationComplete();
                      }
                    }}
                  />
                ))}
              </>
            )}
            
            {/* Center logo - fade in with animation */}
            {logo && (
              <motion.div
                style={{
                  position: 'absolute',
                  top: '38%',
                  left: '38%',
                  transform: 'translate(-50%, -50%)',
                  width: '62px',
                  height: '62px',
                  zIndex: 3  // Ensure logo is on top
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isAnimating ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1 }}
                transition={{
                  delay: 0, // Same timing as position markers
                  duration: 0.3,
                  ease: 'easeOut'
                }}
              >
                {typeof logo === 'string' ? (
                  logo === 'cash-icon' ? (
                    <img
                      src={QRLogo}
                      alt="Cash App Logo"
                      width={62}
                      height={62}
                    />
                  ) : (
                    <img
                      src={logo}
                      alt="QR Logo"
                      width={62}
                      height={62}
                    />
                  )
                ) : (
                  logo
                )}
              </motion.div>
            )}
          </React.Fragment>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedQRCode; 