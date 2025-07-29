import { BaseScreen } from '../../components/common/BaseScreen';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSlideTransition } from '../../hooks/useSlideTransition';
import { BrandPass } from '../../components/common/BrandPass';
import { Screen } from '../../types/screen';
import { useTextContent } from '../../context/TextContentContext';
import LocalCashLogo from '../../assets/images/14/Local-Cash.svg';
import SkippedIcon from '../../assets/images/32/32/skipped.svg';

interface RewardScannedProps {
  onNext: () => void;
  goToScreen?: (screen: Screen) => void;
}

export const RewardScanned = ({ onNext, goToScreen }: RewardScannedProps) => {
  const { getText } = useTextContent();
  const { enterAnimation, springConfig } = useSlideTransition(onNext);
  const [isExiting, setIsExiting] = useState(false);

  const handleTimerComplete = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (goToScreen) {
        goToScreen('End');
      } else {
        onNext();
      }
    }, 400);
  };

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
          {/* BrandPass card that's already flipped showing QR code */}
          <motion.div 
            className="absolute w-full h-full flex justify-center items-center"
            style={{
              zIndex: 20,
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
              showProgressTimer={true}
              disableAnimation={true}
              noAnimation={true}
              showAnimatedNumber={true}
              initialValue={1}
              flipped={true}
              onTimerComplete={handleTimerComplete}
            />
          </motion.div>

          {/* Bottom left message */}
          <motion.div 
            className="absolute bottom-0 left-0 p-8 max-w-[216px]"
            initial={{ opacity: 1, y: 0 }}
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
                  dangerouslySetInnerHTML={{ __html: getText('scanToClaim') }}
                />
              </div>
            </div>
          </motion.div>

          {/* Skip button positioned at bottom right */}
          <motion.button
            onClick={handleTimerComplete}
            className="absolute bottom-8 right-8 w-16 h-16 rounded-full bg-black border border-white/20 flex items-center justify-center"
            initial={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.95 }}
            tabIndex={0}
            aria-label="Skip and return to home"
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