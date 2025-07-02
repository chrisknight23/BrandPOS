import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Screensaver animation phases
type ScreensaverPhase = 'drop' | 'rotate' | 'expand';

export interface ScreensaverCardProps {
  /** Background color for the card (CSS color string) */
  backgroundColor?: string;
  /** Background color for the back of the card (CSS color string) */
  backfaceColor?: string;
  /** Brand name to display */
  brandName?: string;
  /** Subtitle text */
  subtitle?: string;
  /** Custom class name for the card container */
  className?: string;
  /** Whether to start the screensaver animation immediately */
  autoStart?: boolean;
  /** Delay before starting the animation sequence */
  startDelay?: number;
}

export const ScreensaverCard: React.FC<ScreensaverCardProps> = ({
  backgroundColor = 'bg-[#5D5D3F]',
  backfaceColor = 'bg-[#4A4A32]',
  brandName = '$mileendbagel',
  subtitle = 'Screensaver Mode',
  className = '',
  autoStart = true,
  startDelay = 2000,
}) => {
  const [screensaverPhase, setScreensaverPhase] = useState<ScreensaverPhase>('drop');
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    if (!autoStart) return;

    // Start the screensaver sequence after initial delay
    const startTimer = setTimeout(() => {
      // Phase 1: Drop (0-1.8s)
      setScreensaverPhase('drop');
      
      // Phase 2: Rotate (1.8s-3.3s)
      const rotateTimer = setTimeout(() => {
        setScreensaverPhase('rotate');
      }, 1800);
      
      // Phase 3: Expand (3.3s+)
      const expandTimer = setTimeout(() => {
        setScreensaverPhase('expand');
      }, 3300);
      
      // Show overlay content after drop completes
      const overlayTimer = setTimeout(() => {
        setShowOverlay(true);
      }, 1000);

      return () => {
        clearTimeout(rotateTimer);
        clearTimeout(expandTimer);
        clearTimeout(overlayTimer);
      };
    }, startDelay);

    return () => clearTimeout(startTimer);
  }, [autoStart, startDelay]);

  return (
    <div className={`w-full h-full flex items-center justify-center ${className}`}>
      {/* 
        SCREENSAVER CARD ANIMATION
        =========================
        
        Multi-phase animation sequence:
        1. DROP: Card scales from 1.0 to 0.85 with spring bounce
        2. ROTATE: Card rotates 90° and flips to back side  
        3. EXPAND: Card scales to 2.2x and fills device frame (800x500)
        
        Card maintains same aspect ratio as BrandPass (361x480)
      */}
      <motion.div
        animate={{
          // Scale animation based on phase
          scale: screensaverPhase === 'drop' ? 0.85 :
                 screensaverPhase === 'rotate' ? 0.85 :
                 screensaverPhase === 'expand' ? 2.2 : 1.0,
          
          // Rotation animation
          rotateZ: screensaverPhase === 'drop' ? 0 :
                   screensaverPhase === 'rotate' ? 90 :
                   screensaverPhase === 'expand' ? 90 : 0,
          
          // Size animation for landscape expansion
          width: screensaverPhase === 'expand' ? 800 : 361,
          height: screensaverPhase === 'expand' ? 500 : 480,
        }}
        initial={{ 
          scale: 1.0,
          rotateZ: 0,
          width: 361,
          height: 480,
        }}
        className="relative"
        style={{
          transformOrigin: 'center center',
          perspective: '1200px'
        }}
        transition={{
          scale: {
            delay: screensaverPhase === 'drop' ? 0.5 : 0,
            type: "spring",
            stiffness: screensaverPhase === 'expand' ? 120 : 200,
            damping: screensaverPhase === 'expand' ? 30 : 15,
            mass: screensaverPhase === 'expand' ? 1.2 : 0.8
          },
          rotateZ: {
            delay: 0,
            type: "spring",
            stiffness: screensaverPhase === 'expand' ? 120 : 150,
            damping: screensaverPhase === 'expand' ? 30 : 20,
            mass: screensaverPhase === 'expand' ? 1.2 : 1.0
          },
          width: {
            delay: 0,
            type: "spring", 
            stiffness: screensaverPhase === 'expand' ? 120 : 100,
            damping: screensaverPhase === 'expand' ? 30 : 25,
            mass: screensaverPhase === 'expand' ? 1.2 : 1.2
          },
          height: {
            delay: 0,
            type: "spring",
            stiffness: screensaverPhase === 'expand' ? 120 : 100, 
            damping: screensaverPhase === 'expand' ? 30 : 25,
            mass: screensaverPhase === 'expand' ? 1.2 : 1.2
          }
        }}
      >
        <motion.div
          className="w-full h-full relative"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ 
            rotateY: screensaverPhase === 'rotate' || screensaverPhase === 'expand' ? 180 : 0
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
          {/* Front Face - Blank Card */}
          <div
            className={`absolute inset-0 w-full h-full rounded-[32px] ${backgroundColor} backface-hidden`}
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(0deg)',
              borderTop: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          />

          {/* Back Face - Blank Card */}
          <div
            className={`absolute inset-0 w-full h-full rounded-[32px] ${backfaceColor} backface-hidden`}
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              borderTop: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          />

          {/* Screensaver Overlay Content */}
          {showOverlay && (
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-[#5D5D3F] to-[#4A4A32] rounded-[32px] flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ 
                delay: 0,
                duration: 0.6,
                ease: "easeOut"
              }}
              style={{ zIndex: 10 }}
            >
              <div className="text-center text-white">
                <h1 className="text-6xl font-cash font-medium mb-4">{brandName}</h1>
                <p className="text-2xl opacity-80">{subtitle}</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}; 