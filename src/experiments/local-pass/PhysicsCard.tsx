import { motion, useAnimation } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import cashBackAnimation from '../../assets/CashBackLogo.json';
import { AnimatedNumber } from '../../components/common/AnimatedNumber';

// ============= Types =============
type CardState = 'expanded' | 'initial' | 'dropped';

interface CardFaceProps {
  children: React.ReactNode;
  isExpanded: boolean;
  backgroundColor: string;
  isFlipped?: boolean;
  animationState: CardState;
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
  }
} as const;

// Animation timing constants
const DELAYS = {
  INITIAL_ANIMATION: 1000,   // Initial animation delay on component mount
  EXPANDED_ANIMATION: 650,   // Delay before playing animation in expanded state
  REPLAY_BUTTON_ANIMATION: 200,  // Delay when manually replaying animation
  NUMBER_ANIMATION: 1500,     // Delay before showing the animated number
  ZERO_DISPLAY_DURATION: 1200, // How long to display 0.00 before animating
} as const;

// ============= Components =============
const CardFace: React.FC<CardFaceProps> = ({ 
  children, 
  isExpanded, 
  backgroundColor,
  isFlipped,
  animationState
}) => (
  <motion.div
    className={`w-full h-full ${backgroundColor} rounded-2xl absolute backface-hidden`}
    style={{
      boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
      willChange: 'transform',
      backfaceVisibility: 'hidden',
      transform: isFlipped ? 'rotateY(180deg)' : undefined,
      transformStyle: 'preserve-3d'
    }}
  >
    {/* Lighting gradient overlay */}
    <div 
      className="absolute inset-0 rounded-2xl"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 100%)',
        pointerEvents: 'none'
      }}
    />
    
    {children}

    {/* Edge highlight */}
    <div 
      className="absolute inset-0 rounded-2xl"
      style={{
        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.3), inset -1px -1px 1px rgba(0,0,0,0.2)'
      }}
    />
  </motion.div>
);

// ============= Main Component =============
export const PhysicsCard = () => {
  const controls = useAnimation();
  const lottieControls = useAnimation();
  const [animationState, setAnimationState] = useState<CardState>('initial');
  const [isFlipped, setIsFlipped] = useState(false);
  const lottieContainer = useRef<HTMLDivElement>(null);
  const lottieAnimRef = useRef<any>(null);
  const prevAnimationState = useRef<CardState>(animationState);
  
  // Simple number state
  const [showNumber, setShowNumber] = useState(false);
  const [cashbackAmount, setCashbackAmount] = useState(0);

  // Initialize Lottie
  useEffect(() => {
    let anim: any = null;
    
    if (lottieContainer.current) {
      anim = lottie.loadAnimation({
        container: lottieContainer.current,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: cashBackAnimation,
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
          // Show the number after the lottie animation completes
          setShowNumber(true);
          setCashbackAmount(0);
          
          // Then after a delay, update to the final amount to trigger animation
          setTimeout(() => {
            setCashbackAmount(3.00); // Animate to exactly $3.00
          }, DELAYS.ZERO_DISPLAY_DURATION);
        }
      });

      lottieAnimRef.current = anim;

      // Start animation after a delay
      setTimeout(() => {
        anim.play();
      }, DELAYS.INITIAL_ANIMATION);
    }

    return () => {
      if (anim) {
        anim.removeEventListener('complete');
        anim.destroy();
      }
    };
  }, [animationState]);

  // Handle animation when card state changes
  useEffect(() => {
    if (animationState === 'expanded' && prevAnimationState.current !== 'expanded') {
      if (lottieAnimRef.current) {
        // Reset animation
        lottieAnimRef.current.goToAndStop(0, true);
        setShowNumber(false);
        
        // Play lottie animation after card expansion
        setTimeout(() => {
          lottieAnimRef.current.play();
          // Number will be shown via the 'complete' event listener now
        }, DELAYS.EXPANDED_ANIMATION);
      }
    } else if (prevAnimationState.current === 'expanded' && animationState !== 'expanded') {
      // Keep number visible when leaving expanded state, but don't show it if it wasn't showing before
      // Don't reset the number state when transitioning to normal/compact
    }
    
    // Update previous state
    prevAnimationState.current = animationState;
  }, [animationState]);

  // Calculate counter-scale
  const getLottieScale = (state: CardState) => {
    switch (state) {
      case 'expanded':
        return 1 / CARD_SCALES.EXPANDED;
      case 'dropped':
        return 1 / CARD_SCALES.COMPACT;
      default:
        return 1;
    }
  };

  // Get button text
  const getButtonText = () => {
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
    }
  }, [animationState, controls, lottieControls]);

  // Play lottie animation manually
  const playLottieAnimation = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    if (lottieAnimRef.current) {
      lottieAnimRef.current.goToAndStop(0, true);
      setShowNumber(false);
      
      setTimeout(() => {
        lottieAnimRef.current.play();
        // Number will be shown via the 'complete' event listener
      }, DELAYS.REPLAY_BUTTON_ANIMATION);
    }
  };

  // Calculate appropriate scale for the AnimatedNumber based on card state
  const getNumberScale = (state: CardState) => {
    switch (state) {
      case 'expanded':
        return 1 / CARD_SCALES.EXPANDED;
      case 'dropped':
        return 1 / CARD_SCALES.COMPACT;
      default:
        return 1; // Normal state doesn't need counter-scaling
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-[#001707]">
      {/* State toggle button */}
      <div className="fixed top-4 left-4">
        <button
          className="px-6 py-3 rounded-full text-white transition-colors bg-[#00D64F] hover:bg-[#00C048]"
          onClick={() => {
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
          }}
        >
          {getButtonText()}
        </button>
      </div>

      {/* Replay button - Only show in expanded state */}
      {animationState === 'expanded' && (
        <div className="fixed top-4 left-40">
          <button
            className="px-6 py-3 rounded-full text-white transition-colors bg-[#00B843] hover:bg-[#00A03B]"
            onClick={playLottieAnimation}
          >
            Replay Animation
          </button>
        </div>
      )}

      <motion.div
        animate={controls}
        initial={{ scale: CARD_SCALES.NORMAL }}
        className="w-[344px] h-[444px] relative cursor-pointer"
        style={{
          transformOrigin: 'center center',
          perspective: '1200px'
        }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="w-full h-full relative"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ 
            rotateY: isFlipped ? 180 : 0,
            z: isFlipped ? 50 : 0
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
            backgroundColor="bg-[#00B843]"
            animationState={animationState}
          >
            <div className="w-full h-full flex items-center justify-center">
              {/* Lottie Animation - only visible in expanded state */}
              <motion.div 
                ref={lottieContainer}
                className="absolute inset-0 flex items-center justify-center"
                animate={lottieControls}
                initial={{ scale: 1 }}
                style={{
                  transformOrigin: 'center center',
                  opacity: showNumber && animationState === 'expanded' ? 0 : animationState === 'expanded' ? 1 : 0
                }}
              >
                {/* Lottie container with fixed dimensions */}
                <div className="w-[200px] h-[200px]" style={{
                  imageRendering: 'crisp-edges',
                  shapeRendering: 'geometricPrecision'
                }}/>
              </motion.div>
              
              {/* AnimatedNumber - Absolutely positioned to center and visible in all states when showNumber is true */}
              {showNumber && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    transformOrigin: 'center center',
                    scale: getNumberScale(animationState)
                  }}
                >
                  <AnimatedNumber 
                    value={cashbackAmount}
                    showDecimals={true}
                    showFormattedZero={true}
                    className="text-[60px]"
                  />
                </motion.div>
              )}
            </div>
          </CardFace>

          {/* Back of card */}
          <CardFace 
            isExpanded={animationState === 'expanded'} 
            backgroundColor="bg-[#004D1C]"
            isFlipped
            animationState={animationState}
          >
            <div className="w-full h-full flex items-center justify-center relative">
              <div className="text-white/50 text-xl">Back</div>
            </div>
          </CardFace>
        </motion.div>
      </motion.div>
    </div>
  );
}; 