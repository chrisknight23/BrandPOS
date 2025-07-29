import { BaseScreen } from '../../components/common/BaseScreen';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useSlideTransition } from '../../hooks/useSlideTransition';
import { BrandPass } from '../../components/common/BrandPass';
import LocalCashLogo from '../../assets/images/14/Local-Cash.svg';
import LocalCash24Icon from '../../assets/images/Local-Cash-24px.svg';
import SkippedIcon from '../../assets/images/32/32/skipped.svg';
import { Screen } from '../../types/screen';
import { useTextContent } from '../../context/TextContentContext';

interface RewardProps {
  onNext: () => void;
  goToScreen?: (screen: Screen) => void;
}

export const Reward = ({ onNext, goToScreen }: RewardProps) => {
  const { getText } = useTextContent();
  const [showAnimations, setShowAnimations] = useState(false);
  const [showSecondPhase, setShowSecondPhase] = useState(false);
  const [startTextPushBack, setStartTextPushBack] = useState(false);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  
  // Use the slide transition hook for consistent animation patterns
  const { enterAnimation, springConfig } = useSlideTransition(onNext);

  useEffect(() => {
    // Start all animations immediately when component mounts
    const initialTimer = setTimeout(() => {
      setShowAnimations(true);
      
      // Start card animation directly after a short pause (no peeking phase)
      const cardTimer = setTimeout(() => {
        setShowSecondPhase(true);
        setStartTextPushBack(true);
      }, 1500); // 1.5 second pause after text appears, then card slides in
      
      return () => {
        clearTimeout(cardTimer);
      };
    }, 0); // Changed from 500 to 0 to start immediately
    
    return () => clearTimeout(initialTimer);
  }, []);

  const handleCardClick = () => {
    // The BrandPass component will handle the flip and notify us via onFlip
    // This function can be used for any additional logic if needed
  };

  const handleTimerComplete = () => {
    // Start exit animations when timer completes
    setIsExiting(true);
    
    // Navigate to End screen after exit animations complete
    setTimeout(() => {
      if (goToScreen) {
        goToScreen('End');
      } else {
        onNext(); // Fallback to onNext if goToScreen not available
      }
    }, 220); // Adjusted to allow spring animation to complete smoothly
  };

  return (
    <BaseScreen>
      <div 
        className="w-full h-full bg-black text-white flex flex-col items-center justify-between relative overflow-hidden"
      >
        {/* Bottom text with Local Cash that stays fixed */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: isExiting || showSecondPhase ? 0 : 1  // Fade out when card slides up
          }}
          transition={{ 
            duration: isExiting ? 0.1 : 0.2,  // Faster fade-out to match card slide
            ease: "easeOut", 
            delay: isExiting ? 0 : 0.1
          }}
          style={{
            willChange: 'opacity',
            backfaceVisibility: 'hidden'
          }}
        >
          <img src={LocalCash24Icon} alt="Local Cash" className="w-6 h-6 opacity-70" />
          <span className="text-white text-[24px] font-cash font-normal opacity-70">
            Local Cash
          </span>
        </motion.div>

        <motion.div 
          className="flex-1 flex flex-col items-center justify-center w-full relative overflow-hidden"
          initial={enterAnimation.initial}
          animate={enterAnimation.animate}
          exit={isExiting ? { opacity: 0 } : { opacity: 1 }}
          transition={{ 
            type: 'spring',
            ...springConfig,
            restSpeed: 0.001,
            restDelta: 0.001
          }}
          style={{
            willChange: 'transform',
            backfaceVisibility: 'hidden'
          }}
        >
          {/* Main text in center that gets pushed back */}
          <motion.div 
            className="flex-1 flex flex-col items-center justify-center w-full"
            animate={{ 
              opacity: isExiting ? 0 : (!startTextPushBack ? 1 : 0)  // Removed showAnimations check
            }}
            transition={{ 
              duration: 0.3, 
              ease: "easeOut",
              restSpeed: 0.001,
              restDelta: 0.001
            }}
            style={{
              zIndex: startTextPushBack ? 1 : 10,
              willChange: 'transform, opacity',
              backfaceVisibility: 'hidden'
            }}
          >
            <h1 
              className="text-[110px] font-cash font-medium text-center leading-[0.85] tracking-[-0.02em]"
              dangerouslySetInnerHTML={{ __html: getText('amountEarned') }}
            />
          </motion.div>

          {/* BrandPass card that slides up from bottom */}
          <motion.div 
            className="absolute w-full h-full flex justify-center items-center"
            initial={{ y: 500 }}
            animate={{ 
              y: isExiting ? 500 : (showSecondPhase ? 0 : 500)
            }}
            transition={{
              type: "spring",
              stiffness: isExiting ? 400 : 120,  // Increased stiffness for faster exit
              damping: isExiting ? 35 : 18,      // Increased damping for smoother motion
              mass: isExiting ? 1 : 1.2,         // Reduced mass for faster movement
              restDelta: 0.001,
              restSpeed: 0.001,
              ...(isExiting && { velocity: -100 })  // Increased initial velocity for faster start
            }}
            style={{
              zIndex: showSecondPhase ? 20 : 5,
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              perspective: 1000
            }}
          >
            <BrandPass
              layoutId="reward-card"
              headerText="$mileendbagel"
              subheaderText="Reward"
              buttonText="Claim"
              onClick={handleCardClick}
              onFlip={setIsCardFlipped}
              showProgressTimer={showSecondPhase}
              disableAnimation={true}
              noAnimation={true}
              showAnimatedNumber={true}
              initialValue={1}
              flipped={isCardFlipped}
              onTimerComplete={handleTimerComplete}
            />
          </motion.div>

          {/* Bottom left message that fades in when card slides up */}
          <motion.div 
            className="absolute bottom-0 left-0 p-8 max-w-[216px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: isExiting ? 0 : (showSecondPhase ? 1 : 0),
              y: isExiting ? 20 : (showSecondPhase ? 0 : 20)
            }}
            transition={{ 
              duration: isExiting ? 0.1 : 0.3,
              ease: "easeOut", 
              delay: isExiting ? 0 : 0.25,
              restSpeed: 0.001,
              restDelta: 0.001
            }}
            style={{
              willChange: 'transform, opacity',
              backfaceVisibility: 'hidden',
              zIndex: 20,
              pointerEvents: 'auto'
            }}
          >
            <div className="w-full">
              <div className="flex items-center gap-1 mb-4">
                <img src={LocalCashLogo} alt="Local Cash" className="w-3.5 h-3.5" />
                <p className="text-white/70 text-[14px] font-normal">
                  Local Cash
                </p>
              </div>
              <div className="whitespace-pre-line">
                <p 
                  className="text-white text-[20px] leading-[24px] font-normal line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: getText(isCardFlipped ? 'scanToClaim' : 'localCashText') }}
                />
              </div>
            </div>
          </motion.div>

          {/* Close button positioned at bottom right */}
          <motion.button
            onClick={() => {
              handleTimerComplete();
            }}
            className="absolute bottom-8 right-8 w-16 h-16 rounded-full bg-black border border-white/20 flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: isExiting ? 0 : (showSecondPhase ? 1 : 0),
              y: isExiting ? 20 : (showSecondPhase ? 0 : 20)
            }}
            transition={{ 
              duration: isExiting ? 0.1 : 0.3,
              ease: "easeOut", 
              delay: isExiting ? 0 : 0.25,
              restSpeed: 0.001,
              restDelta: 0.001
            }}
            whileTap={{ scale: 0.95 }}
            tabIndex={0}
            aria-label="Close and return to home"
            style={{
              zIndex: 20,
              willChange: 'transform, opacity',
              backfaceVisibility: 'hidden'
            }}
          >
            <img src={SkippedIcon} alt="Skip" className="w-8 h-8" />
          </motion.button>
        </motion.div>
      </div>
    </BaseScreen>
  );
}; 