import { BaseScreen } from '../components/common/BaseScreen/index';
import { BrandPass } from '../components/common/BrandPass';
import { motion } from 'framer-motion';
import { useEffect, useState, useRef, useCallback } from 'react';
import CashAppLogo from '../assets/images/logos/16x16logo.png';
import { useTextContent } from '../context/TextContentContext';
import { Screen } from '../types/screen';

interface HomeProps {
  onNext: () => void;
  isIdle?: boolean;
  goToScreen?: (screen: Screen) => void;
  shouldReverseAnimate?: boolean;
  fromEndScreen?: boolean; // Add new prop to track if we came from End screen
}

const SCREENSAVER_DELAY = 20000; // 20 seconds

export const Home = ({ onNext, isIdle = false, goToScreen, shouldReverseAnimate = false, fromEndScreen = false }: HomeProps) => {
  const { getText } = useTextContent();
  const [showAnimations, setShowAnimations] = useState(isIdle);
  const [showSecondPhase, setShowSecondPhase] = useState(isIdle);
  const [startTextPushBack, setStartTextPushBack] = useState(isIdle);
  const [isReversing, setIsReversing] = useState(false);
  const screensaverTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Function to clear existing timer
  const clearScreensaverTimer = useCallback(() => {
    if (screensaverTimerRef.current) {
      clearTimeout(screensaverTimerRef.current);
      screensaverTimerRef.current = null;
    }
  }, []);

  // Function to start new timer
  const startScreensaverTimer = useCallback(() => {
    clearScreensaverTimer();
    
    // Don't start screensaver timer if we came from End screen
    if (!isIdle && !isReversing && !fromEndScreen) {
      screensaverTimerRef.current = setTimeout(() => {
        goToScreen?.('Screensaver');
      }, SCREENSAVER_DELAY);
    }
  }, [isIdle, isReversing, fromEndScreen, goToScreen, clearScreensaverTimer]);

  // Handle reverse animation sequence
  useEffect(() => {
    if (shouldReverseAnimate && !isReversing) {
      clearScreensaverTimer();
      setIsReversing(true);
      setShowSecondPhase(false);
      setStartTextPushBack(false);
    }
  }, [shouldReverseAnimate, isReversing, clearScreensaverTimer]);

  // Handle initial animation sequence
  useEffect(() => {
    if (!isIdle && !isReversing && !shouldReverseAnimate) {
      const initialTimer = setTimeout(() => {
        setShowAnimations(true);
        
        const textPushBackTimer = setTimeout(() => {
          setStartTextPushBack(true);
        }, 2960);
        
        const secondPhaseTimer = setTimeout(() => {
          setShowSecondPhase(true);
          // Only start screensaver timer if not coming from End screen
          if (!fromEndScreen) {
            startScreensaverTimer();
          }
        }, 3000);
        
        return () => {
          clearTimeout(textPushBackTimer);
          clearTimeout(secondPhaseTimer);
        };
      }, 500);
      
      return () => {
        clearTimeout(initialTimer);
        clearScreensaverTimer();
      };
    }
  }, [isIdle, isReversing, shouldReverseAnimate, fromEndScreen, clearScreensaverTimer, startScreensaverTimer]);

  // Reset timer on any user interaction
  const handleUserInteraction = useCallback(() => {
    if (!isIdle && !isReversing && !fromEndScreen) {
      clearScreensaverTimer();
      startScreensaverTimer();
    }
  }, [clearScreensaverTimer, startScreensaverTimer, isIdle, isReversing, fromEndScreen]);

  const handleFollowButtonClick = () => {
    clearScreensaverTimer();
    if (goToScreen) {
      goToScreen('Follow');
    } else {
      onNext();
    }
  };

  // Normal forward animation sequence
  useEffect(() => {
    if (!isIdle && !isReversing && !shouldReverseAnimate) {
      const initialTimer = setTimeout(() => {
        setShowAnimations(true);
        
        const textPushBackTimer = setTimeout(() => {
          setStartTextPushBack(true);
        }, 2960);
        
        const secondPhaseTimer = setTimeout(() => {
          setShowSecondPhase(true);
          startScreensaverTimer();
        }, 3000);
        
        return () => {
          clearTimeout(textPushBackTimer);
          clearTimeout(secondPhaseTimer);
        };
      }, 500);
      
      return () => clearTimeout(initialTimer);
    }
  }, [isIdle, isReversing, shouldReverseAnimate, startScreensaverTimer]);

  return (
    <BaseScreen onNext={onNext}>
      <div 
        className="w-full h-full bg-black text-white flex flex-col items-center justify-between relative overflow-hidden"
        onClick={handleUserInteraction}
        onTouchStart={handleUserInteraction}
      >
        <motion.div 
          className="flex-1 flex flex-col items-center justify-center w-full px-8"
          animate={isIdle ? {} : { 
            opacity: startTextPushBack ? 0 : 1
          }}
          transition={{ 
            duration: 0.3, 
            ease: "easeOut" 
          }}
          style={{
            zIndex: isIdle ? 1 : (isReversing ? 1 : (startTextPushBack ? 1 : 10)),
            opacity: isIdle ? 0 : undefined
          }}
        >
          <motion.div 
            className="w-full"
            initial={false}
            animate={isIdle ? {} : { opacity: showAnimations ? 1 : 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h1 
              className="text-[90px] font-cash font-medium text-center leading-[0.85] tracking-[-0.02em]"
              dangerouslySetInnerHTML={{ 
                __html: getText('introText')
              }}
            />
          </motion.div>
          <motion.p 
            className="text-[22px] text-white mt-4"
            initial={false}
            animate={isIdle ? {} : { opacity: showAnimations ? 0.5 : 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            $mileendbagel on Cash App
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="absolute w-full h-full flex justify-center items-center"
          initial={false}
          animate={isIdle ? { y: 0 } : { 
            y: showSecondPhase ? 
              0 : 
              (showAnimations ? 
                420 : 
                500)
          }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 18,
            mass: 1.2,
            restDelta: 0.001
          }}
          style={{
            zIndex: isIdle ? 10 : (isReversing ? 10 : (showSecondPhase ? 10 : 5))
          }}
        >
          <BrandPass 
            buttonText="Follow"
            showButton={true}
            showProgressTimer={false}
            subheaderText=""
            headerText="$mileendbagel"
            backgroundColor="bg-[#5D5D3F]"
            backfaceColor="bg-[#4A4A32]"
            onButtonClick={handleFollowButtonClick}
            onClick={handleFollowButtonClick}
          />
        </motion.div>

        <motion.div 
          className="absolute bottom-0 left-0 p-8 cursor-pointer z-20 max-w-[216px]"
          initial={false}
          animate={isIdle ? { opacity: 1, y: 0 } : { 
            opacity: showSecondPhase ? 1 : 0,
            y: showSecondPhase ? 0 : 20
          }}
          transition={{ 
            duration: 0.3, 
            ease: "easeOut",
            delay: isReversing ? 0 : 0.25 
          }}
          onClick={(e) => {
            clearScreensaverTimer();
            console.log('Bottom text clicked!');
            goToScreen && goToScreen('Cart');
          }}
          style={{ 
            pointerEvents: 'auto',
            zIndex: isReversing ? 1 : 20 
          }}
        >
          <div>
            <div className="flex items-center gap-1 mb-4">
              <img src={CashAppLogo} alt="Cash App" className="w-4 h-4" />
              <p className="text-white/70 text-[14px] font-normal">
                Cash App
              </p>
            </div>
            <p className="text-white text-[20px] leading-[24px] font-normal line-clamp-3">
              {getText('followText')}
            </p>
          </div>
        </motion.div>
      </div>
    </BaseScreen>
  );
}; 