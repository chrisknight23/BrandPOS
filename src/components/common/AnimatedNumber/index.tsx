import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedNumberProps {
  /**
   * The numeric value to display and animate to
   */
  value: number;
  /**
   * Whether to show the dollar sign
   * @default true
   */
  showDollarSign?: boolean;
  /**
   * Whether to show decimal places
   * @default true
   */
  showDecimals?: boolean;
  /**
   * CSS class name to apply to the container
   */
  className?: string;
  /**
   * Whether to show the full formatted zero (0.00) initially
   * @default false
   */
  showFormattedZero?: boolean;
}

// Helper function to format numbers and calculate separator positions
const formatNumber = (num: number, showDecimals: boolean) => {
  // Special case for zero - no decimal places
  if (num === 0) {
    return {
      digits: [0],
      separatorPositions: {
        commas: null,
        decimal: null
      }
    };
  }

  // Format number with or without decimals
  const str = showDecimals ? num.toFixed(2) : Math.round(num).toString();
  const [whole, decimal] = str.split('.');
  
  // Split into digits and find separator positions
  const digits = showDecimals 
    ? (whole + decimal).split('').map(Number)
    : whole.split('').map(Number);

  const separatorPositions = {
    commas: whole.length > 3 ? whole.length - Math.floor(whole.length/3)*3 : null,
    decimal: showDecimals ? whole.length : null
  };
  
  return { digits, separatorPositions };
};

// Component for rendering individual digits with roll animation
const DigitRoller: React.FC<{ 
  value: number, 
  isNew?: boolean,
  isDecimalDigit?: boolean,
  isBeforeDecimal?: boolean,
  isAfterDollarSign?: boolean,
  nextIsOne?: boolean,
  onAnimationComplete?: () => void
}> = ({ 
  value, 
  isNew,
  isDecimalDigit,
  isBeforeDecimal,
  isAfterDollarSign,
  nextIsOne,
  onAnimationComplete
}) => {
  const [prevValue, setPrevValue] = useState(isNew || isDecimalDigit ? 0 : value);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sequence = Array.from({ length: 10 }, (_, i) => i);
  const height = 120;
  
  useEffect(() => {
    if (!hasAnimated) {
      setPrevValue(isNew || isDecimalDigit ? 0 : value);
      setHasAnimated(true);
    } else if (value === 0) {
      setPrevValue(0);
      setHasAnimated(false);
    } else if (isNew || isDecimalDigit) {
      // Keep it at 0 initially
      setPrevValue(0);
    } else {
      setPrevValue(value);
    }
  }, [value, isNew, isDecimalDigit, hasAnimated]);

  return (
    <div className="relative h-[120px] overflow-hidden w-[60px]">
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ 
          y: -prevValue * height 
        }}
        onAnimationComplete={() => {
          // After the slide-in animation completes, start rolling up from 0
          if ((isNew || isDecimalDigit) && prevValue === 0) {
            setPrevValue(value);
          }
          onAnimationComplete?.();
        }}
        transition={{ 
          duration: 0.75,
          ease: [0.32, 0.72, 0, 1],
          type: "tween"
        }}
      >
        {sequence.map((num) => (
          <div
            key={num}
            className="flex items-center justify-center h-[120px] font-cash font-medium text-[100px]"
            style={{
              width: '60px',
              transform: num === 1 
                ? nextIsOne 
                  ? isAfterDollarSign
                    ? 'translateX(18px)'
                    : 'translateX(18px)'
                  : 'translateX(6px)'
                : 'none',
              transition: 'transform 0.75s cubic-bezier(0.32, 0.72, 0, 1)'
            }}
          >
            {num}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// Component for rendering separators (comma and decimal point)
const Separator = React.forwardRef<HTMLDivElement, { char: string, layoutId: string }>(
  ({ char, layoutId }, ref) => (
    <motion.div
      ref={ref}
      layoutId={layoutId}
      className="flex items-center h-[120px] mx-[2px] font-cash font-medium text-[100px]"
    >
      {char}
    </motion.div>
  )
);

Separator.displayName = 'Separator';

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ 
  value,
  showDollarSign = true,
  showDecimals = true,
  className = '',
  showFormattedZero = false
}) => {
  const [prevValue, setPrevValue] = useState(value);
  const { digits, separatorPositions } = formatNumber(value, showDecimals);
  const prevFormatted = formatNumber(prevValue, showDecimals);
  
  // Track first digit for dollar sign spacing
  const firstDigitIs7 = digits[0] === 7;
  const firstDigitIs1 = digits[0] === 1;
  const firstTwoAre11 = firstDigitIs1 && digits[1] === 1;
  
  React.useEffect(() => {
    if (value === 0) {
      setPrevValue(0);
    } else {
      setPrevValue(value);
    }
  }, [value]);

  const renderContent = () => {
    let content: JSX.Element[] = [];

    // Add dollar sign if needed
    if (showDollarSign) {
      content.push(
        <motion.span 
          className="flex items-center h-[120px] font-cash font-medium text-[100px]"
          layout
          style={{ 
            marginRight: firstDigitIs7 ? 0 : firstTwoAre11 ? -20 : firstDigitIs1 ? -8 : 8,
            transition: 'margin-right 0.75s cubic-bezier(0.32, 0.72, 0, 1)'
          }}
        >
          $
        </motion.span>
      );
    }

    // Don't show any separators when transitioning to zero
    const isTransitioningToZero = value === 0;

    // Render all digits with separators in the correct positions
    digits.forEach((digit, index) => {
      // Check if this digit is new or a decimal digit
      const isAfterDecimal = separatorPositions.decimal !== null && index >= separatorPositions.decimal;
      const wasAfterDecimal = prevFormatted.separatorPositions.decimal !== null && 
                             index >= prevFormatted.separatorPositions.decimal;
      
      const isNewDigit = !showFormattedZero && (index >= prevFormatted.digits.length || 
                        digit !== prevFormatted.digits[index]);
      const isDecimalDigit = !showFormattedZero && isAfterDecimal && !prevFormatted.separatorPositions.decimal;
      const isFirstDigit = index === 0;

      // Add digit
      content.push(
        <motion.div 
          key={`digit-${index}`}
          layout
          className="w-[60px]"
          style={{
            transform: digit === 1 && index < digits.length - 1 && digits[index + 1] === 1 ? 'translateX(-10px)' : 'none'
          }}
          initial={isNewDigit || isDecimalDigit ? { 
            x: 20,
            opacity: 0
          } : undefined}
          animate={{ 
            x: 0,
            opacity: 1
          }}
          exit={{
            x: -20,
            opacity: 0
          }}
          transition={{
            duration: 0.75,
            ease: [0.32, 0.72, 0, 1],
            layout: {
              duration: 0.75,
              ease: [0.32, 0.72, 0, 1]
            }
          }}
        >
          <DigitRoller 
            value={digit} 
            isNew={isNewDigit}
            isDecimalDigit={isDecimalDigit}
            isBeforeDecimal={separatorPositions.decimal !== null && index === separatorPositions.decimal - 1}
            isAfterDollarSign={isFirstDigit}
            nextIsOne={index < digits.length - 1 && digits[index + 1] === 1}
            onAnimationComplete={() => {
              // Animation completion handler if needed
            }}
          />
        </motion.div>
      );

      // Only add separators if we're not transitioning to zero
      if (!isTransitioningToZero) {
        // Add comma if needed
        if (separatorPositions.commas !== null && 
            index === separatorPositions.commas - 1) {
          content.push(
            <motion.div
              key="comma"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.75,
                ease: [0.32, 0.72, 0, 1]
              }}
            >
              <Separator layoutId="comma" char="," />
            </motion.div>
          );
        }

        // Add decimal point after whole number
        if (separatorPositions.decimal !== null && 
            index === separatorPositions.decimal - 1) {
          content.push(
            <motion.div
              key="decimal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ 
                marginLeft: digit === 7 ? -12 : 0
              }}
              transition={{
                duration: 0.75,
                ease: [0.32, 0.72, 0, 1]
              }}
            >
              <Separator layoutId="decimal" char="." />
            </motion.div>
          );
        }
      }
    });

    return content;
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div 
        className="flex items-center relative"
        layout
        transition={{ 
          duration: 0.75,
          ease: [0.32, 0.72, 0, 1]
        }}
      >
        <div className="flex">
          <AnimatePresence mode="popLayout" initial={false}>
            {renderContent()}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}; 