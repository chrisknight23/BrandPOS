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

  // Handle automatic animation sequence - RUBBER BAND EFFECT
  useEffect(() => {
    if (!autoStart || targetPhase) return; // Don't auto-animate if targetPhase is controlled

    // Start the screensaver sequence after initial delay
    const startTimer = setTimeout(() => {
      // Phase 1: Pull back (drop phase)
      setScreensaverPhase('drop');
      
      // Phase 2: Snap forward (expand phase) - no pause, just quick transition
      const expandTimer = setTimeout(() => {
        setScreensaverPhase('expand');
        onExpandStart?.(); // Notify parent when expand starts
      }, 50); // Minimal delay, just enough to trigger drop phase
      
      // Show overlay content after animations complete
      const overlayTimer = setTimeout(() => {
        setShowOverlay(true);
      }, 2500);

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
          // Rotation animation - only during expand phase
          rotateZ: screensaverPhase === 'expand' || screensaverPhase === 'fullscreen' ? 90 : 0,
          
          // Dimension changes during flip
          width: screensaverPhase === 'expand' || screensaverPhase === 'fullscreen' ? '361px' : '361px',
          height: screensaverPhase === 'expand' || screensaverPhase === 'fullscreen' ? '578px' : '480px',
        }}
        initial={{ 
          rotateZ: initialPhase === 'fullscreen' ? 90 : 0,
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
          rotateZ: {
            type: "spring",
            stiffness: 200,  // Much faster rotation
            damping: 25,     // Higher damping for quicker settle
            mass: 0.8        // Lower mass for faster response
          },
          width: {
            type: "spring",
            stiffness: 120,
            damping: 20,
            mass: 1.2
          },
          height: {
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
            rotateY: screensaverPhase === 'expand' ? 180 : 
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
            {/* Logo - always visible on front of card, positioned to match BrandPass layout */}
            {showFrontContent && (
              <div className="w-full h-full flex flex-col items-center justify-center p-5 gap-6">
                {/* Spacer for header area */}
                <div className="w-full flex flex-col items-start" style={{ minHeight: '32px' }}>
                  {/* This space matches the header area in BrandPass */}
                </div>
                
                {/* Middle section with Logo - matches BrandPass structure */}
                <div className="flex-1 w-full flex items-center justify-center relative">
                  {/* Mileendbagel Logo */}
                  <div className="flex items-center justify-center">
                    <img src={MileendbagelLogo} alt="Mileendbagel" className="w-auto h-auto max-w-[260px] max-h-[260px] object-contain" />
                  </div>
                </div>
                
                {/* Spacer for footer area */}
                <div className="w-full flex flex-col items-start gap-4 px-[8px] pb-[8px]" style={{ minHeight: '88px' }}>
                  {/* This space matches the footer area in BrandPass */}
                </div>
              </div>
            )}

            {/* Header and Button - Show only in normal and drop phases */}
            {showFrontContent && (screensaverPhase === 'normal' || screensaverPhase === 'drop') && (
              <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-between p-5">
                {/* Header with text - fades out during drop */}
                <motion.div 
                  className="w-full flex flex-col items-start"
                  animate={{
                    opacity: screensaverPhase === 'drop' ? 0 : 1
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut"
                  }}
                >
                  <div className="w-full flex justify-between items-center">
                    <div className="text-white text-base font-medium antialiased" style={{
                      textRendering: 'optimizeLegibility',
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale'
                    }}>$mileendbagel</div>
                  </div>
                </motion.div>

                {/* Footer with button - fades out during drop */}
                <motion.div 
                  className="w-full flex flex-col items-start gap-4 px-[8px] pb-[8px]"
                  animate={{
                    opacity: screensaverPhase === 'drop' ? 0 : 1
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut"
                  }}
                >
                  <div className="w-full h-[72px] relative overflow-hidden rounded-full bg-black bg-opacity-20">
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
                  </div>
                </motion.div>
              </div>
            )}

            {/* Logo Only - Show when front content is hidden - ALWAYS visible on front face */}
            {!showFrontContent && (
              <div 
                className="w-full h-full flex items-center justify-center p-5"
                style={{
                  // Counter-transform for ScreensaverExit orientation
                  transform: screensaverPhase === 'normal' ? 'scaleX(-1) rotateZ(180deg)' : 'none'
                }}
              >
                {/* Middle section with Logo only */}
                <div className="flex-1 w-full flex items-center justify-center relative">
                  <div className="flex items-center justify-center">
                    <img src={MileendbagelLogo} alt="Mileendbagel" className="w-auto h-auto max-w-[260px] max-h-[260px] object-contain" />
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Back Face - Card with Messaging */}
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
          >
            {/* Text Messaging - only visible on back face */}
            <ScreensaverMessaging 
              isVisible={screensaverPhase === 'expand' || screensaverPhase === 'fullscreen'}
              brandName={brandName}
              isStaticFullscreen={screensaverPhase === 'fullscreen'}
            />
          </motion.div>

        </motion.div>
      </motion.div>
    </div>
  );
}; 