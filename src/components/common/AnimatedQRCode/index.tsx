import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateQRData } from './generateQRData';
import { QRDot } from './types';
import CashLogo from './CashLogo';

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
  logo?: string;
  
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
    setIsLoading(true);
    
    const loadQRData = async () => {
      try {
        const qrData = await generateQRData({
          value, 
          size,
          errorCorrection
        });
        
        setDots(qrData);
        setIsLoading(false);
        
        // Start animation if autoAnimate is true
        if (autoAnimate) {
          // Short delay before starting animation
          setTimeout(() => {
            setIsAnimating(true);
          }, 300);
        }
      } catch (error) {
        console.error('Error loading QR data:', error);
        setIsLoading(false);
      }
    };
    
    loadQRData();
  }, [value, size, errorCorrection, autoAnimate]);
  
  // Function to manually trigger animation
  const startAnimation = () => {
    setIsAnimating(true);
  };
  
  // Different animation patterns
  const getAnimationOrder = () => {
    switch(pattern) {
      case 'inside-out':
        // Sort dots by distance from center
        return [...dots].sort((a, b) => a.distanceFromCenter - b.distanceFromCenter);
      case 'outside-in':
        // Reverse of inside-out
        return [...dots].sort((a, b) => b.distanceFromCenter - a.distanceFromCenter);
      case 'wave':
        // Sort by y position to create wave effect
        return [...dots].sort((a, b) => a.y - b.y);
      case 'sequential':
        // Sort by row and column for sequential animation
        return [...dots].sort((a, b) => {
          if (a.row === b.row) return a.col - b.col;
          return a.row - b.row;
        });
      case 'random':
      default:
        // Randomize order
        return [...dots].sort(() => Math.random() - 0.5);
    }
  };
  
  // Get animation sequence based on pattern
  const animationOrder = getAnimationOrder();
  
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
        backgroundColor: lightColor,
        borderRadius: '12px',
        overflow: 'hidden'
      }}
    >
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
          {/* Base layer - placeholder QR (darker version) */}
          <div className="qr-placeholder">
            {dots.map((dot, idx) => (
              <div
                key={`base-${idx}`}
                style={{
                  position: 'absolute',
                  left: dot.x,
                  top: dot.y,
                  width: dot.size,
                  height: dot.size,
                  backgroundColor: darkColor,
                  borderRadius: dot.isRound ? '50%' : '20%',
                  opacity: placeholderOpacity
                }}
              />
            ))}
          </div>
          
          {/* Animation layer */}
          <AnimatePresence>
            {isAnimating && (
              <>
                {animationOrder.map((dot, idx) => (
                  <motion.div
                    key={`anim-${idx}`}
                    style={{
                      position: 'absolute',
                      left: dot.x,
                      top: dot.y,
                      width: dot.size,
                      height: dot.size,
                      backgroundColor: darkColor,
                      borderRadius: dot.isRound ? '50%' : '20%'
                    }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: idx * (0.002 / speed), // Control animation speed
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
              className="qr-logo" 
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: size * 0.22,
                height: size * 0.22,
                zIndex: 2
              }}
            >
              {/* Handle custom logo types */}
              {logo === 'cash-icon' ? (
                <CashLogo size={size * 0.22} />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <img 
                    src={logo} 
                    alt="QR Logo" 
                    width={size * 0.15} 
                    height={size * 0.15} 
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%'
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AnimatedQRCode; 