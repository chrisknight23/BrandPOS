import { BaseScreen } from '../../components/common/BaseScreen/index';
import { motion, AnimatePresence } from 'framer-motion';
import TipButton from '../../components/common/TipButton';
import { useState, useEffect, useRef } from 'react';
import { Screen } from '../../types/screen';
import { useUserType } from '../../context/UserTypeContext';
import AnimatedLocalCashButton from '../../components/common/AnimatedLocalCashButton';

interface TippingProps {
  onNext: (amount: string) => void;
  goToScreen?: (screen: Screen) => void; // Add optional prop for direct navigation
}

export const Tipping = ({ onNext, goToScreen }: TippingProps) => {
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [activeText, setActiveText] = useState(0); // 0 for "Give a Tip", 1 for "Local Cash"
  const navigationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textChangeInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const { userType } = useUserType();

  // Text options to cycle through - using simple strings now
  const textOptions = ["Give a Tip", "Earn Local Cash"];

  // Force state reset when component mounts and cleanup on unmount
  useEffect(() => {
    // Reset state explicitly when component mounts
    setSelectedAmount(null);
    setIsExiting(false);
    
    // Start text animation cycle
    let fadeTimeout: ReturnType<typeof setTimeout> | null = null;
    
    textChangeInterval.current = setInterval(() => {
      // First fade out
      // setTextFade(true);
      
      // After fade out, change text and fade back in
      setTimeout(() => {
        setActiveText(prev => (prev === 0 ? 1 : 0));
        // setTextFade(false);
      }, 300); // Time to fade out
      
    }, 3000); // Switch every 3 seconds
    
    // Cleanup function when navigating away
    return () => {
      // Cancel any pending navigation timeouts
      if (navigationTimer.current) {
        clearTimeout(navigationTimer.current);
        navigationTimer.current = null;
      }
      
      // Clear text animation interval
      if (textChangeInterval.current) {
        clearInterval(textChangeInterval.current);
        textChangeInterval.current = null;
      }
      
      // Clear fade timeout
      if (fadeTimeout) {
        clearTimeout(fadeTimeout);
        fadeTimeout = null;
      }
      
      // Reset state immediately when unmounting to avoid flickering
      setSelectedAmount(null);
    };
  }, []);

  const handleAmountClick = (amount: string) => {
    setSelectedAmount(amount);
  };

  // Called when the selected TipButton finishes its expand animation
  const handleSelectedAnimationComplete = () => {
    if (selectedAmount) {
      onNext(selectedAmount);
    }
  };

  const handleCustomOrNoTip = () => {
    // Navigate to custom tip screen instead of setting amount to 0
    if (goToScreen) {
      goToScreen('CustomTip');
    } else {
      // Fallback if direct navigation isn't available
      setSelectedAmount('0');
    }
  };
  
  // New handler specifically for "No tip" button
  const handleNoTip = () => {
    if (goToScreen) {
      // If goToScreen is provided, navigate directly to End
      goToScreen('End');
    } else {
      // Fallback to regular navigation with a tip amount of 0
      onNext('0');
    }
  };

  const tipAmounts = ["1", "2", "3"];

  // ===================== ENTRANCE ANIMATIONS =====================
  
  // Parent container animation for all tip buttons
  // Controls the staggered entrance of child elements
  const containerVariants = {
    // Initial hidden state when component mounts
    hidden: { opacity: 0 },
    // Animated visible state with staggered children
    visible: { 
      opacity: 1,
      transition: { 
        // Each child animates with a 0.1s delay after the previous one
        staggerChildren: 0.03,
        // Delay all children entrance by 0.2s after parent starts
        delayChildren: 0.2
      }
    }
  };

  // Individual button entrance animation
  // Applied to each TipButton wrapper
  const buttonVariants = {
    // Initial hidden state: smaller scale, offset position, and transparent
    hidden: { 
      scale: 0.8, 
      opacity: 0,
      y: 10
    },
    // Final visible state: natural scale, position, and fully visible
    visible: { 
      scale: 1, 
      opacity: 1,
      y: 0,
      // Spring animation for natural bouncy entrance
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        mass: 1,
        // Make sure opacity completes with the scaling to avoid flickering
        opacity: { duration: 0.4 }
      }
    }
  };

  // Header fade animation - just opacity with same timing as buttons
  const headerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.3,
        delay: 0.2 // Same delay as the buttons
      }
    },
    exit: { opacity: 0 }
  };

  // Button-specific entrance animation that can be passed to TipButton
  const buttonEntranceAnimation = {
    initial: { opacity: 0, scale: 0.9, y: 5 },
    animate: { opacity: 1, scale: 1, y: 0 },
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
      mass: 1,
      duration: 0.4,
      opacity: { duration: 0.3 }
    }
  };

  const iconColor = userType === 'cash-local' ? '#00B843' : 'white';

  return (
    <BaseScreen onNext={() => {}}>
      <div className="w-[800px] h-[500px] relative overflow-hidden rounded-[16px] border border-[#222]">
        {/* Main screen container with fade-in animation */}
        <motion.div 
          className="w-full h-full bg-black text-white p-6 flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header Container - Conditionally hide if a button is selected, except for cash-local */}
          <AnimatePresence>
            {(!selectedAmount || userType === 'cash-local') && (
              <motion.div 
                className="flex items-center justify-between mb-6 px-4 mt-2 h-16"
                // Use the same animation timing as the buttons, but only fade
                variants={headerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Left side: Avatar and Title */}
                <div className="flex items-center gap-3">
                  {/* Avatar placeholder */}
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-white/15" />
                  {/* "Tip Alice?" title */}
                  <h2 className="text-[24px] font-medium font-cash">Tip Alice?</h2>
                </div>

                {/* Right side: Local Cash Button */}
                <div className="relative">
                  <AnimatedLocalCashButton
                    staticText={userType === 'returning' || userType === 'cash-local'}
                    texts={userType === 'returning' ? ["Local Cash"] : userType === 'cash-local' ? [
                      <span style={{ color: '#fff' }}>Local Cash</span>
                    ] : ["Give a Tip", "Earn Local Cash"]}
                    icon={
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g>
                          <circle cx="16" cy="16" r="14.7" stroke={iconColor} strokeWidth="2.6" />
                          <path fillRule="evenodd" clipRule="evenodd" d="M22.2766 11.6901L20.7048 12.9751C20.562 13.0919 20.3673 13.0659 20.2635 12.9232C19.4588 11.9367 18.2114 11.3786 16.8486 11.3786C15.3287 11.3786 14.3812 12.0406 14.3812 12.9751C14.3552 13.7538 15.0951 14.1692 17.3678 14.6624C20.2375 15.2724 21.5485 16.4665 21.5485 18.4784C21.5485 20.9964 19.4964 22.8524 16.2892 23.0601L15.9777 24.5527C15.9517 24.6955 15.8219 24.7993 15.6662 24.7993H13.1988C12.9911 24.7993 12.8483 24.6047 12.8873 24.41L13.2767 22.7486C11.6919 22.2943 10.4069 21.4117 9.66707 20.3344C9.57621 20.1916 9.60217 20.0099 9.73197 19.9061L11.4466 18.5692C11.5893 18.4524 11.797 18.4913 11.9008 18.6341C12.8094 19.9061 14.2125 20.6589 15.9011 20.6589C17.421 20.6589 18.5632 19.9191 18.5632 18.8548C18.5632 18.0371 17.9921 17.6607 16.0569 17.2583C12.7588 16.5444 11.4466 15.3244 11.4466 13.3125C11.4466 10.9762 13.4077 9.22401 16.3684 8.99038L16.6928 7.44583C16.7188 7.30305 16.8486 7.19922 17.0044 7.19922H19.4328C19.6275 7.19922 19.7833 7.38093 19.7443 7.57562L19.3679 9.30189C20.6399 9.69127 21.6795 10.3922 22.3285 11.2618C22.4324 11.3916 22.4064 11.5863 22.2766 11.6901Z" fill={iconColor} />
                        </g>
                      </svg>
                    }
                    userType={userType}
                    suffix={userType === 'cash-local' ? (
                      <span style={{ color: iconColor, fontWeight: 400 }}>On</span>
                    ) : undefined}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Tip Amount Buttons Container with staggered entrance animation */}
          <motion.div 
            className="grid grid-cols-3 gap-3 flex-1 mb-3"
            // Apply the container variants to orchestrate child animations
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {tipAmounts.map((amount, index) => (
              <motion.div 
                key={`container-${amount}`} 
                className={`
                  transition-opacity duration-300
                  ${userType !== 'cash-local' && selectedAmount && selectedAmount !== amount ? 'invisible pointer-events-none' : 'opacity-100'}
                `}
                // Apply button entrance animation from variants
                // Each button will animate in sequence based on index
                variants={buttonVariants}
                custom={index}
              >
                <TipButton
                  amount={amount}
                  onClick={() => handleAmountClick(amount)}
                  isSelected={selectedAmount === amount && !isExiting}
                  // Only pass the animation complete callback to the selected button
                  onAnimationComplete={selectedAmount === amount ? handleSelectedAnimationComplete : undefined}
                  {...buttonEntranceAnimation}
                  color={userType === 'cash-local' ? 'green' : 'blue'}
                  mainColor={userType === 'cash-local' ? undefined : '#1A1A1A'}
                  disableExpand={userType === 'cash-local'}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom Buttons - Only show when no tip is selected, except for cash-local */}
          <AnimatePresence>
            {(!selectedAmount || userType === 'cash-local') && (
              <motion.div 
                className="grid grid-cols-2 gap-3 mt-auto"
                // Slide up from bottom with fade in
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                // Fade out when exiting
                exit={{ opacity: 0 }}
                // Slightly delayed entrance for sequencing
                transition={{ 
                  duration: 0.3,
                  delay: 0.2,
                  ease: [0.32, 0.72, 0, 1]
                }}
              >
                {['Custom', 'No tip'].map((text) => (
                  <button
                    key={text}
                    onClick={text === 'No tip' ? handleNoTip : handleCustomOrNoTip}
                    className="py-6 bg-white/15 rounded-[12px] text-[32px] font-medium font-cash active:bg-white/20 transition-colors"
                  >
                    {text}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </BaseScreen>
  );
}; 