import { BaseScreen } from '../components/common/BaseScreen/index';
import { BrandPass } from '../components/common/BrandPass';
import { AnimatedQRCode } from '../components/common/AnimatedQRCode';
import { ToggleButton } from '../components/ui/ToggleButton';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import CashAppLogo from '../assets/images/logos/16x16logo.png';
import QRIcon from '../assets/images/24/qr.svg';
import SMSIcon from '../assets/images/24/comm-sms.svg';

interface FollowProps {
  onNext: () => void;
  onClose?: () => void;
  isOverlay?: boolean;
  goToScreen?: (screen: Screen) => void;
}

type Screen = 'Home' | 'Follow' | 'Screensaver' | 'ScreensaverExit' | 'Cart' | 'Payment' | 'Auth' | 'Tipping' | 'End' | 'CustomTip';

type BackMode = 'qr' | 'phone';

export const Follow = ({ onNext, onClose, isOverlay = false, goToScreen }: FollowProps) => {
  const [backMode, setBackMode] = useState<BackMode>('qr');
  const [isFlipped, setIsFlipped] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [showNavigation, setShowNavigation] = useState(false); // Start hidden
  const [showExitText, setShowExitText] = useState(false);

  // Trigger the flip animation and navigation fade-in when the component mounts
  useEffect(() => {
    // Small delay to let the component mount, then flip to back
    const flipTimer = setTimeout(() => {
      setIsFlipped(true);
    }, 100);
    
    // Fade in navigation controls after a short delay
    const navTimer = setTimeout(() => {
      setShowNavigation(true);
    }, 300); // Fade in navigation after card starts flipping
    
    return () => {
      clearTimeout(flipTimer);
      clearTimeout(navTimer);
    };
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    
    // Start the exit animation sequence
    // 1. Fade out navigation
    setShowNavigation(false);
    
    // 2. Flip card back to front after a short delay
    setTimeout(() => {
      setIsFlipped(false);
    }, 150);
    
    // 3. Change text after navigation fades and card starts flipping
    setTimeout(() => {
      setShowExitText(true);
    }, 250); // Delay text change slightly after navigation fade and card flip start
    
    // 4. Navigate to home after card flip animation completes
    setTimeout(() => {
      if (onClose) {
        onClose();
      } else if (goToScreen) {
        goToScreen('Home'); // Navigate directly to Home screen
      } else {
        onNext(); // Fallback to onNext if neither onClose nor goToScreen are provided
      }
    }, 1200); // Total animation time: 150ms delay + 1050ms for card flip to complete
  };



  // Custom back content based on the current mode
  const getBackContent = () => {
    if (backMode === 'qr') {
      // QR Code view - custom content without text
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8">
          {/* QR code container */}
          <div 
            className="relative overflow-hidden"
            style={{ maxHeight: '300px' }}
          >
            <AnimatedQRCode
              value={`https://chrisk.ngrok.app/landing/follow-session`}
              size={260}
              animateIn="sequential"
              disableAnimation={false}
              speed={100.0}
              darkColor="#FFFFFF"
              lightColor="transparent"
              placeholderOpacity={1.0}
              logo="cash-icon"
              className="max-h-[260px] overflow-hidden"
              onAnimationComplete={() => {
                console.log("QR animation complete");
              }}
            />
          </div>
        </div>
      );
    } else {
      // Phone input view - empty for now
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-white">
          {/* Empty placeholder */}
        </div>
      );
    }
  };

  return (
    <BaseScreen onNext={onNext}>
      <div className="w-full h-full bg-black text-white flex flex-col items-center justify-between relative overflow-hidden">
        
        {/* Bottom left message */}
        <div className="absolute bottom-0 left-0 p-8">
          <div>
            <div className="flex items-center gap-1 mb-4">
              <img src={CashAppLogo} alt="Cash App" className="w-4 h-4" />
              <p className="text-white/70 text-[14px] font-normal">
                Cash App
              </p>
            </div>
            <p className="text-white text-[20px] leading-[24px] font-normal">
              {showExitText ? (
                <>Follow us on<br/>Cash App and<br/>earn rewards</>
              ) : (
                <>Scan or text<br/>to follow and<br/>earn rewards</>
              )}
            </p>
          </div>
        </div>

        {/* Center - Flipped BrandPass card */}
        <div className="flex-1 flex items-center justify-center">
          <BrandPass 
            flipped={isFlipped}
            buttonText="Follow"
            showButton={true}
            showProgressTimer={false}
            subheaderText=""
            headerText="$mileendbagel"
            backgroundColor="bg-[#5D5D3F]"
            backfaceColor="bg-[#4A4A32]"
            backContent={getBackContent()}
            sessionId="follow-session"
            onClick={() => {}} // Disable card clicking - do nothing when clicked
          />
        </div>

        {/* Right side controls */}
        <motion.div 
          className="absolute right-0 top-0 h-full flex flex-col justify-center items-center p-8 z-10"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: showNavigation ? 1 : 0 
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Unified Toggle Button */}
          <ToggleButton
            selectedIndex={backMode === 'qr' ? 0 : 1}
            onToggle={(index) => setBackMode(index === 0 ? 'qr' : 'phone')}
            icons={[
              // QR icon (index 0)
              <img src={QRIcon} alt="QR Code" className="w-6 h-6 block" />,
              // SMS icon (index 1)
              <img src={SMSIcon} alt="SMS" className="w-6 h-6 block" />
            ]}
          />

          {/* Close button positioned at bottom */}
          <motion.button
            onClick={handleClose}
            className="w-16 h-16 rounded-full bg-black border border-white/20 flex items-center justify-center absolute bottom-8"
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
        </motion.div>

      </div>
    </BaseScreen>
  );
}; 