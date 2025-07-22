import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BaseScreen } from '../../components/common/BaseScreen/index';
import { ScreensaverCard } from '../../components/common/ScreensaverCard';

import { AnimatedQRCode } from '../../components/common/AnimatedQRCode';
import { ToggleButton } from '../../components/ui/ToggleButton';
import { BRAND_COLORS } from '../../constants/colors';
import CashAppLogo from '../../assets/images/logos/16x16logo.png';
import QRIcon from '../../assets/images/24/qr.svg';
import SMSIcon from '../../assets/images/24/comm-sms.svg';
import { Screen } from '../../types/screen';

interface ScreensaverFollowProps {
  onNext: () => void;
  onClose?: () => void;
  goToScreen?: (screen: Screen) => void;
}

export const ScreensaverFollow = ({ onNext, onClose, goToScreen }: ScreensaverFollowProps) => {
  const [animationPhase, setAnimationPhase] = useState<'fullscreen' | 'shrinking' | 'landed'>('fullscreen');
  const [backMode, setBackMode] = useState<'qr' | 'phone'>('qr');
  const [isExiting, setIsExiting] = useState(false);
  const [showNavigation, setShowNavigation] = useState(false);
  const [showExitText, setShowExitText] = useState(false);
  const [simpleFlipToFront, setSimpleFlipToFront] = useState(false); // Control simple flip to front face

  // Start the shrinking animation immediately
  useEffect(() => {
    const shrinkTimer = setTimeout(() => {
      setAnimationPhase('shrinking');
    }, 0); // Start immediately

    // Automatically transition to landed phase right after shrinking starts for immediate scale back up
    const landedTimer = setTimeout(() => {
      setAnimationPhase('landed');
      setShowNavigation(true); // Show navigation when animation completes
    }, 400); // Just the animation duration

    return () => {
      clearTimeout(shrinkTimer);
      clearTimeout(landedTimer);
    };
  }, []);



  // Handle animation completion
  const handleAnimationComplete = () => {
    if (animationPhase === 'shrinking') {
      setAnimationPhase('landed');
      // Animation complete - stay on this screen
    }
  };

  const handleClose = () => {
    setIsExiting(true);
    
    // Start the exit animation sequence - same as Follow screen
    // 1. Fade out navigation
    setShowNavigation(false);
    
    // 2. Simple flip card to front face after a short delay
    setTimeout(() => {
      setSimpleFlipToFront(true); // Simple flip card to front face
    }, 150);
    
    // 3. Change text after navigation fades and card starts flipping
    setTimeout(() => {
      setShowExitText(true);
    }, 250); // Delay text change slightly after navigation fade and card flip start
    
    // 4. Navigate to home after card flip animation completes
    setTimeout(() => {
      if (onClose) {
        onClose();
      } else if (goToScreen) {
        goToScreen('Home'); // Navigate directly to Home screen
      } else {
        onNext(); // Fallback to onNext if neither onClose nor goToScreen are provided
      }
    }, 1200); // Total animation time: 150ms delay + 1050ms for card flip to complete
  };



  return (
    <BaseScreen onNext={onNext}>
      <div className="w-full h-full bg-black text-white flex flex-col items-center justify-between relative overflow-hidden">
        
        {/* ScreensaverCard with flip control */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ 
            zIndex: 20,
            perspective: '1000px',
            transformStyle: 'preserve-3d'
          }}
          initial={{
            scale: 1.38,  // Start at full frame scale
          }}
          animate={{
            scale: animationPhase === 'fullscreen' ? 1.38 : 
                   animationPhase === 'shrinking' ? 0.7 :
                   animationPhase === 'landed' ? 1.0 : 1.38, // Scale sequence: 1.38 → 0.7 → 1.0
          }}
          transition={{
            scale: {
              duration: 0.4,
              ease: [0.32, 0.72, 0, 1],
              delay: 0
            }
          }}
          onAnimationComplete={handleAnimationComplete}
        >
          <ScreensaverCard 
            backgroundColor={BRAND_COLORS.primary}
            brandName="$mileendbagel"
            initialPhase="fullscreen"     // Start in fullscreen state with messaging on back face
            targetPhase={animationPhase === 'shrinking' || animationPhase === 'landed' ? 'normal' : 'fullscreen'} // Animate to normal when shrinking
            autoStart={false}            // Don't use automatic animation sequence
            startDelay={0}               // No delay needed
            onExpandStart={() => {}}
            showFrontContent={simpleFlipToFront}  // Show header and button only when close button is pressed
            showBackContent={animationPhase !== 'fullscreen'} // Show QR code after animation starts
            fullFlip={true}              // Do a full 360° flip to end on back face
            simpleFlipToFront={simpleFlipToFront}    // Simple flip to front face when needed
            goToScreen={goToScreen}
            customBackContent={
              <div className="w-full h-full flex flex-col items-center justify-center p-8">
                {/* QR code container */}
                <div 
                  className="relative overflow-hidden"
                  style={{ maxHeight: '300px' }}
                >
                  <AnimatedQRCode
                    value={`https://chrisk.ngrok.app/landing/follow-session`}
                    size={260}
                    animateIn={animationPhase !== 'fullscreen' ? "sequential" : false}
                    disableAnimation={false}
                    speed={100.0}
                    darkColor="#FFFFFF"
                    lightColor="transparent"
                    placeholderOpacity={1.0}
                    logo="cash-icon"
                    className="max-h-[260px] overflow-hidden"
                    onAnimationComplete={() => {
                      console.log("QR animation complete");
                    }}
                  />
                </div>
              </div>
            }
          />
        </motion.div>

        {/* Bottom left message - fades in when animation completes */}
        <motion.div 
          className="absolute bottom-0 left-0 p-8"
          initial={{ opacity: 0 }}
          animate={{
            opacity: animationPhase === 'landed' ? 1 : 0
          }}
          transition={{
            duration: 0.3,
            delay: animationPhase === 'landed' ? 0.2 : 0,
            ease: "easeOut"
          }}
        >
          <div>
            <div className="flex items-center gap-1 mb-4">
              <img src={CashAppLogo} alt="Cash App" className="w-4 h-4" />
              <p className="text-white/70 text-[14px] font-normal">
                Cash App
              </p>
            </div>
            <p className="text-white text-[20px] leading-[24px] font-normal">
              {showExitText ? (
                <>Follow us on<br/>Cash App and<br/>earn rewards</>
              ) : (
                <>Scan or text<br/>to follow and<br/>earn rewards</>
              )}
            </p>
          </div>
        </motion.div>

        {/* Right side controls - same as Follow screen */}
        <motion.div 
          className="absolute right-0 top-0 h-full flex flex-col justify-center items-center p-8 z-30"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: showNavigation ? 1 : 0
          }}
          transition={{
            duration: 0.3,
            ease: "easeOut"
          }}
        >
          {/* Unified Toggle Button */}
          <ToggleButton
            selectedIndex={backMode === 'qr' ? 0 : 1}
            onToggle={(index: number) => setBackMode(index === 0 ? 'qr' : 'phone')}
            icons={[
              // QR icon (index 0)
              <img src={QRIcon} alt="QR Code" className="w-6 h-6 block" />,
              // SMS icon (index 1)
              <img src={SMSIcon} alt="SMS" className="w-6 h-6 block" />
            ]}
          />

          {/* Close button positioned at bottom */}
          <motion.button
            onClick={handleClose}
            className="w-16 h-16 rounded-full bg-black border border-white/20 flex items-center justify-center absolute bottom-8"
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
            tabIndex={0}
            aria-label="Close and return to home"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
        </motion.div>

      </div>
    </BaseScreen>
  );
}; 