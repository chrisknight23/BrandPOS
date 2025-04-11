import { BaseScreen } from '../../components/common/BaseScreen/index';
import { motion, AnimatePresence } from 'framer-motion';
import LocalCashIcon from '../../assets/images/Local-Cash-32px.svg';
import TipButton from '../../components/common/TipButton';
import { useState, useEffect } from 'react';
import { Screen } from '../../types/screen';

interface TippingProps {
  onNext: (amount: string) => void;
  goToScreen?: (screen: Screen) => void; // Add optional prop for direct navigation
}

export const Tipping = ({ onNext, goToScreen }: TippingProps) => {
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  // Cleanup function when navigating away
  useEffect(() => {
    return () => {
      // Reset state when component unmounts
      setSelectedAmount(null);
      setIsExiting(false);
    };
  }, []);

  const handleAmountClick = (amount: string) => {
    setSelectedAmount(amount);
    
    // Add a slight delay before navigating to the next screen
    // This gives the Lottie animation time to display its first frame
    setTimeout(() => {
      onNext(amount);
    }, 500);
  };

  const handleCustomOrNoTip = () => {
    setSelectedAmount('0');
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
      scale: 0.9, 
      opacity: 0,
      // Ensure stable position during animation
      y: 0
    },
    // Final visible state: natural scale, position, and fully visible
    visible: { 
      scale: 1, 
      opacity: 1,
      y: 0,
      // Spring animation for natural bouncy entrance
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        // Make sure opacity completes with the scaling to avoid flickering
        opacity: { duration: 0.3 }
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
    initial: { backgroundColor: '#1189D6', scale: 0.97, opacity: 0 },
    animate: { scale: 1, opacity: 1 }, // Remove backgroundColor to let TipButton handle it
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      mass: 1,
      // Ensure consistent timing for layout and content
      layout: true,
      duration: 0.35,
      // Make opacity match the scaling animation
      opacity: { duration: 0.3 }
    }
  };

  return (
    <BaseScreen onNext={() => {}}>
      <div className="w-[800px] h-[500px] relative overflow-hidden rounded-[4px] border border-white/20">
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
                  {/* Expandable button container - width animation */}
                  <motion.div 
                    className="flex items-center bg-black border border-white/20 rounded-full overflow-hidden"
                    // Start as just an icon button width
                    initial={{ width: "56px" }}
                    // Expand to show text
                    animate={{ width: "auto" }}
                    // Smooth expansion with delay
                    transition={{
                      duration: 0.5,
                      delay: 0.4,
                      ease: [0.32, 0.72, 0, 1]
                    }}
                  >
                    {/* "Local Cash" text - slides in from right with fade */}
                    <motion.span 
                      className="text-[18px] font-medium font-cash whitespace-nowrap pl-6"
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.5,
                        ease: [0.32, 0.72, 0, 1]
                      }}
                    >
                      Local Cash
                    </motion.span>
                    {/* Local Cash icon - stays fixed in position */}
                    <div className="py-4 pr-4 ml-2">
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
                  ${selectedAmount && selectedAmount !== amount ? 'opacity-0 pointer-events-none' : 'opacity-100'}
                `}
                // Apply button entrance animation from variants
                // Each button will animate in sequence based on index
                variants={buttonVariants}
                custom={index}
              >
                <TipButton
                  amount={amount}
                  // layoutId enables the shared element transition when selected
                  layoutId={`tip-amount-${amount}`}
                  onClick={() => handleAmountClick(amount)}
                  isSelected={selectedAmount === amount && !isExiting}
                  // Apply additional entrance animation directly to the button
                  // This helps create a more stable animation
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