import { BaseScreen } from '../../components/common/BaseScreen';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { BrandPass } from '../../components/common/BrandPass';
import { Screen } from '../../types/screen';
import { useTextContent } from '../../context/TextContentContext';
import LocalCashLogo from '../../assets/images/14/Local-Cash.svg';
import SkippedIcon from '../../assets/images/32/32/skipped.svg';
import { AnimatedQRCode } from '../../components/common/AnimatedQRCode';

interface RewardScannedProps {
  onNext: () => void;
  goToScreen?: (screen: Screen) => void;
}

export const RewardScanned = ({ onNext, goToScreen }: RewardScannedProps) => {
  const { getText } = useTextContent();
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
        <div className="flex-1 flex flex-col items-center justify-center w-full relative overflow-hidden">
          {/* BrandPass card that's already flipped showing QR code */}
          <div className="absolute w-full h-full flex justify-center items-center">
            <BrandPass
              headerText="$mileendbagel"
              subheaderText="Reward"
              buttonText="Claim"
              showProgressTimer={true}
              disableAnimation={true}
              noAnimation={true}
              showAnimatedNumber={true}
              initialValue={1}
              flipped={true}
              initialFlipped={true}
              onTimerComplete={handleTimerComplete}
              initialState="initial"
              autoPlay={false}
              backContent={
                <div className="w-full h-full flex flex-col items-center justify-center p-8">
                  <AnimatedQRCode
                    value={`https://chrisk.ngrok.app/landing/follow-session`}
                    size={260}
                    animateIn={false}
                    disableAnimation={true}
                    speed={0}
                    darkColor="#000000"
                    lightColor="#FFFFFF"
                    placeholderOpacity={1.0}
                    logo="cash-icon"
                    className="max-h-[260px] overflow-hidden"
                    visible={true}
                  />
                </div>
              }
            />
          </div>

          {/* Bottom left message */}
          <div 
            className="absolute bottom-0 left-0 p-8 max-w-[216px]"
            style={{
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
          </div>

          {/* Skip button positioned at bottom right */}
          <button
            onClick={handleTimerComplete}
            className="absolute bottom-8 right-8 w-16 h-16 rounded-full bg-black border border-white/20 flex items-center justify-center"
            tabIndex={0}
            aria-label="Skip and return to home"
            style={{
              zIndex: 20
            }}
          >
            <img src={SkippedIcon} alt="Skip" className="w-8 h-8" />
          </button>
        </div>
      </div>
    </BaseScreen>
  );
}; 