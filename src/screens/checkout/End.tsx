import { BaseScreen } from '../../components/common/BaseScreen';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Screen } from '../../types/screen';

interface EndProps {
  onNext: () => void;
  amount?: string;       // Total amount (may be pre-calculated)
  baseAmount?: string;   // Base amount from Cart/Payment
  tipAmount?: string;    // Tip amount from Tipping screen
  goToScreen?: (screen: Screen) => void; // Add prop for direct navigation
  taxRate?: number;
}

export const End = ({ onNext, amount, baseAmount = "10.80", tipAmount = "0", goToScreen, taxRate = 0.0875 }: EndProps) => {
  const [total, setTotal] = useState(amount || baseAmount);
  const [progress, setProgress] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);
  const [hasTip, setHasTip] = useState(false);
  
  // Timer constants
  const timerDuration = 12000; // 12 seconds total (increased from 10 seconds)
  const timerInterval = 50; // Update every 50ms for smooth animation
  const initialDelay = 1500; // 1.5 second delay before timer starts

  // Calculate the total (base + tip) then apply tax to that subtotal
  useEffect(() => {
    // Determine the subtotal: either amount prop (base+tip) or derive from baseAmount and tipAmount
    const subtotal = amount
      ? parseFloat(amount)
      : (parseFloat(baseAmount) + (tipAmount ? parseFloat(tipAmount) : 0));
    const tax = subtotal * taxRate;
    setTotal((subtotal + tax).toFixed(2));
    setHasTip((tipAmount ? parseFloat(tipAmount) : 0) > 0);
  }, [amount, baseAmount, tipAmount, taxRate]);
  
  // Set up timer effect with initial delay
  useEffect(() => {
    // First set a timeout for the initial delay
    const delayTimer = setTimeout(() => {
      setTimerStarted(true);
    }, initialDelay);
    
    // Clean up delay timer if component unmounts
    return () => clearTimeout(delayTimer);
  }, [initialDelay]);
  
  // Actual timer effect that starts after delay
  useEffect(() => {
    // Only start the progress timer after the initial delay
    if (!timerStarted) return;
    
    const startTime = Date.now();
    
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(elapsed / timerDuration, 1);
      setProgress(newProgress);
      
      // When timer completes, navigate to Home screen
      if (newProgress >= 1) {
        clearInterval(timer);
        // Check if we have direct navigation capability
        if (goToScreen) {
          goToScreen('Home');
        } else {
          // Fall back to regular navigation if necessary
          onNext();
        }
      }
    }, timerInterval);
    
    // Clean up on unmount
    return () => clearInterval(timer);
  }, [onNext, timerDuration, timerInterval, timerStarted, goToScreen]);

  return (
    <BaseScreen onNext={onNext}>
      <div className="w-[800px] h-[500px] bg-[#1189D6] text-white p-10 flex flex-col justify-between rounded-[8px] relative">
        <motion.div
          className="flex flex-col space-y-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-cash font-medium">
            Paid ${total} {hasTip && <span className="font-normal text-white/60">with tip</span>}
          </h2>
          
          <h1 className="text-[56px] font-cash font-semibold leading-[48px] tracking-[-0.04em]">
            Thanks for<br />
            shopping local
          </h1>
        </motion.div>
        
        <motion.div
          className="absolute bottom-[40px] right-[40px]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {/* Progress Button with layered structure */}
          <div 
            className="relative overflow-hidden rounded-[12px] w-[340px] h-[96px] cursor-pointer"
            onClick={() => {
              // Navigate to Home screen when clicked
              if (goToScreen) {
                goToScreen('Home');
              } else {
                onNext();
              }
            }}
          >
            {/* Base button background - original styling */}
            <div className="absolute inset-0 bg-black/15" />
            
            {/* Progress bar - drains from left to right */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div 
                className="absolute inset-0 bg-black/[0.10]" 
                initial={{ x: 0 }}
                animate={{ x: -progress * 100 + '%' }}
                transition={{ 
                  ease: "linear", 
                  duration: 0.05
                }}
              />
            </div>
            
            {/* Button text - stays on top */}
            <div className="relative z-10 flex items-center justify-center h-full">
              <span className="text-[32px] font-cash font-medium text-white">
                Get receipt
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </BaseScreen>
  );
}; 