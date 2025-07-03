import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BaseScreen } from '../components/common/BaseScreen/index';
import { ScreensaverCard } from '../components/common/ScreensaverCard';
import CashAppLogo from '../assets/images/logos/16x16logo.png';

export const Screensaver = ({ onNext }: { onNext: () => void }) => {
  const [isExpanding, setIsExpanding] = useState(false);
  return (
    <BaseScreen onNext={onNext}>
      <div className="w-full h-full bg-black text-white flex flex-col items-center justify-between relative overflow-hidden border border-[#222]">
        {/* Card positioned in center */}
        <div 
          className="absolute w-full h-full flex justify-center items-center"
          style={{
            zIndex: 10
          }}
        >
          <ScreensaverCard 
            backgroundColor="bg-[#5D5D3F]"
            backfaceColor="bg-[#4A4A32]"
            brandName="$mileendbagel"
            subtitle="Screensaver Mode"
            startDelay={0}
            onExpandStart={() => setIsExpanding(true)}
          />
        </div>

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