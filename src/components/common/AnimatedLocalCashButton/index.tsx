import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserType } from '../../../context/UserTypeContext';

interface AnimatedLocalCashButtonProps {
  texts: (string | React.ReactNode)[];
  icon: React.ReactNode;
  userType: UserType;
  onClick?: () => void;
  animationTiming?: {
    interval?: number; // ms between text switches
    fade?: number;     // ms for fade out/in
  };
  staticText?: boolean; // If true, show only the first text, no animation
  suffix?: React.ReactNode; // Optional suffix to render after the text
}

export const AnimatedLocalCashButton: React.FC<AnimatedLocalCashButtonProps> = ({
  texts,
  icon,
  userType,
  onClick,
  animationTiming = { interval: 3000, fade: 300 },
  staticText = false,
  suffix,
}) => {
  const [activeText, setActiveText] = useState(0);
  const textChangeInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const measurerRef = useRef<HTMLDivElement>(null);
  const [textWidth, setTextWidth] = useState<number>(0);
  const fixedWordColor = '#1189D6'; // Blue color for the fixed word

  // Fixed word changes instantly based on activeText
  const fixedWords = ['New', 'Earn'];
  const showFixedWord = (staticText && userType === 'returning') || (!staticText);
  const fixedWord = staticText && userType === 'returning' ? 'Earn' : fixedWords[activeText] || 'New';

  // Measure text width on every text/suffix change
  useEffect(() => {
    if (measurerRef.current) {
      setTextWidth(measurerRef.current.offsetWidth);
    }
  }, [activeText, texts, suffix, staticText, fixedWord]);

  // Text cycling logic
  useEffect(() => {
    if (staticText) return;
    textChangeInterval.current = setInterval(() => {
      setTimeout(() => {
        setActiveText((prev) => (prev + 1) % texts.length);
      }, animationTiming.fade);
    }, animationTiming.interval);
    return () => {
      if (textChangeInterval.current) clearInterval(textChangeInterval.current);
    };
  }, [texts.length, animationTiming.interval, animationTiming.fade, staticText]);

  // When switching to staticText for returning customer, force prefix to 'Earn'
  useEffect(() => {
    if (staticText && userType === 'returning') {
      setActiveText(1); // 1 = 'Earn'
    }
  }, [staticText, userType]);

  // Text color: always white
  const textColor = '#fff';

  // --- Padding and icon constants ---
  const leftPadding = 24; // pl-6
  const rightPadding = 0; // No right padding for static variant
  const iconWidth = 40; // w-10

  // --- Calculate total width for static and animated variants ---
  const totalWidth = textWidth + leftPadding;

  // If any of the texts contain 'Earn Local Cash', remove 'Earn '
  const sanitizedTexts = texts.map(text => {
    if (typeof text === 'string') {
      return text.replace(/^Earn\s+/i, '');
    }
    return text;
  });

  // Remove the fixed word from the start of the animated text if present
  const getAnimatedText = (text: string | React.ReactNode, fixedWord: string) => {
    if (typeof text === 'string') {
      const regex = new RegExp(`^${fixedWord}\\s+`, 'i');
      return text.replace(regex, '');
    }
    return text;
  };

  // Compose the text to measure (only the animated part, always stripped of the fixed word)
  const measuredText = staticText
    ? sanitizedTexts[0]
    : getAnimatedText(sanitizedTexts[activeText], fixedWord);

  return (
    <motion.button
      type="button"
      className="flex items-center bg-black border border-white/20 rounded-full overflow-hidden focus:outline-none pr-2 gap-1"
      style={{ height: 56, minWidth: 0 }}
      onClick={onClick}
      tabIndex={0}
      aria-label={typeof measuredText === 'string' ? measuredText as string : undefined}
      layout
    >
      {/* Animated left (text) side */}
      <motion.div
        className="flex items-center h-full pl-6 min-w-0 overflow-hidden"
        animate={{ width: totalWidth ? totalWidth : undefined }}
        initial={false}
        transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 1.0, duration: 1.0 }}
        style={{ minWidth: 0 }}
      >
        {/* Hidden measurer for both static and animated variants */}
        <div
          ref={measurerRef}
          className={`absolute left-0 top-0 pointer-events-none opacity-0 whitespace-nowrap flex items-center gap-1`}
          style={{ visibility: 'hidden', position: 'absolute' }}
          aria-hidden="true"
        >
          {/* Show the fixed word only for animated or returning-customer staticText */}
          {showFixedWord && (
            <span className="text-[18px] font-normal font-cash whitespace-nowrap" style={{ color: fixedWordColor }}>
              {fixedWord}
            </span>
          )}
          {staticText ? (
            <span className="text-[18px] font-medium font-cash whitespace-nowrap" style={{ color: textColor }}>
              {sanitizedTexts[0]}{suffix ? <>&nbsp;{suffix}</> : null}
            </span>
          ) : (
            <span className="text-[18px] font-medium font-cash whitespace-nowrap" style={{ color: textColor }}>
              {getAnimatedText(sanitizedTexts[activeText], fixedWord)}{suffix ? <> {suffix}</> : null}
            </span>
          )}
        </div>
        {/* Left side: fixed word and animated text */}
        <div className={`flex items-center min-w-0 h-[30px] gap-1`}>
          {/* Show the fixed word only for animated or returning-customer staticText */}
          {showFixedWord && (
            <span className="text-[18px] font-normal font-cash whitespace-nowrap" style={{ color: fixedWordColor }}>
              {fixedWord}
            </span>
          )}
          {staticText ? (
            <span className="text-[18px] font-medium font-cash whitespace-nowrap" style={{ color: textColor }}>
              {sanitizedTexts[0]}{suffix ? <>&nbsp;{suffix}</> : null}
            </span>
          ) : (
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={`text-${activeText}`}
                className="text-[18px] font-medium font-cash whitespace-nowrap"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0, transition: { duration: 0.3 } }}
                transition={{
                  type: 'spring',
                  stiffness: 120,
                  damping: 20,
                  mass: 1.0,
                  duration: 1.0,
                }}
                style={{ color: textColor }}
              >
                {getAnimatedText(sanitizedTexts[activeText], fixedWord)}{suffix ? <> {suffix}</> : null}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </motion.div>
      {/* Fixed right (icon) side */}
      <div className="w-10 h-10 flex items-center justify-center">
        {icon}
      </div>
    </motion.button>
  );
};

export default AnimatedLocalCashButton; 