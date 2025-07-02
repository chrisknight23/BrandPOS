import { BaseScreen } from '../components/common/BaseScreen/index';
import { BrandPass } from '../components/common/BrandPass';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import CashAppLogo from '../assets/images/logos/16x16logo.png';

export const Home = ({ onNext }: { onNext: () => void }) => {
  const [showAnimations, setShowAnimations] = useState(false);
  const [showSecondPhase, setShowSecondPhase] = useState(false);
  const [startTextPushBack, setStartTextPushBack] = useState(false);

  useEffect(() => {
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
  }, []);

  return (
    <BaseScreen onNext={onNext}>
      <div className="w-full h-full bg-black text-white flex flex-col items-center justify-between relative overflow-hidden border border-[#222]">
        <motion.div 
          className="flex-1 flex flex-col items-center justify-center w-full"
          animate={{ 
            opacity: startTextPushBack ? 0 : 1,
            scale: startTextPushBack ? 0.8 : 1,
            z: startTextPushBack ? 1 : 10
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{
            zIndex: startTextPushBack ? 1 : 10
          }}
        >
          <motion.h1 
            className="text-[90px] font-cash font-medium text-center leading-[0.85] tracking-[-0.02em]"
            initial={{ opacity: 0 }}
            animate={{ opacity: showAnimations ? 1 : 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            dangerouslySetInnerHTML={{ __html: "Follow us and<br/>earn rewards" }}
          />
          <motion.p 
            className="text-[22px] text-white mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: showAnimations ? 0.5 : 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            $mileendbagel on Cash App
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="absolute w-full h-full flex justify-center items-center"
          // Starting position (completely off-screen below the frame)
          initial={{ y: 0 }}
          animate={{ 
            // Animation positions
            y: showSecondPhase ? 
              // Center position
              0 : 
              (showAnimations ? 
                // Peeking position at bottom of frame
                420 : 
                // Initial off-screen position
                500)
          }}
          transition={{
            // Spring animation
            type: "spring",
            stiffness: 120,
            damping: 18,
            mass: 1.2,
            restDelta: 0.001
          }}
          style={{
            zIndex: showSecondPhase ? 10 : 5
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
          />
        </motion.div>

        {/* Bottom left message that fades in when card slides up */}
        <motion.div 
          className="absolute bottom-0 left-0 p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: showSecondPhase ? 1 : 0,
            y: showSecondPhase ? 0 : 20
          }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.25 }}
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