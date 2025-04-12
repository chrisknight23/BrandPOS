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
  /**
   * Whether to show only the dollar sign without any digits
   * @default false
   */
  showOnlyDollarSign?: boolean;
  /**
   * Custom offsets (in pixels) for specific digits
   * Key is the digit, value is the horizontal offset to apply
   * @example { 1: 6, 2: -2 } // Offset digit 1 by 6px right, digit 2 by 2px left
   */
  digitOffsets?: Record<number, number>;
  /**
   * Special offsets for combinations of digits
   * Key format is 'currentDigit-nextDigit', value is the offset
   * @example { '1-1': 18, '2-3': -5 } // Offset digit 1 followed by 1 by 18px, 2 followed by 3 by -5px
   */
  combinationOffsets?: Record<string, number>;
  /**
   * Special offset when digit follows dollar sign
   * Key is the digit, value is the horizontal offset
   * @example { 1: 18 } // Offset digit 1 by 18px when it follows $
   */
  afterDollarSignOffsets?: Record<number, number>;
  /**
   * Whether to use automatic kerning instead of manual offsets
   * When true, digits will be automatically spaced based on their visual width
   * @default false
   */
  useAutoKerning?: boolean;
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
  
  // Add commas to whole number part
  const withCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
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
  nextDigit?: number | null,
  digitOffsets?: Record<number, number>,
  combinationOffsets?: Record<string, number>,
  afterDollarSignOffsets?: Record<number, number>,
  useAutoKerning?: boolean,
  onAnimationComplete?: () => void
}> = ({ 
  value, 
  isNew,
  isDecimalDigit,
  isBeforeDecimal,
  isAfterDollarSign,
  nextDigit,
  digitOffsets = {},
  combinationOffsets = {},
  afterDollarSignOffsets = {},
  useAutoKerning = false,
  onAnimationComplete
}) => {
  // Track previous value and animation state with refs to avoid re-renders
  const prevValueRef = useRef(isNew || isDecimalDigit ? 0 : value);
  const hasAnimatedRef = useRef(false);
  const [prevValue, setPrevValue] = useState(prevValueRef.current);
  const sequence = Array.from({ length: 10 }, (_, i) => i);
  const height = 120;
  
  // Get container width based on digit value
  const getContainerWidth = (digit: number) => {
    if (useAutoKerning) {
      // Use a much narrower container for digit '1'
      return digit === 1 ? 20 : 60;
    }
    // Default width for manual kerning
    return 60;
  };
  
  // Fix infinite update loop by using refs to track state changes
  useEffect(() => {
    if (!hasAnimatedRef.current) {
      prevValueRef.current = isNew || isDecimalDigit ? 0 : value;
      setPrevValue(prevValueRef.current);
      hasAnimatedRef.current = true;
    } else if (value === 0) {
      prevValueRef.current = 0;
      hasAnimatedRef.current = false;
      setPrevValue(0);
    } else if (isNew || isDecimalDigit) {
      // Keep it at 0 initially
      setPrevValue(0);
    } else if (value !== prevValueRef.current) {
      // Only update if value has changed
      prevValueRef.current = value;
      setPrevValue(value);
    }
  }, [value, isNew, isDecimalDigit]); // Remove hasAnimated from dependencies

  // Helper to calculate transform for different digits
  const getDigitTransform = (num: number) => {
    // When auto-kerning is enabled, use simplified positioning
    if (useAutoKerning) {
      if (num === 1) {
        // Center digit '1' in its narrower container
        return 'translateX(0)';
      }
      return 'none';
    }
    
    // Rest of the manual offset system remains unchanged
    // Default offsets
    const DEFAULT_OFFSETS: Record<number, number> = {
      1: 6  // Default offset for digit '1'
    };
    
    // 1. Check for special combination offset (current-next digit pair)
    if (nextDigit !== null && nextDigit !== undefined) {
      const combinationKey = `${num}-${nextDigit}`;
      if (combinationOffsets[combinationKey] !== undefined) {
        return `translateX(${combinationOffsets[combinationKey]}px)`;
      }
    }
    
    // 2. Check if digit is after dollar sign and has special offset
    if (isAfterDollarSign && afterDollarSignOffsets[num] !== undefined) {
      return `translateX(${afterDollarSignOffsets[num]}px)`;
    }
    
    // 3. Check for individual digit offset
    if (digitOffsets[num] !== undefined) {
      return `translateX(${digitOffsets[num]}px)`;
    }
    
    // 4. Fall back to default offset if exists
    if (DEFAULT_OFFSETS[num] !== undefined) {
      return `translateX(${DEFAULT_OFFSETS[num]}px)`;
    }
    
    // 5. No offset
    return 'none';
  };

  // The container width changes based on the current value
  const containerWidth = getContainerWidth(value);

  return (
    <div 
      className="relative h-[120px] overflow-hidden" 
      style={{ 
        width: `${containerWidth}px`, 
        transition: 'width 0.75s cubic-bezier(0.32, 0.72, 0, 1)'
      }}
    >
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ 
          y: -prevValue * height 
        }}
        onAnimationComplete={() => {
          // After the slide-in animation completes, start rolling up from 0
          if ((isNew || isDecimalDigit) && prevValue === 0) {
            prevValueRef.current = value;
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
              width: `${getContainerWidth(num)}px`,
              transform: getDigitTransform(num),
              transition: 'transform 0.75s cubic-bezier(0.32, 0.72, 0, 1), width 0.75s cubic-bezier(0.32, 0.72, 0, 1)'
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
  showFormattedZero = false,
  showOnlyDollarSign = false,
  digitOffsets = {},
  combinationOffsets = {},
  afterDollarSignOffsets = {},
  useAutoKerning = false
}) => {
  const [prevValue, setPrevValue] = useState(value);
  const { digits, separatorPositions } = formatNumber(value, showDecimals, showFormattedZero);
  const prevFormatted = formatNumber(prevValue, showDecimals, showFormattedZero);
  
  // Default offsets if not provided
  const defaultDigitOffsets = {
    1: 6,  // Offset digit '1' by 6px to the right
    ...digitOffsets
  };
  
  const defaultCombinationOffsets = {
    '1-1': 14, // Reduce spacing when '1' is followed by '1'
    '1-0': 10, // Add spacing for '1' followed by '0'
    '1-2': 12, // Add spacing for '1' followed by '2'
    '1-3': 12, // Add spacing for '1' followed by '3'
    ...combinationOffsets
  };
  
  const defaultAfterDollarSignOffsets = {
    1: 14, // Reduce spacing between dollar sign and digit '1'
    2: 4,  // Slight adjustment for digit '2'
    3: 4,  // Slight adjustment for digit '3'
    ...afterDollarSignOffsets
  };
  
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
          key="dollar-sign"
          className="flex items-center h-[120px] font-cash font-medium text-[100px]"
          layout
          style={{ 
            marginRight: useAutoKerning 
              ? (firstDigitIs1 ? -18 : -6)  // Pull all numbers closer to dollar sign, especially 1
              : (firstDigitIs7 ? -6 : firstTwoAre11 ? -24 : firstDigitIs1 ? -14 : 2), // Reduce spacing for all cases
            transition: 'margin-right 0.75s cubic-bezier(0.32, 0.72, 0, 1)'
          }}
        >
          $
        </motion.span>
      );
    }

    // If we're showing only the dollar sign, return early
    if (showOnlyDollarSign) {
      return content;
    }

    // Create a separate array for decimal part to manage transitions together
    let decimalContent: JSX.Element[] = [];
    
    // Don't show any separators when transitioning to zero (unless showing formatted zero)
    const isTransitioningToZero = value === 0 && !showFormattedZero;

    // Render all digits with separators in the correct positions
    digits.forEach((digit, index) => {
      // Check if this digit is new or a decimal digit
      const isAfterDecimal = separatorPositions.decimal !== null && index >= separatorPositions.decimal;
      const wasAfterDecimal = prevFormatted.separatorPositions.decimal !== null && 
                             index >= prevFormatted.separatorPositions.decimal;
      
      const isNewDigit = index >= prevFormatted.digits.length || 
                        digit !== prevFormatted.digits[index];
      const isDecimalDigit = isAfterDecimal && !prevFormatted.separatorPositions.decimal;
      const isFirstDigit = index === 0;
      
      // Check if next digit is 1 or 2 for special spacing
      const nextDigit = index < digits.length - 1 ? digits[index + 1] : null;

      // Add digit to appropriate array
      const digitElement = (
        <motion.div 
          key={`digit-${index}`}
          layout
          className="flex"
          style={{
            marginLeft: useAutoKerning && digit === 1 ? '-10px' : undefined,
            transform: useAutoKerning ? 'none' : (digit === 1 && index < digits.length - 1 && digits[index + 1] === 1 ? 'translateX(-10px)' : 'none')
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
            duration: 0.1,
            ease: [0.32, 0.72, 0, 1],
            layout: {
              duration: 0.1,
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
            nextDigit={nextDigit}
            digitOffsets={defaultDigitOffsets}
            combinationOffsets={defaultCombinationOffsets}
            afterDollarSignOffsets={defaultAfterDollarSignOffsets}
            useAutoKerning={useAutoKerning}
            onAnimationComplete={() => {
              // Animation completion handler if needed
            }}
          />
        </motion.div>
      );

      // Add digit to content or decimalContent based on position
      if (isAfterDecimal) {
        decimalContent.push(digitElement);
      } else {
        content.push(digitElement);
      }

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
          // Create decimal point element to prepend to decimal content
          const decimalPointElement = (
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
          
          // Add the decimal point to the decimal content
          decimalContent.unshift(decimalPointElement);
        }
      }
    });

    // Wrap the decimal part in a single motion.div for coordinated transitions
    if (decimalContent.length > 0) {
      // Create a coordinated exit for the entire decimal section
      content.push(
        <motion.div
          key="decimal-wrapper"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.1, // Faster exit animation for decimal parts
            ease: [0.32, 0.72, 0, 1]
          }}
          className="flex items-center"
        >
          {decimalContent}
        </motion.div>
      );
    }

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
        style={useAutoKerning ? { marginLeft: '-2px' } : {}}
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