import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BaseScreen } from '../components/common/BaseScreen/index';
import { ScreensaverCard } from '../components/common/ScreensaverCard';

export const ScreensaverExit = ({ onNext }: { onNext: () => void }) => {
  const [animationPhase, setAnimationPhase] = useState<'fullscreen' | 'shrinking' | 'landed'>('fullscreen');

  // Start the shrinking animation after a brief delay
  useEffect(() => {
    const shrinkTimer = setTimeout(() => {
      setAnimationPhase('shrinking');
    }, 800); // Brief pause to show fullscreen state

    return () => clearTimeout(shrinkTimer);
  }, []);

  // Handle animation completion and navigate to Cart
  const handleAnimationComplete = () => {
    if (animationPhase === 'shrinking') {
      setAnimationPhase('landed');
      
      // DISABLED: Navigate to Cart after a brief pause to show the final state
      // const navTimer = setTimeout(() => {
      //   onNext();
      // }, 300);
      // 
      // return () => clearTimeout(navTimer);
    }
  };

  return (
    <BaseScreen onNext={onNext}>
      <div className="w-[800px] h-[500px] bg-black text-white rounded-[16px] border border-[#222] shadow-[0_8px_32px_0_rgba(0,0,0,0.18)] flex justify-end relative overflow-hidden">
        
        {/* Background Layer - Right Panel Content */}
        <div className="bg-black flex flex-col items-center justify-center mt-6 mr-6 mb-6">
          {/* Content Container with Border */}
          <div className="border border-[#333] rounded-[24px] p-5 flex flex-col items-center">
            {/* Empty space where card will land - no static card */}
            <div className="w-[161px] h-[213px] mb-6">
              {/* Empty placeholder for card landing area */}
            </div>
            
            {/* Brand Name */}
            <div className="text-white/70 text-[14px] font-medium mb-2 text-left w-full">$mileendbagel</div>
            
            {/* Description Text */}
            <div className="text-white text-left text-[20px] leading-[24px] mb-6 w-full">
              Follow us on<br/>
              Cash App and<br/>
              earn rewards
            </div>
            
            {/* Follow Button */}
            <button className="bg-white/15 text-white px-8 py-3 rounded-full text-[18px] font-medium hover:bg-white/20 transition-colors w-full">
              Follow
            </button>
          </div>
        </div>

        {/* Overlay Layer - ScreensaverCard Component */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ zIndex: 20 }}
          animate={{
            x: animationPhase === 'shrinking' || animationPhase === 'landed' ? 274 : 0, // Move to right panel position
            y: animationPhase === 'shrinking' || animationPhase === 'landed' ? -100 : 0,  // Slight vertical adjustment
            scale: animationPhase === 'shrinking' || animationPhase === 'landed' ? 0.45 : 1, // Scale down to fit right panel
          }}
          transition={{
            duration: 0.8,
            ease: [0.32, 0.72, 0, 1],
            delay: animationPhase === 'shrinking' ? 0 : 0
          }}
          onAnimationComplete={handleAnimationComplete}
        >
          <ScreensaverCard 
            backgroundColor="bg-[#5D5D3F]"
            backfaceColor="bg-[#4A4A32]"
            brandName="$mileendbagel"
            subtitle="Screensaver Mode"
            initialPhase="fullscreen"     // Start in fullscreen state with messaging
            targetPhase={animationPhase === 'shrinking' || animationPhase === 'landed' ? 'normal' : 'fullscreen'} // Animate to normal when shrinking
            autoStart={false}            // Don't use automatic animation sequence
            startDelay={50}              // Start flipping almost immediately
            onExpandStart={() => {}}
            showFrontContent={false}     // Hide header and button, show only logo
          />
        </motion.div>
      </div>
    </BaseScreen>
  );
}; 