import { BaseScreen } from '../../components/common/BaseScreen/index';
import { motion, AnimatePresence } from 'framer-motion';
import LocalCashIcon from '../../assets/images/Local-Cash-32px.svg';
import TipButton from '../../components/common/TipButton';
import { useState, useEffect, useRef } from 'react';
import { Screen } from '../../types/screen';

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

  return (
    <BaseScreen onNext={() => {}}>
      <div className="w-[800px] h-[500px] relative overflow-hidden rounded-[8px] border border-[#222]">
        {/* Main screen container with fade-in animation */}
        <motion.div 
          className="w-full h-full bg-black text-white p-6 flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header Container - Conditionally hide if a button is selected */}
          <AnimatePresence>
            {!selectedAmount && (
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
                  {/* Expandable button container with right-justified icon */}
                  <motion.div 
                    className="flex items-center justify-between bg-black border border-white/20 rounded-full overflow-hidden"
                    // Initial animation for entering the screen
                    initial={{ width: "56px" }}
                    // Use consistent width for both text options
                    animate={{ 
                      width: "220px",
                    }}
                    // Use custom width values with specific transition for width
                    transition={{
                      width: {
                        type: "spring",
                        stiffness: 50,
                        damping: 15,
                        mass: 1.2,
                        duration: 1.5
                      }
                    }}
                  >
                    {/* Text container with consistent 16px left padding */}
                    <div className="h-[30px] pl-4 relative overflow-hidden">
                      <div className="ml-4">
                      {/* AnimatePresence with consistent timing for both animations */}
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.div
                          key={`text-${activeText}`}
                          className="text-[18px] font-medium font-cash whitespace-nowrap"
                          initial={{ y: 30, opacity: 0 }}
                          animate={{ 
                            y: activeText === 0 ? 0 : 1, // Slight adjustment for "Get Cash Back" to close gap at bottom
                            opacity: 1
                          }}
                          exit={{ y: -30, opacity: 0 }}
                          // Consistent timing settings for both text options
                          transition={{
                            type: "spring",
                            stiffness: 120,  // Lower stiffness for slower movement
                            damping: 20,     // Consistent damping
                            mass: 1.0,       // Standard mass
                            duration: 1.0    // Same duration for both
                          }}
                        >
                          {activeText === 0 ? (
                            <>
                              <span className="text-[#1189D6] mr-1">NEW</span>
                              {textOptions[0]}
                            </>
                          ) : (
                            textOptions[1]
                          )}
                        </motion.div>
                      </AnimatePresence>
                      </div>
                    </div>
                    
                    {/* Local Cash icon - tightened spacing */}
                    <div className="py-4 pr-4 flex-shrink-0">
                      <img src={LocalCashIcon} alt="Local Cash" className="w-8 h-8" />
                    </div>
                  </motion.div>
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
                  ${selectedAmount && selectedAmount !== amount ? 'invisible pointer-events-none' : 'opacity-100'}
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
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom Buttons - Only show when no tip is selected */}
          <AnimatePresence>
            {!selectedAmount && (
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