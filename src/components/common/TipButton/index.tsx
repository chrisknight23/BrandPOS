import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Simple utility function for formatting currency
const formatCurrency = (amount: number, showDecimals: boolean = true): string => {
  return showDecimals ? `$${amount.toFixed(2)}` : `$${amount}`;
};

type TipButtonProps = {
  amount: number | string;
  onClick: () => void;
  isSelected: boolean;
  // Animation props that can be passed from parent
  initial?: any;
  animate?: any; 
  transition?: any;
  // Optional prop to specify animation order for staggered entrance
  index?: number;
  // Whether to show percentages and decimal points
  showPercentage?: boolean;
};

export const TipButton: React.FC<TipButtonProps> = ({ 
  amount, 
  onClick, 
  isSelected,
  // Animation props
  initial,
  animate,
  transition,
  // Animation order
  index = 0,
  // Display options
  showPercentage = false
}) => {
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  
  // Convert amount to number if it's a string
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  // Pre-calculate button dimensions on initial render and window resize
  useEffect(() => {
    const updateButtonRect = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setButtonRect(rect);
      }
    };

    // Initial calculation
    updateButtonRect();

    // Update on window resize
    window.addEventListener('resize', updateButtonRect);
    
    // Update when button is selected
    if (isSelected) {
      updateButtonRect();
    }

    return () => {
      window.removeEventListener('resize', updateButtonRect);
    };
  }, [isSelected]);

  // Calculate the initial style for the expanded state based on the button's original position
  const getExpandedInitialStyle = () => {
    if (!buttonRect) return {};
    
    // Get button's offset relative to the device frame
    const frameElement = document.querySelector('.w-\\[800px\\].h-\\[500px\\]');
    const frameRect = frameElement ? frameElement.getBoundingClientRect() : null;
    
    if (frameRect) {
      // Calculate relative position to the frame
      return {
        position: 'absolute' as const,
        top: buttonRect.top - frameRect.top,
        left: buttonRect.left - frameRect.left,
        width: buttonRect.width,
        height: buttonRect.height,
        transformOrigin: 'center',
        borderRadius: '16px',
        // Use hardware acceleration
        willChange: 'transform, opacity',
      };
    }
    
    // Fallback if frame not found
    return {
      position: 'absolute' as const,
      top: buttonRect.top,
      left: buttonRect.left,
      width: buttonRect.width,
      height: buttonRect.height,
      transformOrigin: 'center',
      borderRadius: '16px',
      // Use hardware acceleration
      willChange: 'transform, opacity',
    };
  };

  // Memoized click handler to prevent re-renders
  const handleClick = () => {
    // Pre-calculate dimensions before triggering the onClick
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonRect(rect);
    }
    
    // Then call the provided onClick handler
    onClick();
  };

  return (
    <>
      {/* Regular button that's visible when not selected */}
      <motion.div
        ref={buttonRef}
        className={`
          flex flex-col items-center justify-center
          ${isSelected 
            ? 'bg-[#1189D6] text-white' 
            : 'bg-[#1189D6] text-white'
          }
          cursor-pointer shadow-sm rounded-[16px]
        `}
        style={{ 
          height: '248px',
          visibility: isSelected ? 'hidden' : 'visible',
          // Use hardware acceleration
          willChange: 'transform, opacity'
        }}
        onClick={handleClick}
        // Handle entrance animation props from parent
        initial={initial}
        animate={animate}
        transition={transition ? {
          ...transition,
          // Add a slight delay based on index for staggered animation
          delay: (transition.delay || 0) + (index * 0.06)
        } : undefined}
        // Only keep tap animation, remove hover
        whileTap={!isSelected ? { scale: 0.98 } : undefined}
      >
        {/* Simple variant without percentages */}
        {!showPercentage ? (
          <span className="text-7xl font-medium font-cash">
            {formatCurrency(numericAmount, false)}
          </span>
        ) : (
          // Variant with amount and percentage
          <>
            <span className="text-6xl font-medium font-cash mb-2">
              {formatCurrency(numericAmount)}
            </span>
            <span className="text-xl opacity-80">
              {Math.round(numericAmount / 10)}%
            </span>
          </>
        )}
      </motion.div>

      {/* Expanded version that appears when selected */}
      <AnimatePresence mode="wait">
        {isSelected && buttonRect && (
          <motion.div
            className="shadow-lg bg-[#00B843] text-white absolute z-50"
            initial={getExpandedInitialStyle()}
            animate={{
              top: 0,
              left: 0,
              width: 800,
              height: 500,
              borderRadius: '4px',
              opacity: 1,
              scale: 1
            }}
            exit={{ 
              ...getExpandedInitialStyle(),
              opacity: 0,
              transition: { duration: 0.2, ease: "easeInOut" } 
            }}
            transition={{
              type: "spring",
              stiffness: 330,  // Increased for snappier animation
              damping: 30,
              mass: 0.8,       // Reduced mass for faster response
              // Use sync: true to ensure exit animations complete properly
              opacity: { duration: 0.15 }, // Faster opacity transition
            }}
            layout={false}
          >
            {/* Empty expanded state - no content */}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TipButton;