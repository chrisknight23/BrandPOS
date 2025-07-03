import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ScreensaverMessagingProps {
  /** Whether the messaging should be visible */
  isVisible?: boolean;
  /** Delay before starting animations (in milliseconds) */
  startDelay?: number;
  /** Brand name to display in messaging */
  brandName?: string;
  /** Custom class name for the container */
  className?: string;
  /** Whether this is being used in a static fullscreen context */
  isStaticFullscreen?: boolean;
}

export const ScreensaverMessaging: React.FC<ScreensaverMessagingProps> = ({
  isVisible = false,
  startDelay = 500,
  brandName = '$mileendbagel',
  className = '',
  isStaticFullscreen = false,
}) => {
  const [animationPhase, setAnimationPhase] = useState<'ready' | 'fadeIn' | 'visible'>('ready');

  useEffect(() => {
    if (!isVisible) {
      setAnimationPhase('ready');
      return;
    }

    // For static fullscreen, skip animation and go directly to visible
    if (isStaticFullscreen) {
      setAnimationPhase('visible');
      return;
    }

    // Start fading in immediately when card begins expand phase (during flip)
    setAnimationPhase('fadeIn');
    
    // Move to visible phase after fade in completes
    const visibleTimer = setTimeout(() => {
      setAnimationPhase('visible');
    }, 800);

    return () => clearTimeout(visibleTimer);
  }, [isVisible, isStaticFullscreen]);

  if (!isVisible) return null;

  return (
    <div className={`absolute flex flex-col items-center justify-center text-white ${className}`} 
         style={{ 
           width: '800px', 
           height: '500px',
           top: '50%',
           left: '50%',
           transform: 'translate(-50%, -50%)'
         }}>
      <AnimatePresence>
        {animationPhase !== 'ready' && (
          <motion.div
            initial={{ 
              opacity: isStaticFullscreen ? 1 : 0, 
              rotate: isStaticFullscreen ? 270 : -90, 
              scale: isStaticFullscreen ? 1 / 1.38 : 1, 
              scaleX: isStaticFullscreen ? -1 : 1 
            }}
            animate={{ 
              opacity: 1, 
              rotate: isStaticFullscreen ? 270 : -90,
              scale: 1 / 1.38, // Counter-scale to maintain original text size (1.38 is the card's expand scale)
              scaleX: isStaticFullscreen ? -1 : 1 // Flip horizontally for static fullscreen
            }}
            exit={{ opacity: 0, rotate: isStaticFullscreen ? 270 : -90, scale: 1, scaleX: isStaticFullscreen ? -1 : 1 }}
            transition={{
              duration: isStaticFullscreen ? 0 : 0.8,
              ease: [0.32, 0.72, 0, 1]
            }}
            className="flex flex-col items-center justify-center"
            style={{ transformOrigin: 'center center' }}
          >
            {/* Main Message */}
            <motion.div
              initial={{ opacity: isStaticFullscreen ? 1 : 0, y: isStaticFullscreen ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: isStaticFullscreen ? 0 : 0.8,
                ease: [0.32, 0.72, 0, 1]
              }}
              className="text-center"
              style={{ width: '600px' }} // Ensure enough width for the text
            >
              <h1 
                className="text-[90px] font-cash font-medium text-center leading-[0.85] tracking-[-0.02em]"
                dangerouslySetInnerHTML={{ __html: "Follow us and<br/>earn rewards" }}
              />
            </motion.div>


          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 