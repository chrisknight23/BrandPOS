import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ScreensaverMessaging } from '../ScreensaverMessaging';
import MileendbagelLogo from '../../../assets/images/logos/mileendbagel.png';
import { Screen } from '../../../types/screen';
import { BRAND_COLORS } from '../../../constants/colors';

// Screensaver animation phases
type ScreensaverPhase = 'normal' | 'drop' | 'expand' | 'fullscreen';

export interface ScreensaverCardProps {
  /** Background color for the card front face (CSS color string) */
  backgroundColor?: string;
  /** Background color for the card back face (CSS color string) */
  backfaceColor?: string;
  /** Brand name to display */
  brandName?: string;
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
  /** Whether to show the back face messaging content */
  showBackContent?: boolean;
  /** Callback when Follow button is clicked */
  onButtonClick?: () => void;
  /** Do a full 360° flip instead of 180° */
  fullFlip?: boolean;
  /** Custom content for the back face */
  customBackContent?: React.ReactNode;
  /** Navigation function to go to a specific screen */
  goToScreen?: (screen: Screen) => void;
  /** Whether the card should be flipped to show the back face */
  flipped?: boolean;
  /** Force flip to front face (overrides other flip logic) */
  flipToFront?: boolean;
  /** Force flip to QR code on back face (for ScreensaverFollow) */
  flipToQR?: boolean;
  /** Simple 180° flip to front (for close button) */
  simpleFlipToFront?: boolean;
  /** Hide front content until simpleFlipToFront is triggered */
  hideFrontContentUntilFlip?: boolean;
}

export const ScreensaverCard: React.FC<ScreensaverCardProps> = ({
  backgroundColor = BRAND_COLORS.primary,
  backfaceColor = BRAND_COLORS.primaryDark,
  brandName = '$mileendbagel',
  autoStart = true,
  startDelay = 2000,
  onExpandStart,
  initialPhase = 'normal',
  targetPhase,
  showFrontContent = true,
  showBackContent = true,
  onButtonClick,
  fullFlip = false,
  customBackContent,
  goToScreen,
  flipped = false,
  flipToFront = false,
  flipToQR = false,
  simpleFlipToFront = false,
  hideFrontContentUntilFlip = false,
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
    if (!autoStart || targetPhase) return;

    const startTimer = setTimeout(() => {
      setScreensaverPhase('drop');
      
      const expandTimer = setTimeout(() => {
        setScreensaverPhase('expand');
        onExpandStart?.();
      }, 50);
      
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

  const isExpanded = screensaverPhase === 'expand' || screensaverPhase === 'fullscreen';
  const isFullscreen = screensaverPhase === 'fullscreen';

  return (
    <div className="w-full h-full flex items-center justify-center">
      <motion.div
        animate={{
          rotateZ: isExpanded ? 90 : 0,
          height: isExpanded ? '578px' : '480px',
        }}
        initial={{ 
          rotateZ: isFullscreen ? 90 : 0,
          height: isFullscreen ? '578px' : '480px',
        }}
        className="relative"
        style={{
          transformOrigin: 'center center',
          perspective: '1000px',
          width: '361px',
          transformStyle: 'preserve-3d'
        }}
        transition={{
          rotateZ: {
            type: "spring",
            stiffness: 200,
            damping: 25,
            mass: 0.8
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
            rotateY: flipToFront ? 0 : (
              flipToQR ? 180 : (
                simpleFlipToFront ? (fullFlip ? 360 : 0) : (
                  isExpanded ? 180 : 
                  (fullFlip ? 540 : (flipped ? 180 : 0))
                )
              )
            )
          }}
          initial={{
            rotateY: isFullscreen ? 180 : (flipped ? 180 : 0)
          }}
          transition={{
            type: "spring",
            stiffness: (flipToFront || flipToQR || simpleFlipToFront) ? 120 : (isExpanded ? 120 : 50),
            damping: (flipToFront || flipToQR || simpleFlipToFront) ? 18 : (isExpanded ? 20 : 5),
            mass: (flipToFront || flipToQR || simpleFlipToFront) ? 1.2 : (isExpanded ? 1.2 : 0.45),
            restSpeed: 0.001,
            velocity: 2
          }}
        >
          {/* Front Face */}
          <motion.div
            className="absolute inset-0 w-full h-full backface-hidden"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(0deg)'
            }}
            animate={{
              backgroundColor: isExpanded ? BRAND_COLORS.primaryExpanded : backgroundColor,
              borderTop: isExpanded ? `1px solid ${BRAND_COLORS.borderTransparent}` : `1px solid ${BRAND_COLORS.borderLight}`,
              borderRadius: isExpanded ? '16px' : '32px'
            }}
            initial={{
              backgroundColor: isFullscreen ? BRAND_COLORS.primaryExpanded : backgroundColor,
              borderTop: isFullscreen ? `1px solid ${BRAND_COLORS.borderTransparent}` : `1px solid ${BRAND_COLORS.borderLight}`,
              borderRadius: isFullscreen ? '16px' : '32px'
            }}
            transition={{
              duration: screensaverPhase === 'fullscreen' ? 0 : 0.6,
              ease: "easeOut",
              borderRadius: {
                type: "spring",
                stiffness: 120,
                damping: 20,
                mass: 1.2,
                duration: screensaverPhase === 'fullscreen' ? 0 : undefined
              }
            }}
          >
            {/* Logo - always visible on front */}
            {showFrontContent && (
              <div className="w-full h-full flex flex-col items-center justify-center p-5 gap-6">
                <div className="w-full flex flex-col items-start" style={{ minHeight: '32px' }}>
                  {/* Header space */}
                </div>
                
                <div className="flex-1 w-full flex items-center justify-center relative">
                  <div className="flex items-center justify-center">
                    <img src={MileendbagelLogo} alt="Mileendbagel" className="w-auto h-auto max-w-[260px] max-h-[260px] object-contain" />
                  </div>
                </div>
                
                <div className="w-full flex flex-col items-start gap-4 px-[8px] pb-[8px]" style={{ minHeight: '88px' }}>
                  {/* Footer space */}
                </div>
              </div>
            )}

            {/* Header and Button - Show only in normal and drop phases, OR when simpleFlipToFront is true */}
            {showFrontContent && (
              hideFrontContentUntilFlip ? simpleFlipToFront : 
              (simpleFlipToFront || (screensaverPhase === 'normal' || screensaverPhase === 'drop'))
            ) && (
              <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-between p-5">
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
                    }}>{brandName}</div>
                  </div>
                </motion.div>

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
                    <button 
                      className="w-full h-full flex items-center justify-center relative z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        onButtonClick?.();
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

            {/* Logo Only - when front content is hidden */}
            {!showFrontContent && (
              <div className="w-full h-full flex items-center justify-center p-5">
                <div className="flex-1 w-full flex items-center justify-center relative">
                  <div className="flex items-center justify-center">
                    <img src={MileendbagelLogo} alt="Mileendbagel" className="w-auto h-auto max-w-[260px] max-h-[260px] object-contain" />
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Back Face */}
          <motion.div
            className="absolute inset-0 w-full h-full backface-hidden"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
            animate={{
              backgroundColor: isExpanded ? BRAND_COLORS.primaryExpanded : backfaceColor,
              borderTop: isExpanded ? `1px solid ${BRAND_COLORS.borderTransparent}` : `1px solid ${BRAND_COLORS.borderLight}`,
              borderRadius: isExpanded ? '16px' : '32px'
            }}
            initial={{
              backgroundColor: isFullscreen ? BRAND_COLORS.primaryExpanded : backfaceColor,
              borderTop: isFullscreen ? `1px solid ${BRAND_COLORS.borderTransparent}` : `1px solid ${BRAND_COLORS.borderLight}`,
              borderRadius: isFullscreen ? '16px' : '32px'
            }}
            transition={{
              duration: screensaverPhase === 'fullscreen' ? 0 : 0.6,
              ease: "easeOut",
              borderRadius: {
                type: "spring",
                stiffness: 120,
                damping: 20,
                mass: 1.2,
                duration: screensaverPhase === 'fullscreen' ? 0 : undefined
              }
            }}
          >
            {/* Default back content */}
            {showBackContent && !customBackContent && (
              <ScreensaverMessaging 
                isVisible={isExpanded}
                brandName={brandName}
                isStaticFullscreen={isFullscreen}
                goToScreen={goToScreen}
              />
            )}

            {/* Custom back content */}
            {showBackContent && customBackContent && customBackContent}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}; 