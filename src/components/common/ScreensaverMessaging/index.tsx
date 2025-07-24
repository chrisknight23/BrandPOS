import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { Button } from '../../ui';
import { Screen } from '../../../types/screen';
import { useTextContent } from '../../../context/TextContentContext';

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
  
  // Create a centered container for the text
  const container = document.createElement('div');
  container.style.height = '400px'; // Reduced to make room for button
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  container.style.maxWidth = '700px';
  container.style.margin = '0 auto';
  container.style.wordBreak = 'break-word';
  container.style.whiteSpace = 'normal';
  element.appendChild(container);
  
  // Create text wrapper
  const textWrapper = document.createElement('div');
  textWrapper.style.width = '100%';
  textWrapper.style.textAlign = 'center';
  container.appendChild(textWrapper);
  
  // Special handling for "Follow us and earn rewards" - add line break
  if (text === "Follow us and earn rewards") {
    text = "Follow us and<br/>earn rewards";
  }
  
  // Split text into individual characters, preserving all spaces and line breaks
  const letters: HTMLSpanElement[] = [];
  const wordGroups: HTMLSpanElement[][] = [];
  let currentWord: HTMLSpanElement[] = [];
  
  // Split by <br> tags first, then handle each line
  const lines = text.split(/<br\s*\/?>/i);
  
  lines.forEach((line, lineIndex) => {
    if (lineIndex > 0) {
      textWrapper.appendChild(document.createElement('br'));
    }
    
    // Split line into words
    const words = line.split(' ');
    
    words.forEach((word, wordIndex) => {
      // Create word container
      const wordContainer = document.createElement('span');
      wordContainer.style.display = 'inline-block';
      wordContainer.style.whiteSpace = 'nowrap';
      textWrapper.appendChild(wordContainer);
      
      // Add letters for this word
      const wordLetters = word.split('').map(char => {
        if (char.trim()) {
          const span = document.createElement('span');
          span.textContent = char;
          span.style.display = 'inline-block';
          span.style.opacity = '0';
          wordContainer.appendChild(span);
          letters.push(span);
          return span;
        }
        return null;
      }).filter((span): span is HTMLSpanElement => span !== null);
      
      wordGroups.push(wordLetters);
      
      // Add space after word (except for last word in line)
      if (wordIndex < words.length - 1) {
        const spaceSpan = document.createElement('span');
        spaceSpan.innerHTML = '&nbsp;';
        spaceSpan.style.display = 'inline-block';
        textWrapper.appendChild(spaceSpan);
      }
    });
  });

  // After animation, trigger resize observation
  const onComplete = () => {
    element.dispatchEvent(new Event('textanimated'));
  };
  
  switch (animationType % 5) {
    case 0: // Letters drop from above
      // Set initial state for all letters
      wordGroups.flat().forEach(letter => {
        gsap.set(letter, { y: -100, rotation: Math.random() * 40 - 20 });
      });
      timeline
        .set(element, { opacity: 1 })
        .to(wordGroups.flat(), {
          duration: 0.6,
          opacity: 1,
          y: 0,
          rotation: 0,
          stagger: 0.015,
          ease: "bounce.out",
        })
        .then(onComplete);
      break;
      
    case 1: // Letters spiral in
      // Set initial state for all letters
      wordGroups.flat().forEach((letter, i) => {
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
        .to(wordGroups.flat(), {
          duration: 0.5,
          opacity: 1,
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          stagger: 0.015,
          ease: "back.out(2)",
        })
        .then(onComplete);
      break;
      
    case 2: // Letters zoom and flip
      // Set initial state for all letters
      wordGroups.flat().forEach(letter => {
        gsap.set(letter, { scale: 0, rotationY: 180 });
      });
      timeline
        .set(element, { opacity: 1 })
        .to(wordGroups.flat(), {
          duration: 0.4,
          opacity: 1,
          scale: 1.2,
          rotationY: 0,
          stagger: 0.015,
          ease: "power2.out",
        })
        .to(wordGroups.flat(), {
          duration: 0.2,
          scale: 1,
          ease: "power2.out",
        })
        .then(onComplete);
      break;
      
    case 3: // Letters slide from random directions
      // Set initial state for all letters
      wordGroups.flat().forEach(letter => {
        const direction = {
          x: Math.random() > 0.5 ? 200 : -200,
          y: Math.random() > 0.5 ? 200 : -200
        };
        gsap.set(letter, { 
          x: direction.x,
          y: direction.y,
          rotation: Math.random() * 360,
          scale: 0.3
        });
      });
      timeline
        .set(element, { opacity: 1 })
        .to(wordGroups.flat(), {
          duration: 0.5,
          opacity: 1,
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          stagger: 0.015,
          ease: "power3.out",
        })
        .then(onComplete);
      break;
      
    case 4: // Letters elastic bounce in sequence
      // Set initial state for all letters
      wordGroups.flat().forEach(letter => {
        gsap.set(letter, { scaleY: 0, scaleX: 2, skewX: 45 });
      });
      timeline
        .set(element, { opacity: 1 })
        .to(wordGroups.flat(), {
          duration: 0.4,
          opacity: 1,
          scaleY: 1.3,
          scaleX: 0.8,
          skewX: -10,
          stagger: 0.015,
          ease: "power2.out",
        })
        .to(wordGroups.flat(), {
          duration: 0.3,
          scaleY: 1,
          scaleX: 1,
          skewX: 0,
          stagger: 0.01,
          ease: "elastic.out(1, 0.6)",
        })
        .then(onComplete);
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
  cycleInterval = 4000,
  goToScreen,
}) => {
  const { getText } = useTextContent();
  const [animationPhase, setAnimationPhase] = useState<'ready' | 'fadeIn' | 'visible'>('ready');
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const textRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentAnimationRef = useRef<gsap.core.Timeline | null>(null);
  const cycleIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [containerOffset, setContainerOffset] = useState(0);

  // Set up ResizeObserver to handle text height changes
  useEffect(() => {
    if (!textRef.current || !containerRef.current) return;

    const handleResize = () => {
      if (!textRef.current || !containerRef.current) return;
      
      const textHeight = textRef.current.offsetHeight;
      const containerHeight = 200; // Fixed container height
      const newOffset = (containerHeight - textHeight) / 2;
      
      setContainerOffset(newOffset);
    };

    // Create ResizeObserver
    const observer = new ResizeObserver(handleResize);
    observer.observe(textRef.current);

    // Listen for animation completion
    const handleAnimated = () => handleResize();
    textRef.current.addEventListener('textanimated', handleAnimated);

    return () => {
      if (textRef.current) {
        observer.unobserve(textRef.current);
        textRef.current.removeEventListener('textanimated', handleAnimated);
      }
      observer.disconnect();
    };
  }, []);

  // Get messages from Google Sheet
  const messages = [
    getText('message1'),
    getText('message2'),
    getText('message3'),
    getText('message4'),
    getText('message5')
  ];

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
              scale: 1 / 1.38,
              scaleX: isStaticFullscreen ? -1 : 1
            }}
            exit={{ opacity: 0, rotate: isStaticFullscreen ? 270 : -90, scale: 1, scaleX: isStaticFullscreen ? -1 : 1 }}
            transition={{
              duration: isStaticFullscreen ? 0 : 0.8,
              ease: [0.32, 0.72, 0, 1]
            }}
            className="flex flex-col items-center justify-between"
            style={{ 
              transformOrigin: 'center center',
              width: '800px',
              height: '500px'
            }}
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
              className="text-center relative flex items-center justify-center w-full h-full"
              style={{ width: '800px', overflow: 'hidden' }}
            >
              <h1
                ref={textRef}
                className="text-[90px] font-cash font-medium text-center leading-[0.85] tracking-[-0.02em] w-full flex items-center justify-center"
                style={{ 
                  transformOrigin: 'center center',
                  willChange: 'transform, opacity',
                  opacity: 0,
                  maxWidth: '700px',
                  margin: '0 auto',
                  wordBreak: 'break-word',
                  whiteSpace: 'normal'
                }}
              />
            </motion.div>

            {/* Bottom center button - centered accounting for button width */}
            <motion.div
              initial={{ opacity: isStaticFullscreen ? 1 : 0, y: isStaticFullscreen ? 0 : 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{
                duration: isStaticFullscreen ? 0 : 0.8,
                delay: isStaticFullscreen ? 0 : 0.3,
                ease: [0.32, 0.72, 0, 1]
              }}
              className="absolute"
              style={{ 
                bottom: '32px',
                left: '340px', // (800px - 120px) / 2 = 340px to account for button width
                transform: 'rotate(90deg)',
                transformOrigin: 'center center',
                zIndex: 20
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