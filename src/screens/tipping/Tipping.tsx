import { BaseScreen } from '../../components/common/BaseScreen/index';
import { motion } from 'framer-motion';
import TipButton from '../../components/common/TipButton';
import { useState, useEffect, useRef } from 'react';
import { Screen } from '../../types/screen';
import { useUserType } from '../../context/UserTypeContext';
import { useSlideTransition } from '../../hooks/useSlideTransition';

interface TippingProps {
  onNext: (amount: string) => void;
  goToScreen?: (screen: Screen) => void; // Add optional prop for direct navigation
  baseAmount?: string; // Add baseAmount prop for total calculation
}

export const Tipping = ({ onNext, goToScreen, baseAmount = '0' }: TippingProps) => {
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const selectedAmountRef = useRef<string | null>(null);
  const { userType } = useUserType();
  
  // Use the slide transition hook for clean state management
  const { triggerTransition, exitAnimation, springConfig } = useSlideTransition(
    () => onNext(selectedAmountRef.current || '0')
  );

  // Force state reset when component mounts
  useEffect(() => {
    setSelectedAmount(null);
  }, []);

  // Calculate total with tip for display - only show selected tip, not hovered
  const calculateTotalWithTip = (tipAmount: string | null = null) => {
    const base = parseFloat(baseAmount);
    const tip = tipAmount ? parseFloat(tipAmount) : 0;
    return base + tip;
  };

  // Use only selected amount for preview
  const totalWithTip = calculateTotalWithTip(selectedAmount);

  // Log values for debugging
  useEffect(() => {
    console.log(`Tipping: baseAmount=${baseAmount}, selectedTip=${selectedAmount}, totalWithTip=${totalWithTip.toFixed(2)}`);
  }, [baseAmount, selectedAmount, totalWithTip]);

  const handleAmountClick = (amount: string) => {
    setSelectedAmount(amount);
    selectedAmountRef.current = amount; // Store in ref for immediate access
    triggerTransition();
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
      // Navigate to End screen with skipWelcome behavior (same as Reward screen timer completion)
      // This ensures the End screen shows "Thanks for shopping local!" instead of "Welcome to Cash App Local"
      goToScreen('End');
    } else {
      // Fallback to regular navigation with a tip amount of 0
      onNext('0');
    }
  };

  const tipAmounts = ["1", "2", "3"];

  // ===================== ENTRANCE ANIMATIONS =====================
  
  // Parent container animation for all tip buttons
  // Controls the entrance of child elements
  const containerVariants = {
    // Initial hidden state when component mounts
    hidden: { opacity: 0 },
    // Animated visible state with all children animating together
    visible: { 
      opacity: 1,
      transition: { 
        // All children animate at the same time (no stagger)
        staggerChildren: 0,
        // No delay - children animate immediately
        delayChildren: 0
      }
    }
  };

  // Individual button entrance animation
  // Applied to each tip button wrapper
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
        delay: 0 // Same delay as the buttons
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
      <div className="w-full h-full relative overflow-hidden rounded-[16px]">
        {/* Main screen container with horizontal slide animation */}
        <motion.div 
          className="w-full h-full bg-black text-white p-6 flex flex-col"
          initial={{ x: 0, opacity: 1 }}
          animate={exitAnimation}
          transition={{ 
            type: 'spring',
            ...springConfig
          }}
        >
          {/* Header Container with Total Display */}
          <motion.div 
            className="flex items-center justify-start mb-6 px-4 mt-2 h-16"
            variants={headerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Left side: Title with Total */}
            <div className="flex items-center">
              <h2 className="text-[24px] font-medium font-cash">
                Add a tip <span className="font-cash font-normal text-white/40">
                  {selectedAmount && selectedAmount !== '0' ? 'with tip' : 'total'} ${totalWithTip.toFixed(2)}
                </span>
              </h2>
            </div>
          </motion.div>
          
          {/* Tip Amount Buttons Container with staggered entrance animation */}
          <motion.div 
            className="grid grid-cols-3 gap-3 flex-1 mb-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {tipAmounts.map((amount, index) => (
              <motion.div 
                key={`container-${amount}`} 
                className="opacity-100"
                variants={buttonVariants}
                custom={index}
              >
                <TipButton
                  amount={amount}
                  onClick={() => handleAmountClick(amount)}
                  isSelected={false}
                  {...buttonEntranceAnimation}
                  color={userType === 'cash-local' ? 'green' : 'blue'}
                  mainColor={userType === 'cash-local' ? '#00B843' : 'rgba(255, 255, 255, 0.2)'}
                  disableExpand={true}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom Buttons */}
          <motion.div 
            className="grid grid-cols-2 gap-3 mt-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.3,
              delay: 0,
              ease: [0.32, 0.72, 0, 1]
            }}
          >
            {['Custom', 'No tip'].map((text) => (
              <button
                key={text}
                onClick={text === 'No tip' ? handleNoTip : handleCustomOrNoTip}
                className="py-6 rounded-[16px] text-[32px] font-medium font-cash active:bg-white/20 transition-colors"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.12)' }}
              >
                {text}
              </button>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </BaseScreen>
  );
}; 