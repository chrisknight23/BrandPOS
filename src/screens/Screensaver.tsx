import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BaseScreen } from '../components/common/BaseScreen/index';
import { ScreensaverCard } from '../components/common/ScreensaverCard';
import { BRAND_COLORS } from '../constants/colors';
import CashAppLogo from '../assets/images/logos/16x16logo.png';

export const Screensaver = ({ onNext, goToScreen }: { onNext: () => void; goToScreen?: (screen: string) => void }) => {
  const [isExpanding, setIsExpanding] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'normal' | 'drop' | 'expand'>('normal');

  // Start the animation sequence
  useEffect(() => {
    const dropTimer = setTimeout(() => {
      setAnimationPhase('drop');
    }, 0); // Start immediately

    const expandTimer = setTimeout(() => {
      setAnimationPhase('expand');
      setIsExpanding(true);
    }, 300); // Brief drop, then expand quickly

    return () => {
      clearTimeout(dropTimer);
      clearTimeout(expandTimer);
    };
  }, []);

  const handleFollowClick = () => {
    if (goToScreen) {
      goToScreen('ScreensaverFollow');
    }
  };

  return (
    <BaseScreen onNext={onNext}>
      <div className="w-full h-full bg-black text-white flex flex-col items-center justify-between relative overflow-hidden">
        
        {/* Card positioned in center with screen-controlled animation */}
        <motion.div 
          className="absolute w-full h-full flex justify-center items-center"
          style={{ 
            zIndex: 10,
            perspective: '1000px',
            transformStyle: 'preserve-3d'
          }}
          animate={{
            // Pull-back effect during drop phase, then scale up to fill device frame
            scale: animationPhase === 'normal' ? 1.0 :
                   animationPhase === 'drop' ? 0.7 :  // Nice pull-back effect
                   animationPhase === 'expand' ? 1.38 : 1.0,
            
            // Z-depth pull-back using translateZ (adjust this value to control how far it pulls back)
            translateZ: animationPhase === 'normal' ? 0 :
                       animationPhase === 'drop' ? -200 :  // Moderate pull-back distance
                       animationPhase === 'expand' ? 0 : 0,
            
            // Slight tilt during drop for dramatic effect
            rotateX: animationPhase === 'normal' ? 0 :
                     animationPhase === 'drop' ? 8 :  // Reduced from 15 for more subtle effect
                     animationPhase === 'expand' ? 0 : 0,
          }}
          transition={{
            scale: {
              type: "spring",
              stiffness: animationPhase === 'expand' ? 120 : 140,  // Slower drop, still elastic
              damping: animationPhase === 'expand' ? 15 : 4,       // Very low damping for elastic drop
              mass: animationPhase === 'expand' ? 1.2 : 0.8        // Lower mass for quicker, more elastic drop
            },
            translateZ: {
              type: "spring",
              stiffness: animationPhase === 'expand' ? 100 : 120,  // Slower drop, still elastic
              damping: animationPhase === 'expand' ? 12 : 3,       // Very low damping for elastic drop
              mass: animationPhase === 'expand' ? 1.5 : 0.9
            },
            rotateX: {
              type: "spring",
              stiffness: animationPhase === 'expand' ? 120 : 150,  // Less stiff for final landing
              damping: animationPhase === 'expand' ? 15 : 8,       // More damping for final landing
              mass: animationPhase === 'expand' ? 1.2 : 1.0
            }
          }}
        >
          <ScreensaverCard 
            backgroundColor={BRAND_COLORS.primary}
            brandName="$mileendbagel"
            initialPhase="normal"
            targetPhase={animationPhase === 'expand' ? 'expand' : 
                        animationPhase === 'drop' ? 'drop' : 'normal'}
            autoStart={false}            // Screen controls the animation now
            startDelay={0}
            onExpandStart={() => setIsExpanding(true)}
            showFrontContent={false}     // Hide header and button, show only logo
            onButtonClick={handleFollowClick}
            goToScreen={goToScreen}
          />
        </motion.div>

        {/* Bottom left message - fades out during card drop */}
        <motion.div 
          className="absolute bottom-0 left-0 p-8"
          animate={{
            opacity: 0
          }}
          transition={{
            duration: 0.3,
            delay: 0, // Start fading when card drop begins
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
              Follow us on<br/>
              Cash App and<br/>
              earn rewards
            </p>
          </div>
        </motion.div>


      </div>
    </BaseScreen>
  );
}; 