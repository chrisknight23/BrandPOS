import { motion, useAnimation } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import cashBackAnimation from '../../assets/CashBackLogo.json';

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
  EXPANDED: 1.8,
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
  const lottieControls = useAnimation(); // Separate controls for the Lottie animation
  const [animationState, setAnimationState] = useState<CardState>('initial');
  const [isFlipped, setIsFlipped] = useState(false);
  const lottieContainer = useRef<HTMLDivElement>(null);
  const lottieAnimRef = useRef<any>(null);

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

      lottieAnimRef.current = anim;

      // Start animation after a delay
      setTimeout(() => {
        anim.play();
      }, 1000);
    }

    return () => {
      if (anim) {
        anim.destroy();
      }
    };
  }, []);

  // Calculate the counter-scale for the Lottie animation based on card state
  const getLottieScale = (state: CardState) => {
    switch (state) {
      case 'expanded':
        return 1 / CARD_SCALES.EXPANDED; // Counter-scale to maintain normal size
      case 'dropped':
        return 1; // No counter-scale, let it scale down with card
      default:
        return 1; // Normal state, no scaling needed
    }
  };

  // Get the button text based on the current state and what the next state will be
  const getButtonText = () => {
    switch (animationState) {
      case 'expanded':
        return 'Normal'; // When expanded, clicking will return to normal size
      case 'initial':
        return 'Compact'; // When at normal size, clicking will make it compact
      case 'dropped':
        return 'Expand'; // When compact, clicking will expand it
      default:
        return 'Toggle';
    }
  };

  useEffect(() => {
    // Animate card scale
    switch (animationState) {
      case 'dropped':
        controls.start({
          scale: CARD_SCALES.COMPACT,
          transition: ANIMATION_CONFIG.spring
        });
        // No counter-scale needed for Lottie in compact state
        lottieControls.start({
          scale: 1,
          transition: ANIMATION_CONFIG.spring
        });
        break;
      case 'expanded':
        controls.start({
          scale: CARD_SCALES.EXPANDED,
          transition: ANIMATION_CONFIG.spring
        });
        // Counter-scale Lottie to maintain its normal size
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
        // Reset Lottie to normal scale
        lottieControls.start({
          scale: 1,
          transition: ANIMATION_CONFIG.spring
        });
    }
  }, [animationState, controls, lottieControls]);

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
            <div className="w-full h-full flex items-center justify-center relative">
              <motion.div 
                ref={lottieContainer}
                className="w-[200px] h-[200px]"
                animate={lottieControls}
                initial={{ scale: 1 }}
                style={{
                  imageRendering: 'crisp-edges',
                  shapeRendering: 'geometricPrecision',
                  transformOrigin: 'center center'
                }}
              />
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