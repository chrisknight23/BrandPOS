import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import lottie from 'lottie-web';
import { AnimatedNumber } from '../AnimatedNumber';
import { AnimatedQRCode } from '../AnimatedQRCode';
import LocalCashIcon from '../../../assets/images/Local-Cash-24px.svg';
import MileendbagelLogo from '../../../assets/images/logos/mileendbagel.png';

/**
 * A card component that can expand to show additional content with animations.
 * Enhanced version with physics-based animations and additional customization options.
 * 
 * @component
 * @example
 * ```tsx
 * <BrandPass
 *   layoutId="amount-1"
 *   amount="1"
 *   isExpanded={false}
 *   onClick={() => handleClick()}
 * />
 * ```
 */

// ============= Types =============
/**
 * The states a BrandPass card can be in
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
 * Props for the BrandPass component
 */
export interface BrandPassProps {
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

  /** Show or hide the button in the card footer */
  showButton?: boolean;

  /** Show or hide the header section in the card */
  showHeader?: boolean;

  /** Whether the card should start flipped to the back side */
  initialFlipped?: boolean;

  /** Controlled prop to set the flipped state of the card (front/back) */
  flipped?: boolean;

  /** Show or hide the QR code animation */
  disableAnimation?: boolean;

  /** Animation pattern for QR code entry */
  animateIn?: 'random' | 'inside-out' | 'outside-in' | 'wave' | 'sequential' | false;

  /** Session ID for QR scan tracking */
  sessionId?: string;
  
  /** Show or hide the progress timer */
  showProgressTimer?: boolean;
}

// ============= Constants =============
const CARD_SCALES = {
  EXPANDED: 1.0,
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
    className={`w-full h-full ${backgroundColor} rounded-[32px] absolute backface-hidden border-t border-white/20`}
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
 * BrandPass component with animations, state transitions, and interactive elements.
 * Enhanced version with physics-based animations and additional customization options.
 * 
 * @component
 * @example
 * ```tsx
 * // Basic usage (backward compatible)
 * <BrandPass
 *   amount="25.50"
 *   isExpanded={false}
 *   onClick={() => handleClick()}
 * />
 * 
 * // Enhanced usage
 * <BrandPass 
 *   initialValue={25.75}
 *   initialState="initial"
 *   backgroundColor="bg-[#00B843]"
 *   headerText="Local Cash"
 *   onButtonClick={() => console.log('Button clicked')}
 * />
 * ```
 */
export const BrandPass: React.FC<BrandPassProps> = ({
  // Handle both new and legacy props
  initialState,
  backgroundColor = 'bg-[#96151D]',
  backfaceColor = 'bg-[#6A0F15]',
  lottieAnimation,
  initialValue,
  useRandomValues = true,
  randomMin = 10,
  randomMax = 50,
  headerText = 'Coava',
  subheaderText = '',
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
  noAnimation = false,
  
  // New props
  showButton = true,
  showHeader = true,
  initialFlipped = false,
  flipped,
  disableAnimation,
  animateIn,
  sessionId,
  showProgressTimer = true,
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
  const [isFlipped, setIsFlipped] = useState(
    typeof flipped === 'boolean' ? flipped : initialFlipped
  );
  const lottieContainer = useRef<HTMLDivElement>(null);
  const lottieAnimRef = useRef<any>(null);
  const prevAnimationState = useRef<CardState>(animationState);
  
  // Update animation state when initialState prop changes
  useEffect(() => {
    console.log(`BrandPass: initialState prop changed to ${initialState}`);
    if (initialState) {
      console.log(`BrandPass: Updating internal animationState to ${initialState}`);
      
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
              console.log(`BrandPass: Playing animation after initialState change to expanded (delay: ${animationDelay}ms)`);
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
    
    console.log('BrandPass: Initializing Lottie animation');
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
          setShowNumber(false);
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
              console.log('BrandPass: Animation sequence complete, calling onAnimationComplete');
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
          console.log(`BrandPass: Starting Lottie animation (delay: ${animationDelay}ms)`);
          if (lottieAnimRef.current) {
            lottieAnimRef.current.play();
          }
        }, animationDelay || 50); // Use custom delay or small default delay
      }
    } else {
      // If no lottie animation, just show the number
      setShowNumber(false);
    }

    return () => {
      console.log('BrandPass: Cleaning up Lottie animation');
      if (anim) {
        anim.removeEventListener('complete');
        anim.destroy();
      }
    };
  }, [animationState, lottieAnimation, noAnimation, autoPlay, initialState]); // Add initialState to dependencies

  // Handle animation when card state changes
  useEffect(() => {
    console.log(`BrandPass: Card state changed to ${animationState} from ${prevAnimationState.current}`);
    if (animationState === 'expanded' && prevAnimationState.current !== 'expanded') {
      if (lottieAnimRef.current) {
        // Reset animation
        lottieAnimRef.current.goToAndStop(0, true);
        setShowNumber(false);
        
        // Play lottie animation after card expansion
        setTimeout(() => {
          console.log(`BrandPass: Playing Lottie animation after state change (delay: ${animationDelay}ms)`);
          lottieAnimRef.current.play();
          // Number will be shown via the 'complete' event listener now
        }, animationDelay || DELAYS.EXPANDED_ANIMATION);
      } else {
        // If no lottie animation, just show the number
        setShowNumber(false);
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
    if (showProgressTimer && animationState !== 'expanded' && !isTimerRunning) {
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
  }, [animationState, showProgressTimer]);

  // Enhanced handleButtonClick to flip the card
  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card flipping from the parent click handler
    
    // Reset timer when button is clicked
    setProgressTimer(100);
    
    // Only flip the card if not in expanded state
    if (animationState !== 'expanded') {
      setIsFlipped(!isFlipped);
      if (onFlip) onFlip(!isFlipped);
    }
    
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

  // Log flip changes
  useEffect(() => {
    console.log('BrandPass: Card isFlipped state changed to:', isFlipped);
  }, [isFlipped, onFlip]);

  useEffect(() => {
    console.log('BrandPass: Component mounted, setting initial flip state');
  }, []);

  // If the 'flipped' prop is provided, use it as the source of truth
  useEffect(() => {
    if (typeof flipped === 'boolean') {
      setIsFlipped(flipped);
    }
  }, [flipped]);

  // Display text value if provided, otherwise use numeric amount
  const displayAmount = textAmount || amount;

  // Add at the top of the component (inside BrandPass):
  const apiBase = import.meta.env.VITE_API_BASE_URL;



  return (
    <div className={`w-full h-full flex items-center justify-center ${className}`}>
      {/* Main card container */}
      <motion.div
        layoutId={layoutId}
        animate={{
          scale: animationState === 'expanded' ? CARD_SCALES.EXPANDED : CARD_SCALES.NORMAL,
        }}
        initial={{ 
          scale: animationState === 'expanded' ? CARD_SCALES.EXPANDED : CARD_SCALES.NORMAL,
        }}
        className={`relative ${animationState === 'expanded' ? 'cursor-default' : 'cursor-pointer'}`}
        style={{
          width: '361px',
          height: '480px',
          transformOrigin: 'center center',
          perspective: '1200px'
        }}
        transition={{ 
          duration: 0.6, 
          ease: "easeOut" 
        }}
        onClick={() => {
          // If external onClick is provided, use that instead of flipping
          if (onClick) {
            onClick();
          } else {
            // Only allow flipping when not in expanded state
            if (animationState !== 'expanded') {
              setIsFlipped(!isFlipped);
              if (onFlip) onFlip(!isFlipped);
            }
          }
        }}
      >
        <motion.div
          className="w-full h-full relative"
          style={{ transformStyle: 'preserve-3d' }}
          initial={{ rotateY: isFlipped ? 180 : 0 }}
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
              <div className="w-full h-full flex flex-col items-center justify-center p-5 gap-6">
                {/* Header with text and $ icon */}
                {animationState !== 'expanded' && showHeader && (
                  <motion.div 
                    className="w-full flex flex-col items-start"
                    animate={{ 
                      opacity: animationState === 'dropped' ? 0 : 1 
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-full flex justify-between items-center">
                      <div className="text-white text-base font-medium antialiased" style={{
                        textRendering: 'optimizeLegibility',
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale'
                      }}>{headerText}</div>
                    </div>
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
                  
                  {/* Mileendbagel Logo */}
                  <div className="flex items-center justify-center">
                    <img src={MileendbagelLogo} alt="Mileendbagel" className="w-auto h-auto max-w-[260px] max-h-[260px] object-contain" />
                  </div>
                  
                  {/* Render children if provided (for backward compatibility) */}
                  {children && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {children}
                    </div>
                  )}
                </div>

                {/* Footer with button - hidden in expanded state */}
                {animationState !== 'expanded' && showButton && (
                  <div className="w-full flex flex-col items-start gap-4 px-[8px] pb-[8px]">
                    <motion.div 
                      className="w-full h-[72px] relative overflow-hidden rounded-full bg-black bg-opacity-20"
                      animate={{ 
                        opacity: animationState === 'dropped' ? 0 : 1 
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Progress timer bar - using transform approach like End screen */}
                      {showProgressTimer && (
                        <motion.div 
                          className="absolute inset-0 bg-black bg-opacity-10" 
                          initial={{ x: '0%' }}
                          animate={{ x: `${progressTimer - 100}%` }}
                          transition={{ 
                            ease: "linear", 
                            duration: 0.05
                          }}
                        />
                      )}
                      
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
                    value={sessionId ? `https://chrisk.ngrok.app/landing/${sessionId}` : `${apiBase}/${amount ? amount : '10'}`}
                    size={260}
                    animateIn={typeof animateIn !== 'undefined' ? animateIn : (typeof disableAnimation === 'boolean' ? (disableAnimation ? false : 'outside-in') : (isFlipped ? 'outside-in' : false))}
                    disableAnimation={typeof disableAnimation === 'boolean' ? disableAnimation : !isFlipped}
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

                {/* Back Content */}
                <div className="flex-1 p-4 flex flex-col items-center justify-center text-white">
                  <p className="text-center">{subheaderText}</p>
                </div>
              </div>
            )}
                      </CardFace>
          </motion.div>
      </motion.div>
    </div>
  );
}; 