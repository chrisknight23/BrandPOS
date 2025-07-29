import { BaseScreen } from '../../components/common/BaseScreen';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSlideTransition } from '../../hooks/useSlideTransition';
import { BrandPass } from '../../components/common/BrandPass';
import { Screen } from '../../types/screen';
import { useTextContent } from '../../context/TextContentContext';

interface RewardScannedProps {
  onNext: () => void;
  goToScreen?: (screen: Screen) => void;
}

export const RewardScanned = ({ onNext, goToScreen }: RewardScannedProps) => {
  const { getText } = useTextContent();
  const { enterAnimation, springConfig } = useSlideTransition(onNext);
  const [isExiting, setIsExiting] = useState(false);

  return (
    <BaseScreen>
      <div 
        className="w-full h-full bg-black text-white flex flex-col items-center justify-between relative overflow-hidden"
      >
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
          {/* Content will go here */}
          <h1 
            className="text-[110px] font-cash font-medium text-center leading-[0.85] tracking-[-0.02em]"
            dangerouslySetInnerHTML={{ __html: getText('rewardScannedText') }}
          />
        </motion.div>
      </div>
    </BaseScreen>
  );
}; 