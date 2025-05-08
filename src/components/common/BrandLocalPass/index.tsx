import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import lottie from 'lottie-web';
import { AnimatedNumber } from '../AnimatedNumber';
import { AnimatedQRCode } from '../AnimatedQRCode';

/**
 * A brand-themed card component that can expand to show additional content with animations.
 * Based on LocalPass but with brand-specific theming and customizations.
 * 
 * @component
 * @example
 * ```tsx
 * <BrandLocalPass
 *   layoutId="brand-amount-1"
 *   amount="1"
 *   isExpanded={false}
 *   onClick={() => handleClick()}
 *   brandColor="bg-[#FF5722]"
 *   brandName="Nike"
 * />
 * ```
 */

// ============= Types =============
/**
 * The states a BrandLocalPass card can be in
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
 * Props for the BrandLocalPass component
 */
export interface BrandLocalPassProps {
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

  // Brand-specific props
  /** Brand name to display in the header */
  brandName?: string;
  
  /** Brand logo URL or SVG component */
  brandLogo?: string | React.ReactNode;
  
  /** Brand main color (CSS color string) */
  brandColor?: string;
  
  /** Brand accent color (CSS color string) */
  brandAccentColor?: string;
  
  /** Subtext to describe the brand rewards */
  brandSubtext?: string;
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
 * BrandLocalPass component with brand-specific theming, animations, and interactions.
 * Based on LocalPass but adapted for brand partnerships and promotions.
 * 
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <BrandLocalPass
 *   brandName="Nike"
 *   brandColor="bg-[#FF5722]"
 *   amount="25.50"
 *   isExpanded={false}
 *   onClick={() => handleClick()}
 * />
 * 
 * // Enhanced usage
 * <BrandLocalPass 
 *   initialValue={25.75}
 *   initialState="initial"
 *   brandName="Starbucks"
 *   brandColor="bg-[#006241]"
 *   brandAccentColor="bg-[#1E3932]"
 *   brandSubtext="Rewards on every purchase"
 *   buttonText="Redeem"
 *   onButtonClick={() => console.log('Button clicked')}
 * />
 * ```
 */
export const BrandLocalPass: React.FC<BrandLocalPassProps> = ({
  // Handle both new and legacy props
  initialState,
  backgroundColor,
  backfaceColor,
  lottieAnimation,
  initialValue,
  useRandomValues = true,
  randomMin = 10,
  randomMax = 50,
  buttonText = 'Redeem',
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
  flipped: controlledFlipped,
  disableAnimation = false,
  animateIn = 'random',
  sessionId,
  
  // Brand-specific props
  brandName = 'Brand',
  brandLogo,
  brandColor = 'bg-[#FF5722]',
  brandAccentColor,
  brandSubtext = 'Rewards earned on purchases',
}) => {
  // Use either new API's initialState or legacy isExpanded prop
  const [cardState, setCardState] = useState<CardState>(
    initialState || (isExpanded ? 'expanded' : 'initial')
  );
  const [currentValue, setCurrentValue] = useState<number>(
    parseInt(amount || '0') || initialValue || 0
  );
  
  // Determine background colors for front/back, prioritizing brand colors
  const finalBackgroundColor = backgroundColor || brandColor;
  const finalBackfaceColor = backfaceColor || brandAccentColor || finalBackgroundColor;
  
  // Animation controllers
  const controls = useAnimation();
  const buttonControls = useAnimation();
  const numberControls = useAnimation();
  const cardControls = useAnimation();
  
  // State for internal tracking
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFlipped, setIsFlipped] = useState(initialFlipped);
  const [displayZero, setDisplayZero] = useState(false);
  const [qrShown, setQRShown] = useState(false);
  
  // Refs for DOM elements
  const containerRef = useRef<HTMLDivElement>(null);
  const animationContainerRef = useRef<HTMLDivElement>(null);
  const lottieInstance = useRef<any>(null);
  
  // This effect handles changes to the controlled flipped prop
  useEffect(() => {
    if (controlledFlipped !== undefined && controlledFlipped !== isFlipped) {
      setIsFlipped(controlledFlipped);
      if (onFlip) onFlip(controlledFlipped);
    }
  }, [controlledFlipped, onFlip]);
  
  // Handle changes to the cardState state or isExpanded prop
  useEffect(() => {
    if (isExpanded !== undefined) {
      const newState = isExpanded ? 'expanded' : 'initial';
      if (newState !== cardState) {
        setCardState(newState);
        if (onStateChange) onStateChange(newState);
      }
    }
  }, [isExpanded, cardState, onStateChange]);
  
  // Initialize Lottie animation on mount
  useEffect(() => {
    if (lottieAnimation && animationContainerRef.current) {
      lottieInstance.current = lottie.loadAnimation({
        container: animationContainerRef.current,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: lottieAnimation,
      });
      
      // Cleanup on unmount
      return () => {
        if (lottieInstance.current) {
          lottieInstance.current.destroy();
        }
      };
    }
  }, [lottieAnimation]);
  
  // Auto-play animation if enabled
  useEffect(() => {
    if (autoPlay && !noAnimation) {
      const timer = setTimeout(() => {
        playLottieAnimation();
        numberControls.start({
          opacity: 1,
          scale: getNumberScale(cardState),
          transition: ANIMATION_CONFIG.spring,
        });
      }, DELAYS.INITIAL_ANIMATION + animationDelay);
      
      return () => clearTimeout(timer);
    }
  }, [autoPlay, noAnimation, animationDelay]);
  
  /**
   * Generates a random amount within the configured range
   */
  const generateRandomAmount = () => {
    const randomValue = Math.floor(Math.random() * (randomMax - randomMin + 1) + randomMin);
    setCurrentValue(randomValue);
    return randomValue;
  };
  
  /**
   * Handles the completion of the Lottie animation
   */
  const handleAnimationComplete = () => {
    setIsAnimating(false);
    if (useRandomValues) {
      generateRandomAmount();
    }
    if (onAnimationComplete) {
      onAnimationComplete();
    }
  };
  
  /**
   * Returns the appropriate scale for number based on card state
   */
  const getNumberScale = (state: CardState) => {
    switch (state) {
      case 'expanded':
        return 1.8;
      case 'initial':
        return 1;
      case 'dropped':
        return 0.9;
      default:
        return 1;
    }
  };
  
  /**
   * Plays the Lottie animation
   */
  const playLottieAnimation = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    if (isAnimating || !lottieInstance.current) return;
    
    setIsAnimating(true);
    lottieInstance.current.goToAndPlay(0);
    
    // If animation completes
    lottieInstance.current.addEventListener('complete', handleAnimationComplete);
  };
  
  /**
   * Cycle through card states (expanded -> initial -> dropped)
   */
  const cycleCardState = () => {
    let nextState: CardState;
    
    switch (cardState) {
      case 'initial':
        nextState = 'expanded';
        break;
      case 'expanded':
        nextState = 'dropped';
        break;
      case 'dropped':
      default:
        nextState = 'initial';
    }
    
    setCardState(nextState);
    
    // Execute callbacks if provided
    if (onStateChange) {
      onStateChange(nextState);
    }
    
    if (onClick && nextState === 'expanded') {
      onClick();
    }
    
    // Adjust number size based on state
    numberControls.start({
      scale: getNumberScale(nextState),
      transition: ANIMATION_CONFIG.spring
    });
  };
  
  /**
   * Flip the card when QR code is clicked
   */
  const handleCardFlip = () => {
    const newFlipped = !isFlipped;
    setIsFlipped(newFlipped);
    
    if (onFlip) {
      onFlip(newFlipped);
    }
    
    // In expanded state, show QR code when flipped
    if (cardState === 'expanded' && newFlipped) {
      setQRShown(true);
    }
  };
  
  /**
   * Handle button clicks, preventing event propagation
   */
  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (onButtonClick) {
      onButtonClick(e);
    } else {
      playLottieAnimation(e);
    }
  };
  
  /**
   * Get appropriate button text based on card state
   */
  const getButtonText = () => {
    switch (cardState) {
      case 'expanded':
        return buttonText;
      case 'initial':
        return buttonText;
      case 'dropped':
        return buttonText;
      default:
        return buttonText;
    }
  };
  
  /**
   * Get the appropriate styling for the current card state
   */
  const getCardStyles = () => {
    switch (cardState) {
      case 'expanded':
        return {
          width: '100%',
          height: '100%',
          scale: CARD_SCALES.EXPANDED,
          transition: ANIMATION_CONFIG.spring
        };
      case 'initial':
        return {
          width: '300px',
          height: '180px',
          scale: CARD_SCALES.NORMAL,
          transition: ANIMATION_CONFIG.spring
        };
      case 'dropped':
        return {
          width: '280px',
          height: '160px',
          scale: CARD_SCALES.COMPACT,
          transition: ANIMATION_CONFIG.spring
        };
      default:
        return {
          width: '300px',
          height: '180px',
          scale: CARD_SCALES.NORMAL,
          transition: ANIMATION_CONFIG.spring
        };
    }
  };
  
  // ================= Render ==================
  return (
    <motion.div
      ref={containerRef}
      className={`relative ${className} ${cardState === 'expanded' ? 'absolute inset-0 z-50' : 'flex-none'}`}
      initial={false}
      animate={getCardStyles()}
      onClick={cycleCardState}
      layoutId={layoutId}
      style={{ 
        perspective: 1200,
        transformStyle: 'preserve-3d'
      }}
    >
      <motion.div
        className="relative w-full h-full rounded-[32px] cursor-pointer transform-gpu"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{
          rotateY: isFlipped ? 180 : 0,
        }}
        transition={{ 
          type: 'spring',
          stiffness: 160,
          damping: 22
        }}
      >
        {/* Front Face */}
        <CardFace
          isExpanded={cardState === 'expanded'}
          backgroundColor={finalBackgroundColor}
          animationState={cardState}
        >
          {frontContent || (
            <div className="flex flex-col h-full w-full relative overflow-hidden p-5">
              {/* Header Section */}
              {showHeader && (
                <div className="z-10 flex items-center">
                  {/* Brand Logo */}
                  {brandLogo ? (
                    typeof brandLogo === 'string' ? (
                      <img src={brandLogo} alt={`${brandName} logo`} className="h-6 mr-2" />
                    ) : (
                      brandLogo
                    )
                  ) : (
                    <div className="w-6 h-6 rounded-full mr-2 flex items-center justify-center text-white text-xs font-bold bg-white/20">
                      {brandName.charAt(0)}
                    </div>
                  )}
                  <div className="text-white font-medium">{brandName}</div>
                </div>
              )}
              
              {/* Amount Display */}
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    <motion.div
                      animate={numberControls}
                      initial={{ opacity: 0, scale: 0.8 }}
                      className="text-white font-bold flex items-center"
                      style={{ fontSize: cardState === 'expanded' ? '64px' : '48px' }}
                    >
                      {textAmount ? (
                        <div>{textAmount}</div>
                      ) : (
                        <>
                          $<AnimatedNumber
                            value={currentValue}
                          />
                          {suffixText && <span className="ml-2 text-2xl">{suffixText}</span>}
                        </>
                      )}
                    </motion.div>
                  </div>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: cardState === 'expanded' ? 1 : 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-white/80 text-sm mt-2"
                  >
                    {brandSubtext}
                  </motion.div>
                </div>
              </div>
              
              {/* Animation Container */}
              <div 
                ref={animationContainerRef}
                className="absolute top-0 left-0 right-0 bottom-0 z-0 opacity-20"
              />
              
              {/* Button Section */}
              {showButton && cardState === 'expanded' && (
                <motion.div 
                  className="mt-auto z-10"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <button
                    className="w-full py-3 px-4 text-white font-medium text-base rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 transition-colors"
                    onClick={handleButtonClick}
                  >
                    {getButtonText()}
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </CardFace>
        
        {/* Back Face (QR Code) */}
        <CardFace
          isExpanded={cardState === 'expanded'}
          backgroundColor={finalBackfaceColor}
          isFlipped={true}
          animationState={cardState}
        >
          {backContent || (
            <div className="flex flex-col h-full w-full items-center justify-center p-5">
              <div className="text-white font-medium mb-3">{brandName} QR Code</div>
              {/* QR Code */}
              <div className="w-56 h-56 bg-white p-3 rounded-lg">
                <AnimatedQRCode
                  value={sessionId ? `https://chrisk.ngrok.app/scan/${sessionId}` : `https://cash.app/${brandName.toLowerCase()}`}
                  size={212}
                  animateIn={disableAnimation ? false : animateIn}
                  visible={qrShown}
                />
              </div>
              <div className="text-white/70 text-sm mt-3">
                Scan to redeem your {brandName} rewards
              </div>
            </div>
          )}
        </CardFace>
      </motion.div>
      
      {/* Card flip button */}
      {cardState === 'expanded' && (
        <motion.button
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center z-20"
          onClick={(e) => {
            e.stopPropagation();
            handleCardFlip();
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          aria-label="Flip card"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </motion.button>
      )}
      
      {/* Expanded state children */}
      {cardState === 'expanded' && children && (
        <div className="absolute inset-0 z-30 pointer-events-none">
          {children}
        </div>
      )}
    </motion.div>
  );
}; 