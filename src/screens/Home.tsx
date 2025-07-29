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
  fromEndScreen?: boolean;
}

const SCREENSAVER_DELAY = 20000; // 20 seconds

export const Home = ({ onNext, isIdle = false, goToScreen, shouldReverseAnimate = false, fromEndScreen = false }: HomeProps) => {
  const { getText } = useTextContent();
  const [showAnimations, setShowAnimations] = useState(isIdle);
  const [showSecondPhase, setShowSecondPhase] = useState(isIdle);
  const [startTextPushBack, setStartTextPushBack] = useState(isIdle);
  const [isReversing, setIsReversing] = useState(false);
  const screensaverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true); // Track if component is mounted

  // Clear timer and mounted state on unmount
  useEffect(() => {
    isMountedRef.current = true;
    console.log('Home: Mounted');
    
    return () => {
      console.log('Home: Unmounting, clearing timer');
      isMountedRef.current = false;
      if (screensaverTimerRef.current) {
        clearTimeout(screensaverTimerRef.current);
        screensaverTimerRef.current = null;
      }
    };
  }, []);

  // Modified timer start function
  const startScreensaverTimer = useCallback(() => {
    console.log('Home: Starting screensaver timer');
    // Clear any existing timer first
    if (screensaverTimerRef.current) {
      clearTimeout(screensaverTimerRef.current);
      screensaverTimerRef.current = null;
    }
    
    // Start timer regardless of state - we want it to work on navigation back
    screensaverTimerRef.current = setTimeout(() => {
      // Only navigate to screensaver if we're still mounted
      if (isMountedRef.current && goToScreen) {
        console.log('Home: Timeout reached, activating screensaver');
        goToScreen('Screensaver');
      }
    }, SCREENSAVER_DELAY);
  }, [goToScreen]);

  // Start timer on mount and when returning to Home
  useEffect(() => {
    if (isMountedRef.current) {
      console.log('Home: Component mounted or updated, starting timer');
      startScreensaverTimer();
    }
  }, [startScreensaverTimer]);

  // Handle user interactions
  const handleUserInteraction = useCallback(() => {
    console.log('Home: User interaction detected, restarting timer');
    startScreensaverTimer();
  }, [startScreensaverTimer]);

  // Handle reverse animation sequence
  useEffect(() => {
    if (shouldReverseAnimate && !isReversing) {
      if (screensaverTimerRef.current) {
        clearTimeout(screensaverTimerRef.current);
        screensaverTimerRef.current = null;
      }
      setIsReversing(true);
      setShowSecondPhase(false);
      setStartTextPushBack(false);
      // Start timer after reverse animation
      startScreensaverTimer();
    }
  }, [shouldReverseAnimate, isReversing, startScreensaverTimer]);

  // Handle initial animation sequence
  useEffect(() => {
    if (!isIdle && !isReversing && !shouldReverseAnimate) {
      const initialTimer = setTimeout(() => {
        setShowAnimations(true);  // PHASE 1: Triggers card to peek up from bottom
        
        const textPushBackTimer = setTimeout(() => {
          setStartTextPushBack(true);  // PHASE 2: Starts fading out the text
        }, 2960);  // PEEK DURATION: How long card stays in peek position (in milliseconds)
        
        const secondPhaseTimer = setTimeout(() => {
          setShowSecondPhase(true);  // PHASE 3: Moves card from peek to center
          // Start timer after initial animation
          startScreensaverTimer();
        }, 3000);  // TOTAL ANIMATION TIME: Should be slightly longer than peek duration
        
        return () => {
          clearTimeout(textPushBackTimer);
          clearTimeout(secondPhaseTimer);
        };
      }, 0);  // INITIAL DELAY: How long to wait before starting the peek
      
      return () => {
        clearTimeout(initialTimer);
      };
    }
  }, [isIdle, isReversing, shouldReverseAnimate, startScreensaverTimer]);

  const handleFollowButtonClick = () => {
    if (screensaverTimerRef.current) {
      clearTimeout(screensaverTimerRef.current);
      screensaverTimerRef.current = null;
    }
    if (goToScreen) {
      goToScreen('Follow');
    } else {
      onNext();
    }
  };

  return (
    <BaseScreen onNext={onNext}>
      <div 
        className="w-full h-full bg-black text-white flex flex-col items-center justify-between relative overflow-hidden"
        onClick={handleUserInteraction}
        onTouchStart={handleUserInteraction}
        role="presentation"
      >
        <motion.div 
          className="flex-1 flex flex-col items-center justify-center w-full px-8"
          initial={{ opacity: 0 }}  // Start fully transparent
          animate={isIdle ? {} : { 
            opacity: startTextPushBack ? 0 : 1
          }}
          transition={{ 
            duration: startTextPushBack ? 0.2 : 1,  // Quick fade-out (0.2s) when card moves to center, normal fade-in (1s)
            ease: "linear"  // Simple linear fade
          }}
          style={{
            zIndex: isIdle ? 1 : (isReversing ? 1 : (startTextPushBack ? 1 : 10)),
            opacity: isIdle ? 0 : undefined
          }}
        >
          {/* INTRO TEXT ANIMATION: Main heading fade-in */}
          <motion.div 
            className="w-full"
            initial={{ opacity: 0 }}  // Start invisible
            animate={{ opacity: showAnimations ? 1 : 0 }}  // Fade in when showAnimations is true
            transition={{ 
              duration: 1,  // FADE DURATION: 1 second fade
              ease: "linear"  // EASING: Simple linear fade for more natural opacity change
            }}
          >
            <h1 
              className="text-[90px] font-cash font-medium text-center leading-[0.85] tracking-[-0.02em]"
              dangerouslySetInnerHTML={{ 
                __html: getText('introText')
              }}
            />
          </motion.div>

          {/* INTRO TEXT ANIMATION: Subtitle fade-in */}
          <motion.p 
            className="text-[22px] text-white mt-4"
            initial={{ opacity: 0 }}  // Start invisible
            animate={{ opacity: showAnimations ? 0.5 : 0 }}  // Fade in to 50% opacity
            transition={{ 
              duration: 1,  // FADE DURATION: Match main text
              ease: "linear"  // EASING: Match main text fade
            }}
          >
            $mileendbagel on Cash App
          </motion.p>
        </motion.div>
        
        <div className="absolute w-full h-full overflow-hidden">
          <motion.div 
            className="absolute w-full h-full flex justify-center items-center"
            initial={false}
            animate={isIdle ? { y: 0 } : { 
              y: showSecondPhase ? 
                0 : // FINAL POSITION: Card centered in frame
                (showAnimations ? 
                  420 :  // PEEK HEIGHT: Higher number = lower peek (try 380-460)
                  '120vh')  // HIDDEN POSITION: Keeps card below frame initially
            }}
            transition={{
              type: "spring",
              stiffness: 100,     // SPEED: Lower = slower movement (40-220 range, peek-to-center speed)
              damping: 18,       // BOUNCE: Higher = less bounce when card settles
              mass: 1.2,         // WEIGHT: Higher = more gradual, weighty movement
              restDelta: 0.001   // Precision of final position
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
        </div>

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
            if (screensaverTimerRef.current) {
              clearTimeout(screensaverTimerRef.current);
              screensaverTimerRef.current = null;
            }
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