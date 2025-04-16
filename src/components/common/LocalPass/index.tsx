import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import lottie from 'lottie-web';
import { AnimatedNumber } from '../AnimatedNumber';
import { AnimatedQRCode } from '../AnimatedQRCode';

/**
 * A card component that can expand to show additional content with animations.
 * Enhanced version with physics-based animations and additional customization options.
 * 
 * @component
 * @example
 * ```tsx
 * <LocalPass
 *   layoutId="amount-1"
 *   amount="1"
 *   isExpanded={false}
 *   onClick={() => handleClick()}
 * />
 * ```
 */

// ============= Types =============
/**
 * The states a LocalPass card can be in
 */
export type CardState = 'expanded' | 'initial' | 'dropped';

/**
 * Props for internal CardFace component
 */
interface CardFaceProps {
  /** Content to render inside the card face */
  children: React.ReactNode;
  /** Whether the card is in expanded state */
  isExpanded: boolean;
  /** Background color for the card face */
  backgroundColor: string;
  /** Whether this is the back face of the card */
  isFlipped?: boolean;
  /** The current animation state of the card */
  animationState: CardState;
}

/**
 * Props for the LocalPass component
 */
export interface LocalPassProps {
  /** Initial card state */
  initialState?: CardState;
  /** Background color for the card (CSS color string) */
  backgroundColor?: string;
  /** Background color for the back of the card (CSS color string) */
  backfaceColor?: string;
  /** Animation data for Lottie (JSON) */
  lottieAnimation?: any;
  /** Initial numeric value to display */
  initialValue?: number;
  /** Whether to generate random values when animations complete */
  useRandomValues?: boolean;
  /** Min value for random generation */
  randomMin?: number;
  /** Max value for random generation */
  randomMax?: number;
  /** Custom header text */
  headerText?: string;
  /** Custom subheader text */
  subheaderText?: string;
  /** Custom button text */
  buttonText?: string;
  /** Handler for button click */
  onButtonClick?: (e: React.MouseEvent) => void;
  /** Handler for when the animation state changes */
  onStateChange?: (newState: CardState) => void;
  /** Handler for when the card is flipped */
  onFlip?: (isFlipped: boolean) => void;
  /** Handler for when the animation completes */
  onAnimationComplete?: () => void;
  /** Custom content for card front */
  frontContent?: React.ReactNode;
  /** Custom content for card back */
  backContent?: React.ReactNode;
  /** Whether animations should play automatically on mount */
  autoPlay?: boolean;
  /** Custom class name for the card container */
  className?: string;
  /** Delay in ms before starting animations */
  animationDelay?: number;
  
  // Original LocalPass props for backward compatibility
  /** Unique ID for Framer Motion layout animations */
  layoutId?: string;
  /** Amount to display as a string (for backward compatibility) */
  amount?: string;
  /** Whether the card is in expanded state (for backward compatibility) */
  isExpanded?: boolean;
  /** Handler for click events (for backward compatibility) */
  onClick?: () => void;
  /** Optional child elements to render in expanded state (for backward compatibility) */
  children?: React.ReactNode;
  /** Disable all animations (for backward compatibility) */
  noAnimation?: boolean;
  
  /** Text content to display instead of a numeric amount */
  textAmount?: string;
  
  /** Text to display after the numeric amount */
  suffixText?: string;
}

// ============= Constants =============
const CARD_SCALES = {
  EXPANDED: 2.4,
  NORMAL: 1,
  COMPACT: 0.8
} as const;

const ANIMATION_CONFIG = {
  spring: {
    type: "spring" as const,
    stiffness: 130,
    damping: 13,
    mass: 0.6,
    restSpeed: 0.001,
    restDelta: 0.001
  },
  smooth: {
    type: "spring" as const,
    stiffness: 100,
    damping: 15,
    mass: 0.5
  }
} as const;

// Animation timing constants
const DELAYS = {
  INITIAL_ANIMATION: 0,   // Initial animation delay on component mount
  EXPANDED_ANIMATION: 100,   // Delay before playing animation in expanded state
  REPLAY_BUTTON_ANIMATION: 200,  // Delay when manually replaying animation
  NUMBER_ANIMATION: 1500,     // Delay before showing the animated number
  ZERO_DISPLAY_DURATION: 0,  // Delay before animating from 0 to actual amount
} as const;

// ============= Components =============
/**
 * Internal component that renders one face of the card
 */
const CardFace: React.FC<CardFaceProps> = ({ 
  children, 
  isExpanded, 
  backgroundColor,
  isFlipped,
  animationState
}) => (
  <motion.div
    className={`w-full h-full ${backgroundColor} rounded-[32px] absolute backface-hidden`}
    style={{
      boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
      willChange: 'transform',
      backfaceVisibility: 'hidden',
      transform: isFlipped ? 'rotateY(180deg)' : undefined,
      transformStyle: 'preserve-3d'
    }}
  >
    {children}
  </motion.div>
);

/**
 * LocalPass component with animations, state transitions, and interactive elements.
 * Enhanced version with physics-based animations and additional customization options.
 * 
 * @component
 * @example
 * ```tsx
 * // Basic usage (backward compatible)
 * <LocalPass
 *   amount="25.50"
 *   isExpanded={false}
 *   onClick={() => handleClick()}
 * />
 * 
 * // Enhanced usage
 * <LocalPass 
 *   initialValue={25.75}
 *   initialState="initial"
 *   backgroundColor="bg-[#00B843]"
 *   headerText="Local Cash"
 *   onButtonClick={() => console.log('Button clicked')}
 * />
 * ```
 */
export const LocalPass: React.FC<LocalPassProps> = ({
  // Handle both new and legacy props
  initialState,
  backgroundColor = 'bg-[#00B843]',
  backfaceColor = 'bg-[#004D1C]',
  lottieAnimation,
  initialValue,
  useRandomValues = true,
  randomMin = 10,
  randomMax = 50,
  headerText = 'Local Cash',
  subheaderText = 'Local Cash earned on tips',
  buttonText = 'Collect',
  onButtonClick,
  onStateChange,
  onFlip,
  onAnimationComplete,
  frontContent,
  backContent,
  autoPlay = true,
  className = '',
  animationDelay = 0,
  textAmount,
  suffixText,
  
  // Original LocalPass props
  layoutId,
  amount,
  isExpanded,
  onClick,
  children,
  noAnimation = false
}) => {
  const controls = useAnimation();
  const lottieControls = useAnimation();
  const numberControls = useAnimation();
  
  // Progress timer state
  const [progressTimer, setProgressTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerDuration = 12000; // 12 seconds timer duration
  const timerInterval = 50; // Update every 50ms
  const timerStartDelay = 1500; // 1.5 second delay before starting the timer
  
  // Determine initial state based on either new or legacy props
  const derivedInitialState = initialState || (isExpanded ? 'expanded' : 'initial');
  const [animationState, setAnimationState] = useState<CardState>(derivedInitialState);
  const [isFlipped, setIsFlipped] = useState(false);
  const lottieContainer = useRef<HTMLDivElement>(null);
  const lottieAnimRef = useRef<any>(null);
  const prevAnimationState = useRef<CardState>(animationState);
  
  // Update animation state when initialState prop changes
  useEffect(() => {
    console.log(`LocalPass: initialState prop changed to ${initialState}`);
    if (initialState) {
      console.log(`LocalPass: Updating internal animationState to ${initialState}`);
      
      // Only update state if it's different from current state
      if (initialState !== animationState) {
        setAnimationState(initialState);
        
        // Reset Lottie animation if needed
        if (initialState === 'expanded' && lottieAnimRef.current) {
          // Reset animation to first frame
          lottieAnimRef.current.goToAndStop(0, true);
          setShowNumber(false);
          
          // Start animation with custom delay
          setTimeout(() => {
            if (lottieAnimRef.current) {
              console.log(`LocalPass: Playing animation after initialState change to expanded (delay: ${animationDelay}ms)`);
              lottieAnimRef.current.play();
            }
          }, animationDelay || DELAYS.EXPANDED_ANIMATION);
        }
      }
    }
  }, [initialState, animationDelay]);
  
  // Number display state
  const [showNumber, setShowNumber] = useState(false);
  
  // Determine initial amount from either new or legacy props
  const derivedInitialAmount = initialValue !== undefined ? 
    initialValue : 
    (amount ? parseFloat(amount) : 0);
  
  const [cashbackAmount, setCashbackAmount] = useState(derivedInitialAmount);
  
  // Generate a random amount between min and max with two decimal places
  const generateRandomAmount = () => {
    // Random between randomMin-randomMax with two decimal places
    return Math.round((Math.random() * (randomMax - randomMin) + randomMin) * 100) / 100;
  };
  
  // Handle animation state changes and notify via appropriate callback
  useEffect(() => {
    if (onStateChange) {
      onStateChange(animationState);
    }
    
    // Support legacy onClick when state changes to expanded
    if (animationState === 'expanded' && onClick && prevAnimationState.current !== 'expanded') {
          onClick();
    }
    
    prevAnimationState.current = animationState;
  }, [animationState, onClick, onStateChange, animationDelay]);
  
  // Initialize Lottie
  useEffect(() => {
    // Skip animation if disabled
    if (noAnimation || !autoPlay) return;
    
    console.log('LocalPass: Initializing Lottie animation');
    let anim: any = null;
    
    if (lottieContainer.current && lottieAnimation) {
      // Reset any previous animations first
      if (lottieAnimRef.current) {
        lottieAnimRef.current.destroy();
        lottieAnimRef.current = null;
      }
      
      // Reset any previous styles first
      if (lottieContainer.current) {
        lottieContainer.current.style.cssText = '';
        
        // Center positioning without transforms
        lottieContainer.current.style.position = 'absolute';
        lottieContainer.current.style.width = '158px';
        lottieContainer.current.style.height = '158px';
        lottieContainer.current.style.top = '50%';
        lottieContainer.current.style.left = '50%';
        lottieContainer.current.style.marginLeft = '-79px'; // Half the width
        lottieContainer.current.style.marginTop = '-79px'; // Half the height
      }
      
      // Create a new animation instance
      anim = lottie.loadAnimation({
        container: lottieContainer.current,
        renderer: 'svg',
        loop: false,
        autoplay: false, // Start manually to ensure proper timing
        animationData: lottieAnimation,
        rendererSettings: {
          progressiveLoad: false,
          preserveAspectRatio: 'xMidYMid meet',
          className: 'lottie-svg'
        }
      });

      // Add completion listener to know when animation finishes
      anim.addEventListener('complete', () => {
        // Only handle completion in expanded state
        if (animationState === 'expanded') {
          // Show the number after the lottie animation completes - initially only the $ sign
          setShowNumber(true);
          setCashbackAmount(0);
          
          // Then after a delay, update to the final amount to trigger animation
          setTimeout(() => {
            if (useRandomValues) {
              setCashbackAmount(generateRandomAmount());
            } else {
              setCashbackAmount(derivedInitialAmount);
            }
            
            // Wait a bit more, then call the animation complete callback
            setTimeout(() => {
              console.log('LocalPass: Animation sequence complete, calling onAnimationComplete');
              if (onAnimationComplete) {
                onAnimationComplete();
              }
            }, 1000); // Wait 1 second after amount is shown
          }, DELAYS.ZERO_DISPLAY_DURATION);
        }
      });

      lottieAnimRef.current = anim;
      
      // Always ensure animation starts from the first frame
      anim.goToAndStop(0, true);
      
      // Start the animation with a slight delay to ensure it's fully loaded and initialized
      if (animationState === 'expanded') {
        setTimeout(() => {
          console.log(`LocalPass: Starting Lottie animation (delay: ${animationDelay}ms)`);
          if (lottieAnimRef.current) {
            lottieAnimRef.current.play();
          }
        }, animationDelay || 50); // Use custom delay or small default delay
      }
    } else {
      // If no lottie animation, just show the number
      setShowNumber(true);
    }

    return () => {
      console.log('LocalPass: Cleaning up Lottie animation');
      if (anim) {
        anim.removeEventListener('complete');
        anim.destroy();
      }
    };
  }, [animationState, lottieAnimation, noAnimation, autoPlay, initialState]); // Add initialState to dependencies

  // Handle animation when card state changes
  useEffect(() => {
    console.log(`LocalPass: Card state changed to ${animationState} from ${prevAnimationState.current}`);
    if (animationState === 'expanded' && prevAnimationState.current !== 'expanded') {
      if (lottieAnimRef.current) {
        // Reset animation
        lottieAnimRef.current.goToAndStop(0, true);
        setShowNumber(false);
        
        // Play lottie animation after card expansion
        setTimeout(() => {
          console.log(`LocalPass: Playing Lottie animation after state change (delay: ${animationDelay}ms)`);
          lottieAnimRef.current.play();
          // Number will be shown via the 'complete' event listener now
        }, animationDelay || DELAYS.EXPANDED_ANIMATION);
      } else {
        // If no lottie animation, just show the number
        setShowNumber(true);
      }
    } else if (prevAnimationState.current === 'expanded' && animationState !== 'expanded') {
      // Keep number visible when leaving expanded state
      // Ensure smooth transition by triggering a re-render of the animated number
      if (showNumber) {
        // Slightly modify the amount to force a re-render and clean animation
        const currentAmount = cashbackAmount;
        setCashbackAmount(0.00001);
        setTimeout(() => {
          setCashbackAmount(currentAmount);
        }, 50);
      }
    } else if (animationState === 'dropped' || animationState === 'initial') {
      // Ensure number remains visible when switching between normal and compact states
      if (showNumber && cashbackAmount > 0) {
        // Number should stay visible with proper scaling
      }
    }
    
    // Update previous state
    prevAnimationState.current = animationState;
  }, [animationState, animationDelay]);

  // Handle card scale animations
  useEffect(() => {
    switch (animationState) {
      case 'dropped':
        controls.start({
          scale: CARD_SCALES.COMPACT,
          transition: ANIMATION_CONFIG.spring
        });
        lottieControls.start({
          scale: 1 / CARD_SCALES.COMPACT,
          transition: ANIMATION_CONFIG.spring
        });
        numberControls.start({
          scale: 1 / CARD_SCALES.COMPACT,
          transition: ANIMATION_CONFIG.spring
        });
        break;
      case 'expanded':
        controls.start({
          scale: CARD_SCALES.EXPANDED,
          transition: ANIMATION_CONFIG.spring
        });
        lottieControls.start({
          scale: 1 / CARD_SCALES.EXPANDED,
          transition: ANIMATION_CONFIG.spring
        });
        numberControls.start({
          scale: 1 / CARD_SCALES.EXPANDED,
          transition: ANIMATION_CONFIG.spring
        });
        break;
      default:
        controls.start({
          scale: CARD_SCALES.NORMAL,
          transition: ANIMATION_CONFIG.spring
        });
        lottieControls.start({
          scale: 1,
          transition: ANIMATION_CONFIG.spring
        });
        numberControls.start({
          scale: 1,
          transition: ANIMATION_CONFIG.spring
        });
    }
  }, [animationState, controls, lottieControls, numberControls]);

  // Calculate appropriate scale for the AnimatedNumber based on card state
  const getNumberScale = (state: CardState) => {
    switch (state) {
      case 'expanded':
        return 1 / CARD_SCALES.EXPANDED;
      case 'dropped':
        return 1 / CARD_SCALES.COMPACT;
      case 'initial':
      default:
        return 1;
    }
  };

  // Play lottie animation manually
  const playLottieAnimation = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    if (lottieAnimRef.current) {
      lottieAnimRef.current.goToAndStop(0, true);
      setShowNumber(false);
      
      setTimeout(() => {
        lottieAnimRef.current.play();
      }, DELAYS.REPLAY_BUTTON_ANIMATION);
    }
  };

  // Cycle through card states
  const cycleCardState = () => {
    setAnimationState(current => {
      switch (current) {
        case 'expanded':
          return 'initial';
        case 'initial':
          return 'dropped';
        default:
          return 'expanded';
      }
    });
  };

  // Start the timer when the button is shown
  useEffect(() => {
    if (animationState !== 'expanded' && !isTimerRunning) {
      // Start timer with delay
      setIsTimerRunning(true);
      setProgressTimer(100); // Start at 100%
      
      // Add delay before starting the countdown
      const delayTimeout = setTimeout(() => {
        timerRef.current = setInterval(() => {
          setProgressTimer(prev => {
            const newValue = prev - (100 * timerInterval / timerDuration);
            if (newValue <= 0) {
              // Timer finished
              if (timerRef.current) {
                clearInterval(timerRef.current);
                setIsTimerRunning(false);
              }
              return 0;
            }
            return newValue;
          });
        }, timerInterval);
      }, timerStartDelay);
      
      return () => {
        clearTimeout(delayTimeout);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [animationState]);

  // Enhanced handleButtonClick to flip the card
  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card flipping from the parent click handler
    
    // Reset timer when button is clicked
    setProgressTimer(100);
    
    // Flip the card instead of cycling states
    setIsFlipped(!isFlipped);
    if (onFlip) onFlip(!isFlipped);
    
    // Call onButtonClick if provided
    if (onButtonClick) {
      onButtonClick(e);
    }
  };

  // Get button text
  const getButtonText = () => {
    // Use custom text if provided
    if (buttonText) return buttonText;
    
    // Otherwise use default based on state
    switch (animationState) {
      case 'expanded':
        return 'Normal';
      case 'initial':
        return 'Compact';
      case 'dropped':
        return 'Expand';
      default:
        return 'Toggle';
    }
  };

  // Card flipping debug logs
  useEffect(() => {
    console.log('LocalPass: Card isFlipped state changed to:', isFlipped);
  }, [isFlipped]);

  // Add useEffect to initialize and reset isFlipped state
  useEffect(() => {
    console.log('LocalPass: Component mounted, resetting flip state');
    // Reset to front-facing
    setIsFlipped(false);
  }, []);

  // Display text value if provided, otherwise use numeric amount
  const displayAmount = textAmount || amount;

  return (
    <div className={`w-full h-full flex items-center justify-center ${className}`}>
      <motion.div
        layoutId={layoutId}
        animate={controls}
        initial={{ scale: animationState === 'expanded' ? CARD_SCALES.EXPANDED : CARD_SCALES.NORMAL }}
        className="w-[344px] h-[444px] relative cursor-pointer"
        style={{
          transformOrigin: 'center center',
          perspective: '1200px'
        }}
        onClick={() => {
          setIsFlipped(!isFlipped);
          if (onFlip) onFlip(!isFlipped);
        }}
      >
        <motion.div
          className="w-full h-full relative"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ 
            rotateY: isFlipped ? 180 : 0
          }}
          transition={{
            type: "spring",
            stiffness: 50,
            damping: 5,
            mass: 0.45,
            restSpeed: 0.001,
            velocity: 2
          }}
        >
          {/* Front of card */}
          <CardFace 
            isExpanded={animationState === 'expanded'} 
            backgroundColor={backgroundColor}
            animationState={animationState}
          >
            {frontContent ? frontContent : (
              <div className="w-full h-full flex flex-col items-center justify-between p-5">
                {/* Header with text and $ icon */}
                {animationState !== 'expanded' && (
                  <motion.div 
                    className="w-full flex flex-col items-start"
                    animate={{ 
                      opacity: animationState === 'dropped' ? 0 : 1 
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-full flex justify-between items-center">
                      <div className="text-white text-lg font-medium antialiased" style={{
                        textRendering: 'optimizeLegibility',
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale'
                      }}>{headerText}</div>
                      <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                        <span className="text-white text-xl antialiased" style={{
                          textRendering: 'optimizeLegibility',
                          WebkitFontSmoothing: 'antialiased',
                          MozOsxFontSmoothing: 'grayscale'
                        }}>$</span>
                      </div>
                    </div>
                    
                    {/* Small text under header - only visible in normal state */}
                    {animationState === 'initial' && (
                      <div className="text-white text-xs opacity-80 mt-0.5 antialiased" style={{
                        fontSize: '14px',
                        textRendering: 'optimizeLegibility',
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale'
                      }}>
                        {subheaderText}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Middle section with Lottie and AnimatedNumber */}
                <div className="flex-1 w-full flex items-center justify-center relative">
                  {/* Create a centered container for the Lottie animation */}
                  {animationState === 'expanded' && lottieAnimation && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div 
                        ref={lottieContainer}
                        animate={lottieControls}
                        initial={{ scale: 1 / CARD_SCALES.EXPANDED }}
                        style={{
                          transformOrigin: 'center center',
                          opacity: showNumber ? 0 : 1
                        }}
                      />
                    </div>
                  )}
                  
                  {/* AnimatedNumber - visible in all states when showNumber is true */}
                  {showNumber && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        transformOrigin: 'center center',
                        willChange: 'transform',
                        opacity: 1
                      }}
                      layoutId="animated-number-container"
                    >
                      <motion.div 
                        animate={numberControls}
                        initial={{ scale: getNumberScale(animationState) }}
                        style={{ 
                          transformOrigin: 'center center',
                          willChange: 'transform, opacity'
                        }}
                      >
                        <div className="flex items-center">
                          <AnimatedNumber 
                            value={parseFloat(displayAmount || '0')}
                            showDollarSign={true}
                            textContent={textAmount}
                            suffixText={animationState === 'expanded' ? suffixText : undefined}
                            suffixTextDelay={200} 
                            showDecimals={animationState === 'expanded' && cashbackAmount > 0 && !suffixText}
                            showFormattedZero={false}
                            showOnlyDollarSign={animationState === 'dropped' || cashbackAmount === 0}
                            className="text-[50px] text-white antialiased"
                          />
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                  
                  {/* Render children if provided (for backward compatibility) */}
                  {children && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {children}
                    </div>
                  )}
                </div>

                {/* Footer with button - hidden in expanded state */}
                {animationState !== 'expanded' && (
                  <div className="w-full flex flex-col items-start gap-4 px-[8px] pb-[8px]">
                    <motion.div 
                      className="w-full h-20 relative overflow-hidden rounded-full bg-black bg-opacity-10"
                      animate={{ 
                        opacity: animationState === 'dropped' ? 0 : 1 
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Progress timer bar - using transform approach like End screen */}
                      <motion.div 
                        className="absolute inset-0 bg-black bg-opacity-10" 
                        initial={{ x: '0%' }}
                        animate={{ x: `${progressTimer - 100}%` }}
                        transition={{ 
                          ease: "linear", 
                          duration: 0.05
                        }}
                      />
                      
                      {/* Button content */}
                      <button 
                        className="w-full h-full flex items-center justify-center relative z-10"
                        onClick={handleButtonClick}
                      >
                        <span className="text-2xl font-medium text-white antialiased" style={{
                          textRendering: 'optimizeLegibility',
                          WebkitFontSmoothing: 'antialiased',
                          MozOsxFontSmoothing: 'grayscale'
                        }}>{getButtonText()}</span>
                      </button>
                    </motion.div>
                  </div>
                )}
              </div>
            )}
          </CardFace>

          {/* Back of card */}
          <CardFace 
            isExpanded={animationState === 'expanded'} 
            backgroundColor={backfaceColor}
            isFlipped
            animationState={animationState}
          >
            {backContent ? backContent : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8">
                <h3 className="text-2xl font-medium text-white mb-6">Scan to Cash Out</h3>
                
                {/* QR code container with better containment */}
                <div 
                  className="relative mb-6 overflow-hidden"
                  style={{ maxHeight: '300px' }}
                >
                  <AnimatedQRCode
                    value={`https://cash.app/${amount ? amount : '10'}`}
                    size={260}
                    autoAnimate={isFlipped}
                    pattern="outside-in"
                    speed={1.0}
                    darkColor="#FFFFFF"
                    lightColor="transparent"
                    placeholderOpacity={0.5}
                    logo="cash-icon"
                    className="max-h-[260px] overflow-hidden"
                    onAnimationComplete={() => {
                      console.log("QR animation complete");
                    }}
                  />
                </div>
                
                <p className="text-white/70 text-lg">
                  Open Cash App to scan
                </p>
              </div>
            )}
          </CardFace>
        </motion.div>
      </motion.div>
    </div>
  );
}; 