import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { Button } from '../../ui';
import { Screen } from '../../../types/screen';

// Register GSAP plugins
gsap.registerPlugin(TextPlugin);

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
  /** Custom messages to cycle through (optional) */
  messages?: string[];
  /** Time in milliseconds each message displays before cycling (default: 4000ms) */
  cycleInterval?: number;
  /** Navigation function to go to a specific screen */
  goToScreen?: (screen: Screen) => void;
}

// Default messages to cycle through
const DEFAULT_MESSAGES = [
  "Follow us and earn rewards",
  "Free Items", 
  "Exclusive Deals",
  "Order Ahead",
  "$mileendbagel"
];

// GSAP Animation Effects - Letter-by-letter magic!
const createTextAnimation = (element: HTMLElement, text: string, animationType: number) => {
  const timeline = gsap.timeline();
  
  // Clear the element and build the structure manually
  element.innerHTML = '';
  
  // Special handling for "Follow us and earn rewards" - add line break
  if (text === "Follow us and earn rewards") {
    text = "Follow us and<br/>earn rewards";
  }
  
  // Split text into individual characters, preserving all spaces and line breaks
  const letters: HTMLSpanElement[] = [];
  
  // Split by <br> tags first, then handle each line
  const lines = text.split(/<br\s*\/?>/i);
  
  lines.forEach((line, lineIndex) => {
    if (lineIndex > 0) {
      // Add line break for subsequent lines
      element.appendChild(document.createElement('br'));
    }
    
    line.split('').forEach(char => {
      if (char === ' ') {
        // Create a space span to maintain consistent spacing
        const spaceSpan = document.createElement('span');
        spaceSpan.innerHTML = '&nbsp;';
        spaceSpan.style.display = 'inline-block';
        element.appendChild(spaceSpan);
      } else if (char.trim()) {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        element.appendChild(span);
        letters.push(span);
      }
    });
  });
  
  switch (animationType % 5) {
    case 0: // Letters drop from above
      letters.forEach(letter => {
        gsap.set(letter, { y: -100, rotation: Math.random() * 40 - 20 });
      });
      timeline
        .set(element, { opacity: 1 })
        .to(letters, {
          duration: 0.6,
          opacity: 1,
          y: 0,
          rotation: 0,
          stagger: 0.02,
          ease: "bounce.out"
        });
      break;
      
    case 1: // Letters spiral in
      letters.forEach((letter, i) => {
        const angle = i * 30;
        const distance = 150;
        gsap.set(letter, { 
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          rotation: angle,
          scale: 0
        });
      });
      timeline
        .set(element, { opacity: 1 })
        .to(letters, {
          duration: 0.5,
          opacity: 1,
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          stagger: 0.03,
          ease: "back.out(2)"
        });
      break;
      
    case 2: // Letters zoom and flip
      letters.forEach(letter => {
        gsap.set(letter, { scale: 0, rotationY: 180 });
      });
      timeline
        .set(element, { opacity: 1 })
        .to(letters, {
          duration: 0.4,
          opacity: 1,
          scale: 1.2,
          rotationY: 0,
          stagger: 0.025,
          ease: "power2.out"
        })
        .to(letters, {
          duration: 0.2,
          scale: 1,
          ease: "power2.out"
        });
      break;
      
    case 3: // Letters slide from random directions
      letters.forEach(letter => {
        const directions = [
          { x: -200, y: 0 },
          { x: 200, y: 0 },
          { x: 0, y: -200 },
          { x: 0, y: 200 },
          { x: -150, y: -150 },
          { x: 150, y: 150 }
        ];
        const direction = directions[Math.floor(Math.random() * directions.length)];
        gsap.set(letter, { 
          x: direction.x, 
          y: direction.y, 
          rotation: Math.random() * 360,
          scale: 0.3
        });
      });
      timeline
        .set(element, { opacity: 1 })
        .to(letters, {
          duration: 0.5,
          opacity: 1,
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          stagger: 0.02,
          ease: "power3.out"
        });
      break;
      
    case 4: // Letters elastic bounce in sequence
      letters.forEach(letter => {
        gsap.set(letter, { scaleY: 0, scaleX: 2, skewX: 45 });
      });
      timeline
        .set(element, { opacity: 1 })
        .to(letters, {
          duration: 0.4,
          opacity: 1,
          scaleY: 1.3,
          scaleX: 0.8,
          skewX: -10,
          stagger: 0.03,
          ease: "power2.out"
        })
        .to(letters, {
          duration: 0.3,
          scaleY: 1,
          scaleX: 1,
          skewX: 0,
          stagger: 0.01,
          ease: "elastic.out(1, 0.6)"
        });
      break;
  }
  
  return timeline;
};

export const ScreensaverMessaging: React.FC<ScreensaverMessagingProps> = ({
  isVisible = false,
  startDelay = 500,
  brandName = '$mileendbagel',
  className = '',
  isStaticFullscreen = false,
  messages = DEFAULT_MESSAGES,
  cycleInterval = 4000,
  goToScreen,
}) => {
  const [animationPhase, setAnimationPhase] = useState<'ready' | 'fadeIn' | 'visible'>('ready');
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const textRef = useRef<HTMLHeadingElement>(null);
  const currentAnimationRef = useRef<gsap.core.Timeline | null>(null);
  const cycleIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isVisible) {
      setAnimationPhase('ready');
      setCurrentMessageIndex(0);
      if (cycleIntervalRef.current) {
        clearInterval(cycleIntervalRef.current);
        cycleIntervalRef.current = null;
      }
      return;
    }

    // For static fullscreen, skip animation and go directly to visible
    if (isStaticFullscreen) {
      setAnimationPhase('visible');
      return;
    }

    // Start fading in immediately when card begins expand phase
    setAnimationPhase('fadeIn');
    
    // Move to visible phase after fade in completes
    const visibleTimer = setTimeout(() => {
      setAnimationPhase('visible');
    }, 800);

    return () => clearTimeout(visibleTimer);
  }, [isVisible, isStaticFullscreen]);

  // Handle message cycling with GSAP animations
  useEffect(() => {
    if (animationPhase !== 'visible' || messages.length <= 1 || !textRef.current) return;

    console.log('Setting up cycling timer...');

    // Always start animation for current message immediately
    console.log(`Starting animation for message ${currentMessageIndex}: "${messages[currentMessageIndex]}"`);
    const timeline = createTextAnimation(
      textRef.current, 
      messages[currentMessageIndex], 
      currentMessageIndex
    );
    currentAnimationRef.current = timeline;

    // Set up cycling interval
    cycleIntervalRef.current = setInterval(() => {
      console.log('Cycling to next message...');
      
      setCurrentMessageIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % messages.length;
        console.log(`Transitioning from message ${prevIndex} to ${nextIndex}`);
        return nextIndex;
      });
      
    }, cycleInterval);

    return () => {
      console.log('Cleaning up cycling timer...');
      if (cycleIntervalRef.current) {
        clearInterval(cycleIntervalRef.current);
        cycleIntervalRef.current = null;
      }
    };
  }, [animationPhase, messages, cycleInterval, currentMessageIndex]);

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
              scale: 1 / 1.38, // Counter-scale to maintain original text size
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
            {/* GSAP-Powered Text Animation Container */}
            <motion.div
              initial={{ opacity: isStaticFullscreen ? 1 : 0, y: isStaticFullscreen ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: isStaticFullscreen ? 0 : 0.8,
                ease: [0.32, 0.72, 0, 1]
              }}
              className="text-center relative flex items-center justify-center"
              style={{ width: '800px', height: '200px' }}
            >
              <h1
                ref={textRef}
                className="text-[90px] font-cash font-medium text-center leading-[0.85] tracking-[-0.02em]"
                style={{ 
                  transformOrigin: 'center center',
                  willChange: 'transform, opacity',
                  opacity: 0, // Start hidden, GSAP will animate it in
                  width: '100%',
                  wordWrap: 'break-word',
                  whiteSpace: 'normal'
                }}
              />
            </motion.div>

            {/* Bottom center button */}
            <motion.div
              initial={{ opacity: isStaticFullscreen ? 1 : 0, y: isStaticFullscreen ? 0 : 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{
                duration: isStaticFullscreen ? 0 : 0.8,
                delay: isStaticFullscreen ? 0 : 0.3,
                ease: [0.32, 0.72, 0, 1]
              }}
              className="absolute w-full flex justify-center"
              style={{
                bottom: '-110px',
              }}
            >
              <Button
                variant="tertiary"
                size="medium"
                color="rgba(255, 255, 255, 0.2)"
                className="text-lg"
                onClick={() => goToScreen?.('ScreensaverFollow')}
              >
                Follow
              </Button>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 