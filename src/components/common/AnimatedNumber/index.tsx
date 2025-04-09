import React, { useState, useEffect, useRef } from 'react';
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
const formatNumber = (num: number, showDecimals: boolean, showFormattedZero: boolean = false) => {
  // Special case for zero - handle with or without decimal places based on props
  if (num === 0) {
    if (showDecimals && showFormattedZero) {
      // Return formatted zero with decimal places (0.00)
      const whole = "0";
      const decimal = "00";
      
      return {
        digits: (whole + decimal).split('').map(Number),
        separatorPositions: {
          commas: null,
          decimal: whole.length
        }
      };
    } else {
      // Return simple zero without decimal places
      return {
        digits: [0],
        separatorPositions: {
          commas: null,
          decimal: null
        }
      };
    }
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
  isDecimalPart?: boolean,
  onAnimationComplete?: () => void
}> = ({ 
  value, 
  isNew,
  isDecimalDigit,
  isBeforeDecimal,
  isAfterDollarSign,
  nextIsOne,
  isDecimalPart,
  onAnimationComplete
}) => {
  // Use useRef instead of useState to avoid triggering re-renders
  const prevValueRef = useRef(isNew || isDecimalDigit ? 0 : value);
  const hasAnimatedRef = useRef(false);
  const [animatedValue, setAnimatedValue] = useState(prevValueRef.current);
  const sequence = Array.from({ length: 10 }, (_, i) => i);
  const height = 120;
  
  // This effect runs once on mount to setup initial value
  useEffect(() => {
    if (isNew || isDecimalDigit) {
      prevValueRef.current = 0;
    } else {
      prevValueRef.current = value;
    }
    setAnimatedValue(prevValueRef.current);
  }, []); // Empty dependency array means this runs once on mount
  
  // This effect handles value changes
  useEffect(() => {
    // Skip if value hasn't changed from what we're already showing
    if (value === animatedValue) return;
    
    // If the digit is new or a decimal digit and we haven't animated yet
    if ((isNew || isDecimalDigit) && !hasAnimatedRef.current) {
      // Important: Always start new/decimal digits from 0, then animate to final value
      hasAnimatedRef.current = true;
      // For new digits, make sure we always start from 0
      setAnimatedValue(0);
      // The onAnimationComplete handler will trigger the animation to the actual value
    } 
    // Reset for zero
    else if (value === 0) {
      prevValueRef.current = 0;
      hasAnimatedRef.current = false;
      setAnimatedValue(0);
    }
    // Normal value change
    else if (value !== prevValueRef.current) {
      prevValueRef.current = value;
      setAnimatedValue(value);
    }
  }, [value, isNew, isDecimalDigit, animatedValue]);

  return (
    <div className="relative h-[120px] overflow-hidden w-[60px]">
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ 
          y: -animatedValue * height 
        }}
        onAnimationComplete={() => {
          // After the slide-in animation completes, start rolling up from 0
          if ((isNew || isDecimalDigit) && animatedValue === 0 && value !== 0) {
            prevValueRef.current = value;
            setAnimatedValue(value);
          }
          onAnimationComplete?.();
        }}
        transition={{ 
          duration: isDecimalPart ? 0 : 0.75, // Zero duration for decimal digits
          ease: [0.32, 0.72, 0, 1],
          type: "tween",
          // For new digits, use a slightly different timing to emphasize the roll-up effect
          ...(isNew && {
            duration: 0.95,
            ease: [0.25, 0.1, 0.25, 1.0],
          })
        }}
      >
        {sequence.map((num) => (
          <div
            key={num}
            className="flex items-center justify-center h-[120px] font-cash font-medium text-[100px] text-white"
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
      className="flex items-center h-[120px] mx-[2px] font-cash font-medium text-[100px] text-white"
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
  // Use a ref for prev value to avoid triggering re-renders
  const prevValueRef = useRef(value);
  const [formattedValue, setFormattedValue] = useState(value);
  const { digits, separatorPositions } = formatNumber(formattedValue, showDecimals, showFormattedZero);
  const prevFormatted = formatNumber(prevValueRef.current, showDecimals, showFormattedZero);
  
  // Track first digit for dollar sign spacing
  const firstDigitIs7 = digits[0] === 7;
  const firstDigitIs1 = digits[0] === 1;
  const firstTwoAre11 = firstDigitIs1 && digits[1] === 1;
  
  // Update on value changes
  useEffect(() => {
    // Only update if the value has actually changed
    if (value !== formattedValue) {
      prevValueRef.current = formattedValue;
      setFormattedValue(value);
    }
  }, [value, formattedValue]);

  const renderContent = () => {
    let wholeNumberContent: JSX.Element[] = [];
    let decimalContent: JSX.Element[] = [];
    
    // Add dollar sign if needed
    if (showDollarSign) {
      wholeNumberContent.push(
        <motion.span 
          key="dollar-sign"
          className="flex items-center h-[120px] font-cash font-medium text-[100px] text-white"
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

    // Only skip separators when showing a simple zero without formatting
    const isSimpleZero = formattedValue === 0 && (!showDecimals || !showFormattedZero);
    
    // Calculate where the decimal starts for the current value
    const decimalStartsAt = separatorPositions.decimal !== null ? separatorPositions.decimal : digits.length;

    // Render all digits with separators in the correct positions
    digits.forEach((digit, index) => {
      const isAfterDecimal = showDecimals && separatorPositions.decimal !== null && index > separatorPositions.decimal;
      const wasAfterDecimal = prevFormatted.separatorPositions.decimal !== null && 
                             index > prevFormatted.separatorPositions.decimal;
      
      // Improved detection of new digits - a digit is new if:
      // 1. It didn't exist in the previous number (e.g., going from 1 to 12, the '2' is new)
      // 2. Or if this position existed but had a different value
      const isNewlyAdded = index >= prevFormatted.digits.length;
      const didNumberLengthChange = digits.length !== prevFormatted.digits.length;
      
      // A digit is considered new in several cases:
      // - It's a newly added position (1->12, the 2 is new)
      // - Number of digits changed (9->10, both 1 and 0 are "new" positions)
      // - For the most significant positions when the length changes (9->10, the 1 is definitely new)
      const isNewDigit = !showFormattedZero && (
        isNewlyAdded || 
        (digit !== prevFormatted.digits[index] && (
          // Position previously didn't exist or number length changed
          isNewlyAdded || didNumberLengthChange || 
          // Special case for most significant digit when length changes
          (didNumberLengthChange && index === 0)
        ))
      );
      
      const isDecimalDigit = !showFormattedZero && isAfterDecimal && !wasAfterDecimal;
      const isFirstDigit = index === 0;

      // Create digit element
      const digitElement = (
        <motion.div 
          key={`digit-${index}`}
          layout
          className="w-[60px]"
          style={{
            transform: digit === 1 && index < digits.length - 1 && digits[index + 1] === 1 ? 'translateX(-10px)' : 'none',
            opacity: 1
          }}
          initial={isNewDigit ? { 
            x: 20,
            opacity: isAfterDecimal ? 1 : 0
          } : undefined}
          animate={{ 
            x: 0,
            opacity: 1
          }}
          exit={{
            x: -20,
            opacity: isAfterDecimal ? 1 : 0
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
            isDecimalPart={index >= decimalStartsAt}
            onAnimationComplete={() => {
              // Animation completion handler if needed
            }}
          />
        </motion.div>
      );

      // Add to the appropriate array based on position
      if (index < decimalStartsAt) {
        wholeNumberContent.push(digitElement);
      } else if (showDecimals) {
        decimalContent.push(digitElement);
      }

      // Only add separators if we're not transitioning to zero
      if (!isSimpleZero) {
        // Add comma if needed
        if (separatorPositions.commas !== null && 
            index === separatorPositions.commas - 1) {
          wholeNumberContent.push(
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
            index === separatorPositions.decimal - 1 && 
            showDecimals) {
          decimalContent.unshift(
            <div
              key="decimal"
            >
              <Separator layoutId="decimal" char="." />
            </div>
          );
        }
      }
    });

    return { wholeNumberContent, decimalContent };
  };

  const { wholeNumberContent, decimalContent } = renderContent();

  return (
    <div className={`flex items-center justify-center text-white ${className}`}>
      <motion.div 
        className="flex items-center relative"
        layout
        transition={{ 
          duration: 0.75,
          ease: [0.32, 0.72, 0, 1]
        }}
      >
        <div className="flex">
          {/* Always render whole number part with animations */}
          <AnimatePresence mode="popLayout" initial={false}>
            {wholeNumberContent}
          </AnimatePresence>
          
          {/* Only render decimal part when showDecimals is true */}
          {showDecimals && decimalContent}
        </div>
      </motion.div>
    </div>
  );
}; 