import { BaseScreen } from '../components/common/BaseScreen/index';
import { BrandPass } from '../components/common/BrandPass';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import CashAppLogo from '../assets/images/logos/16x16logo.png';
import { useTextContent } from '../context/TextContentContext';

interface HomeProps {
  onNext: () => void;
  isIdle?: boolean; // New prop to control starting vs idle state
  goToScreen?: (screen: Screen) => void;
}

type Screen = 'Home' | 'Follow' | 'Screensaver' | 'ScreensaverExit' | 'Cart' | 'Payment' | 'Auth' | 'Tipping' | 'End' | 'CustomTip';

export const Home = ({ onNext, isIdle = false, goToScreen }: HomeProps) => {
  const { getText } = useTextContent();
  const [showAnimations, setShowAnimations] = useState(isIdle);
  const [showSecondPhase, setShowSecondPhase] = useState(isIdle);
  const [startTextPushBack, setStartTextPushBack] = useState(isIdle);

  const handleFollowButtonClick = () => {
    if (goToScreen) {
      goToScreen('Follow');
    } else {
      onNext(); // Fallback to onNext if goToScreen not available
    }
  };

  useEffect(() => {
    // Only run animations if not in idle mode
    if (!isIdle) {
      // Start all animations after a short delay when component mounts
      const initialTimer = setTimeout(() => {
        setShowAnimations(true);
        
        // Start text push back animation slightly before card animation
        const textPushBackTimer = setTimeout(() => {
          setStartTextPushBack(true);
        }, 2960); // Start text animation 0.5s before card
        
        // Start second phase animations after the first phase completes
        const secondPhaseTimer = setTimeout(() => {
          setShowSecondPhase(true);
        }, 3000); // 3 second delay before second phase animations start
        
        return () => {
          clearTimeout(textPushBackTimer);
          clearTimeout(secondPhaseTimer);
        };
      }, 500); // Delay before starting all animations
      
      return () => clearTimeout(initialTimer);
    }
  }, [isIdle]);

  return (
    <BaseScreen onNext={onNext}>
      <div className="w-full h-full bg-black text-white flex flex-col items-center justify-between relative overflow-hidden">
        <motion.div 
          className="flex-1 flex flex-col items-center justify-center w-full"
          animate={isIdle ? {} : { 
            opacity: startTextPushBack ? 0 : 1,
            scale: startTextPushBack ? 0.8 : 1,
            z: startTextPushBack ? 1 : 10
          }}
          transition={isIdle ? {} : { duration: 0.3, ease: "easeOut" }}
          style={{
            zIndex: isIdle ? 1 : (startTextPushBack ? 1 : 10),
            opacity: isIdle ? 0 : undefined,
            scale: isIdle ? 0.8 : undefined
          }}
        >
          <motion.h1 
            className="text-[90px] font-cash font-medium text-center leading-[0.85] tracking-[-0.02em]"
            initial={isIdle ? {} : { opacity: 0 }}
            animate={isIdle ? {} : { opacity: showAnimations ? 1 : 0 }}
            transition={isIdle ? {} : { duration: 0.8, ease: "easeOut" }}
            style={{ opacity: isIdle ? 0 : undefined }}
            dangerouslySetInnerHTML={{ __html: getText('introText') }}
          />
          <motion.p 
            className="text-[22px] text-white mt-4"
            initial={isIdle ? {} : { opacity: 0 }}
            animate={isIdle ? {} : { opacity: showAnimations ? 0.5 : 0 }}
            transition={isIdle ? {} : { duration: 0.8, ease: "easeOut" }}
            style={{ opacity: isIdle ? 0 : undefined }}
          >
            $mileendbagel on Cash App
          </motion.p>
          
        </motion.div>
        
        <motion.div 
          className="absolute w-full h-full flex justify-center items-center"
          initial={isIdle ? { y: 0 } : { y: 500 }}
          animate={isIdle ? { y: 0 } : { 
            y: showSecondPhase ? 
              0 : 
              (showAnimations ? 
                420 : 
                500)
          }}
          transition={isIdle ? {} : {
            type: "spring",
            stiffness: 120,
            damping: 18,
            mass: 1.2,
            restDelta: 0.001
          }}
          style={{
            zIndex: isIdle ? 10 : (showSecondPhase ? 10 : 5)
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

        {/* Bottom left message that fades in when card slides up */}
        <motion.div 
          className="absolute bottom-0 left-0 p-8 cursor-pointer z-20"
          initial={isIdle ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          animate={isIdle ? { opacity: 1, y: 0 } : { 
            opacity: showSecondPhase ? 1 : 0,
            y: showSecondPhase ? 0 : 20
          }}
          transition={isIdle ? {} : { duration: 0.3, ease: "easeOut", delay: 0.25 }}
          onClick={() => {
            console.log('Bottom text clicked!');
            goToScreen && goToScreen('Cart');
          }}
          style={{ pointerEvents: 'auto' }}
        >
          <div>
            <div className="flex items-center gap-1 mb-4">
              <img src={CashAppLogo} alt="Cash App" className="w-4 h-4" />
              <p className="text-white/70 text-[14px] font-normal">
                Cash App
              </p>
            </div>
            <p className="text-white text-[20px] leading-[24px] font-normal">
              {getText('followText')}
            </p>
          </div>
        </motion.div>
      </div>
    </BaseScreen>
  );
}; 