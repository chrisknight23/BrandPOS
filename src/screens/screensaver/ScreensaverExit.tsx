import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BaseScreen } from '../../components/common/BaseScreen/index';
import { ScreensaverCard } from '../../components/common/ScreensaverCard';
import { BRAND_COLORS } from '../../constants/colors';
import { useTextContent } from '../../context/TextContentContext';

export const ScreensaverExit = ({ onNext }: { onNext: () => void }) => {
  const [animationPhase, setAnimationPhase] = useState<'fullscreen' | 'shrinking' | 'landed'>('fullscreen');
  const { getText } = useTextContent();

  // Start the shrinking animation immediately
  useEffect(() => {
    setAnimationPhase('shrinking');
  }, []);

  // Handle animation completion and navigate to Cart
  const handleAnimationComplete = () => {
    if (animationPhase === 'shrinking') {
      setAnimationPhase('landed');
      
      // Navigate to Cart instantly after animation completes
      onNext();
    }
  };

  return (
    <BaseScreen onNext={onNext}>
      <div className="w-[800px] h-[500px] bg-black text-white rounded-[16px] shadow-[0_8px_32px_0_rgba(0,0,0,0.18)] flex justify-end relative overflow-hidden">
        
        {/* Right Panel - Brand Card (Same as ScreensaverExit) */}
        <div className="bg-black h-full flex flex-col py-6 pr-6">
          {/* Content Container with Border */}
          <div className="border border-[#333] rounded-[24px] flex flex-col h-full m-0 p-5" style={{ width: '201px' }}>
            {/* Empty space where card will land */}
            <div className="w-[161px] h-[213px] mb-6">
              {/* Empty placeholder for card landing area */}
            </div>
            
            {/* Brand Name */}
            <div className="text-white/70 text-[14px] font-medium mb-2 text-left w-full">$mileendbagel</div>
            
            {/* Description Text - now with flex-1 to fill available space */}
            <div 
              className="flex-1 text-white text-left text-[20px] leading-[24px] w-full line-clamp-3"
              dangerouslySetInnerHTML={{ __html: getText('rightRail') }}
            />
            
            {/* Follow Button - removed mb-6 from text above since button will be pushed to bottom */}
            <button 
              className="mt-6 bg-white/15 text-white px-8 py-3 rounded-full text-[18px] font-medium hover:bg-white/20 transition-colors w-full"
            >
              Follow
            </button>
          </div>
        </div>

        {/* Keep existing card animation code */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ zIndex: 20 }}
          initial={{
            x: 0,
            y: 0,
            scale: 1.38,
            scaleX: 1,
            rotateZ: 0
          }}
          animate={{
            x: animationPhase === 'shrinking' || animationPhase === 'landed' ? 274 : 0,
            y: animationPhase === 'shrinking' || animationPhase === 'landed' ? -100 : 0,
            scale: animationPhase === 'shrinking' || animationPhase === 'landed' ? 0.45 : 1.38,
            scaleX: 1,
            rotateZ: 0
          }}
          transition={{
            duration: 0.8,
            ease: [0.32, 0.72, 0, 1],
            delay: animationPhase === 'shrinking' ? 0 : 0
          }}
          onAnimationComplete={handleAnimationComplete}
        >
          <ScreensaverCard 
            backgroundColor={BRAND_COLORS.primary}
            brandName="$mileendbagel"
            initialPhase="fullscreen"
            targetPhase={animationPhase === 'shrinking' || animationPhase === 'landed' ? 'normal' : 'fullscreen'}
            autoStart={false}
            startDelay={0}
            onExpandStart={() => {}}
            showFrontContent={false}
            showBackContent={false}
          />
        </motion.div>
      </div>
    </BaseScreen>
  );
}; 