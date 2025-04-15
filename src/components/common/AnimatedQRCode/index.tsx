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
  
  // Whether to play the animation automatically
  autoAnimate?: boolean;
  
  // Animation pattern - could be 'random', 'inside-out', 'wave', etc.
  pattern?: 'random' | 'inside-out' | 'outside-in' | 'wave' | 'sequential';
  
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
}

export const AnimatedQRCode: React.FC<AnimatedQRCodeProps> = ({
  value,
  size = 300,
  autoAnimate = true,
  pattern = 'outside-in',
  speed = 1,
  darkColor = '#00B843',
  lightColor = 'transparent',
  placeholderOpacity = 0.3,
  onAnimationComplete,
  logo,
  errorCorrection = 'M',
  className = ''
}) => {
  const [dots, setDots] = useState<QRDot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Generate QR data when component mounts or value changes
  useEffect(() => {
    console.log('AnimatedQRCode: Loading QR data, autoAnimate:', autoAnimate);
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
        
        // Start animation if autoAnimate is true
        if (autoAnimate) {
          // Short delay before starting animation
          console.log('AnimatedQRCode: Will start animation after delay');
          setTimeout(() => {
            console.log('AnimatedQRCode: Starting animation now');
            setIsAnimating(true);
          }, 300);
        } else {
          console.log('AnimatedQRCode: Auto-animation disabled');
        }
      } catch (error) {
        console.error('Error loading QR data:', error);
        setIsLoading(false);
      }
    };
    
    loadQRData();
  }, [value, size, errorCorrection, autoAnimate]);
  
  // Add explicit handling for autoAnimate changes
  useEffect(() => {
    console.log('AnimatedQRCode: autoAnimate changed to:', autoAnimate);
    
    // When autoAnimate becomes true, ensure animation starts
    if (autoAnimate && !isAnimating && !isLoading && dots.length > 0) {
      console.log('AnimatedQRCode: Starting animation due to autoAnimate change');
      // Small delay to ensure everything is ready
      setTimeout(() => {
        setIsAnimating(true);
      }, 300);
    }
  }, [autoAnimate, isAnimating, isLoading, dots.length]);
  
  // Function to manually trigger animation
  const startAnimation = () => {
    setIsAnimating(true);
  };
  
  // Separate position markers from regular dots
  const positionMarkers = dots.filter(dot => dot.isPositionMarker);
  const regularDots = dots.filter(dot => !dot.isPositionMarker);
  
  // Different animation patterns
  const getAnimationOrder = () => {
    // Only apply patterns to regular dots, not position markers
    switch(pattern) {
      case 'inside-out':
        // Sort dots by distance from center
        return [...regularDots].sort((a, b) => a.distanceFromCenter - b.distanceFromCenter);
      case 'outside-in':
        // Reverse of inside-out
        return [...regularDots].sort((a, b) => b.distanceFromCenter - a.distanceFromCenter);
      case 'wave':
        // Sort by y position to create wave effect
        return [...regularDots].sort((a, b) => a.y - b.y);
      case 'sequential':
        // Sort by row and column for sequential animation
        return [...regularDots].sort((a, b) => {
          if (a.row === b.row) return a.col - b.col;
          return a.row - b.row;
        });
      case 'random':
      default:
        // Randomize order
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
  
  // Use this if you want to let user manually start the animation
  if (!autoAnimate && !isAnimating && !isLoading) {
    return (
      <div 
        className={`animated-qr-code ${className}`}
        style={{
          position: 'relative',
          width: size,
          height: size,
          backgroundColor: lightColor,
          cursor: 'pointer'
        }}
        onClick={startAnimation}
      >
        <div className="text-center">Click to reveal QR code</div>
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
      {/* Debug button for development */}
      {!isAnimating && process.env.NODE_ENV !== 'production' && (
        <button 
          onClick={startAnimation}
          style={{
            position: 'absolute',
            top: 5,
            right: 5,
            zIndex: 100,
            backgroundColor: 'rgba(0,0,0,0.3)',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            padding: '4px 8px',
            fontSize: '10px'
          }}
        >
          Start Animation
        </button>
      )}
      
      {/* Loading state */}
      {isLoading && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: darkColor
          }}
        >
          <span>Loading...</span>
        </div>
      )}
      
      {!isLoading && (
        <>
          {/* Position markers - always visible at full opacity */}
          <div className="qr-position-markers" style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            zIndex: 2  // Ensure markers are above placeholder dots
          }}>
            {positionMarkers.map((dot, idx) => (
              <div
                key={`marker-${idx}`}
                style={getDotStyle(dot, true, darkColor, 1)}
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
          <AnimatePresence>
            {isAnimating && (
              <>
                {animationOrder.map((dot, idx) => (
                  <motion.div
                    key={`anim-${idx}`}
                    style={getDotStyle(dot, true, darkColor, 1)}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: idx * (0.0015 / speed), // Adjust timing for better animation flow
                      duration: 0.3,
                      ease: "easeOut"
                    }}
                    onAnimationComplete={() => {
                      // Call the completion callback when the last dot animates
                      if (idx === animationOrder.length - 1 && onAnimationComplete) {
                        onAnimationComplete();
                      }
                    }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>
          
          {/* Center logo */}
          {logo && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '62px',
                height: '62px',
                zIndex: 3  // Ensure logo is on top
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
        </>
      )}
    </div>
  );
};

export default AnimatedQRCode; 