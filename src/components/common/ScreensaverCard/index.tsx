import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ScreensaverMessaging } from '../ScreensaverMessaging';
import MileendbagelLogo from '../../../assets/images/logos/mileendbagel.png';

// Screensaver animation phases
type ScreensaverPhase = 'normal' | 'drop' | 'rotate' | 'expand' | 'fullscreen';

export interface ScreensaverCardProps {
  /** Background color for the card (CSS color string) */
  backgroundColor?: string;
  /** Background color for the back of the card (CSS color string) */
  backfaceColor?: string;
  /** Brand name to display */
  brandName?: string;
  /** Subtitle text */
  subtitle?: string;
  /** Custom class name for the card container */
  className?: string;
  /** Whether to start the screensaver animation immediately */
  autoStart?: boolean;
  /** Delay before starting the animation sequence */
  startDelay?: number;
  /** Callback when expand phase starts */
  onExpandStart?: () => void;
  /** Initial phase to start the card in */
  initialPhase?: ScreensaverPhase;
  /** Target phase to animate to (for controlled animations) */
  targetPhase?: ScreensaverPhase;
  /** Whether to show the front face content (header and button) */
  showFrontContent?: boolean;
}

export const ScreensaverCard: React.FC<ScreensaverCardProps> = ({
  backgroundColor = 'bg-[#5D5D3F]',
  backfaceColor = 'bg-[#4A4A32]',
  brandName = '$mileendbagel',
  subtitle = 'Screensaver Mode',
  className = '',
  autoStart = true,
  startDelay = 2000,
  onExpandStart,
  initialPhase = 'normal',
  targetPhase,
  showFrontContent = true,
}) => {
  const [screensaverPhase, setScreensaverPhase] = useState<ScreensaverPhase>(initialPhase);
  const [showOverlay, setShowOverlay] = useState(initialPhase === 'expand');

  // Handle controlled animation to targetPhase
  useEffect(() => {
    if (targetPhase && targetPhase !== screensaverPhase) {
      const timer = setTimeout(() => {
        setScreensaverPhase(targetPhase);
        if (targetPhase === 'expand') {
          onExpandStart?.();
          setShowOverlay(true);
        } else if (targetPhase === 'normal') {
          setShowOverlay(false);
        }
      }, startDelay);
      return () => clearTimeout(timer);
    }
  }, [targetPhase, screensaverPhase, startDelay, onExpandStart]);

  // Handle automatic animation sequence
  useEffect(() => {
    if (!autoStart || targetPhase) return; // Don't auto-animate if targetPhase is controlled

    // Start the screensaver sequence after initial delay
    const startTimer = setTimeout(() => {
      // Phase 1: Drop first
      setScreensaverPhase('drop');
      
      // Phase 2: Expand at the low point of elastic bounce for fluid transition
      const expandTimer = setTimeout(() => {
        setScreensaverPhase('expand');
        onExpandStart?.(); // Notify parent when expand starts
      }, 400); // Trigger at elastic low point, not after settling
      
      // Show overlay content after animations complete
      const overlayTimer = setTimeout(() => {
        setShowOverlay(true);
      }, 3500);

      return () => {
        clearTimeout(expandTimer);
        clearTimeout(overlayTimer);
      };
    }, startDelay);

    return () => clearTimeout(startTimer);
  }, [autoStart, startDelay, targetPhase, onExpandStart]);

  return (
    <div className={`w-full h-full flex items-center justify-center ${className}`}>
      {/* 
        SCREENSAVER CARD ANIMATION
        =========================
        
        Multi-phase animation sequence:
        1. DROP: Card scales from 1.0 to 0.85 with spring bounce
        2. ROTATE: Card rotates 90° and flips to back side  
        3. EXPAND: Card scales to 2.2x and fills device frame (800x500)
        
        Card maintains same aspect ratio as BrandPass (361x480)
      */}
      <motion.div
        animate={{
          // Scale animation based on phase
          scale: screensaverPhase === 'normal' ? 1.0 :
                 screensaverPhase === 'drop' ? 0.6 :
                 screensaverPhase === 'expand' || screensaverPhase === 'fullscreen' ? 1.38 : 1.0,
          
          // Rotation animation - only during expand phase
          rotateZ: screensaverPhase === 'expand' || screensaverPhase === 'fullscreen' ? 90 : 0,
          
          // Dimension changes during flip - MANUAL ADJUSTMENT AREA
          width: screensaverPhase === 'expand' || screensaverPhase === 'fullscreen' ? '361px' : '361px',  // Change these values manually
          height: screensaverPhase === 'expand' || screensaverPhase === 'fullscreen' ? '578px' : '480px', // Change these values manually
          
          // 3D perspective effects - only during expand to avoid conflicts
          rotateX: screensaverPhase === 'expand' || screensaverPhase === 'fullscreen' ? 0 : 0,
          rotateY: screensaverPhase === 'expand' || screensaverPhase === 'fullscreen' ? 0 : 0,
          z: screensaverPhase === 'expand' || screensaverPhase === 'fullscreen' ? -40 : 0,
        }}
        initial={{ 
          scale: initialPhase === 'fullscreen' ? 1.38 : 1.0,
          rotateZ: initialPhase === 'fullscreen' ? 90 : 0,
          rotateX: 0,
          rotateY: 0,
          z: initialPhase === 'fullscreen' ? -40 : 0,
          width: initialPhase === 'fullscreen' ? '361px' : '361px',
          height: initialPhase === 'fullscreen' ? '578px' : '480px',
        }}
        className="relative"
        style={{
          transformOrigin: 'center center',
          perspective: '1000px',
          width: '361px',
          height: '480px',
          transformStyle: 'preserve-3d'
        }}
        transition={{
          scale: {
            delay: 0,
            type: "spring",
            stiffness: screensaverPhase === 'expand' || screensaverPhase === 'fullscreen' ? 120 : 
                      screensaverPhase === 'drop' ? 100 : 200,
            damping: screensaverPhase === 'expand' || screensaverPhase === 'fullscreen' ? 20 : 
                    screensaverPhase === 'drop' ? 8 : 15,
            mass: screensaverPhase === 'expand' || screensaverPhase === 'fullscreen' ? 1.2 : 
                 screensaverPhase === 'drop' ? 1.5 : 0.8,
            velocity: screensaverPhase === 'drop' ? -2 : 0
          },
          rotateZ: {
            delay: 0,
            type: "spring",
            stiffness: screensaverPhase === 'expand' || screensaverPhase === 'fullscreen' ? 120 : 150,
            damping: screensaverPhase === 'expand' || screensaverPhase === 'fullscreen' ? 20 : 20,
            mass: screensaverPhase === 'expand' || screensaverPhase === 'fullscreen' ? 1.2 : 1.0
          },
          // Animation settings for manual dimension changes
          width: {
            delay: 0,
            type: "spring",
            stiffness: 120,
            damping: 20,
            mass: 1.2
          },
          height: {
            delay: 0,
            type: "spring",
            stiffness: 120,
            damping: 20,
            mass: 1.2
          },

          rotateX: {
            delay: 0,
            type: "spring",
            stiffness: 120,
            damping: 20,
            mass: 1.2
          },
          rotateY: {
            delay: 0,
            type: "spring",
            stiffness: 120,
            damping: 20,
            mass: 1.2
          },
          z: {
            delay: 0,
            type: "spring",
            stiffness: 120,
            damping: 20,
            mass: 1.2
          }
        }}
      >
        <motion.div
          className="w-full h-full relative"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ 
            rotateY: screensaverPhase === 'expand' ? 360 : 
                    screensaverPhase === 'fullscreen' ? 180 : 0
          }}
          initial={{
            rotateY: initialPhase === 'fullscreen' ? 180 : 0
          }}
          transition={{
            type: "spring",
            stiffness: screensaverPhase === 'expand' || screensaverPhase === 'fullscreen' ? 120 : 50,
            damping: screensaverPhase === 'expand' || screensaverPhase === 'fullscreen' ? 20 : 5,
            mass: screensaverPhase === 'expand' || screensaverPhase === 'fullscreen' ? 1.2 : 0.45,
            restSpeed: 0.001,
            velocity: 2
          }}
        >
          {/* Front Face - BrandPass Content */}
          <motion.div
            className="absolute inset-0 w-full h-full backface-hidden"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(0deg)'
            }}
            animate={{
              backgroundColor: screensaverPhase === 'expand' || screensaverPhase === 'fullscreen' ? '#3B3B28' : '#5D5D3F',
              borderTop: screensaverPhase === 'expand' || screensaverPhase === 'fullscreen' ? '1px solid rgba(255, 255, 255, 0)' : '1px solid rgba(255, 255, 255, 0.2)',
              // Corner radius changes during transition - MANUAL ADJUSTMENT AREA
              borderRadius: screensaverPhase === 'expand' || screensaverPhase === 'fullscreen' ? '16px' : '32px' // Change these values manually
            }}
            initial={{
              backgroundColor: initialPhase === 'fullscreen' ? '#3B3B28' : '#5D5D3F',
              borderTop: initialPhase === 'fullscreen' ? '1px solid rgba(255, 255, 255, 0)' : '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: initialPhase === 'fullscreen' ? '16px' : '32px'
            }}
            transition={{
              duration: screensaverPhase === 'fullscreen' ? 0 : 0.6,
              ease: "easeOut",
              // Animation settings for manual corner radius changes
              borderRadius: {
                type: "spring",
                stiffness: 120,
                damping: 20,
                mass: 1.2,
                duration: screensaverPhase === 'fullscreen' ? 0 : undefined
              }
            }}
          >
            {/* BrandPass Content - Only show in normal and drop phases AND when showFrontContent is true */}
            {showFrontContent && (screensaverPhase === 'normal' || screensaverPhase === 'drop') && (
              <div className="w-full h-full flex flex-col items-center justify-center p-5 gap-6">
                {/* Header with text */}
                <motion.div 
                  className="w-full flex flex-col items-start"
                  animate={{ 
                    opacity: screensaverPhase === 'drop' ? 0 : 1 
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-full flex justify-between items-center">
                    <div className="text-white text-base font-medium antialiased" style={{
                      textRendering: 'optimizeLegibility',
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale'
                    }}>$mileendbagel</div>
                  </div>
                </motion.div>

                {/* Middle section with Logo */}
                <div className="flex-1 w-full flex items-center justify-center relative">
                  {/* Mileendbagel Logo */}
                  <div className="flex items-center justify-center">
                    <img src={MileendbagelLogo} alt="Mileendbagel" className="w-auto h-auto max-w-[260px] max-h-[260px] object-contain" />
                  </div>
                </div>

                {/* Footer with button */}
                <div className="w-full flex flex-col items-start gap-4 px-[8px] pb-[8px]">
                  <motion.div 
                    className="w-full h-[72px] relative overflow-hidden rounded-full bg-black bg-opacity-20"
                    animate={{ 
                      opacity: screensaverPhase === 'drop' ? 0 : 1 
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Button content */}
                    <button 
                      className="w-full h-full flex items-center justify-center relative z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle button click if needed
                      }}
                    >
                      <span className="text-2xl font-medium text-white antialiased" style={{
                        textRendering: 'optimizeLegibility',
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale'
                      }}>Follow</span>
                    </button>
                  </motion.div>
                </div>
              </div>
            )}

            {/* Logo Only - Show when front content is hidden */}
            {!showFrontContent && (screensaverPhase === 'normal' || screensaverPhase === 'drop') && (
              <div className="w-full h-full flex items-center justify-center p-5">
                {/* Middle section with Logo only */}
                <div className="flex-1 w-full flex items-center justify-center relative">
                  <div className="flex items-center justify-center">
                    <img src={MileendbagelLogo} alt="Mileendbagel" className="w-auto h-auto max-w-[260px] max-h-[260px] object-contain" />
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Back Face - Blank Card */}
          <motion.div
            className="absolute inset-0 w-full h-full backface-hidden"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
            animate={{
              backgroundColor: screensaverPhase === 'expand' || screensaverPhase === 'fullscreen' ? '#3B3B28' : '#4A4A32',
              borderTop: screensaverPhase === 'expand' || screensaverPhase === 'fullscreen' ? '1px solid rgba(255, 255, 255, 0)' : '1px solid rgba(255, 255, 255, 0.2)',
              // Corner radius changes during transition - MANUAL ADJUSTMENT AREA
              borderRadius: screensaverPhase === 'expand' || screensaverPhase === 'fullscreen' ? '16px' : '32px' // Change these values manually
            }}
            initial={{
              backgroundColor: initialPhase === 'fullscreen' ? '#3B3B28' : '#4A4A32',
              borderTop: initialPhase === 'fullscreen' ? '1px solid rgba(255, 255, 255, 0)' : '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: initialPhase === 'fullscreen' ? '16px' : '32px'
            }}
            transition={{
              duration: screensaverPhase === 'fullscreen' ? 0 : 0.6,
              ease: "easeOut",
              // Animation settings for manual corner radius changes
              borderRadius: {
                type: "spring",
                stiffness: 120,
                damping: 20,
                mass: 1.2,
                duration: screensaverPhase === 'fullscreen' ? 0 : undefined
              }
            }}
          />

          {/* Text Messaging - fades in during card flip transition */}
          <ScreensaverMessaging 
            isVisible={screensaverPhase === 'expand' || screensaverPhase === 'fullscreen'}
            brandName={brandName}
            isStaticFullscreen={screensaverPhase === 'fullscreen'}
          />

        </motion.div>
      </motion.div>
    </div>
  );
}; 