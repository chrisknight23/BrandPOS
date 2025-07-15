import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedMessageProps {
  message?: string;
  show: boolean;
  animated?: boolean;
  duration?: number; // ms, optional for auto-hide
  className?: string;
  children?: React.ReactNode;
}

export const AnimatedMessage: React.FC<AnimatedMessageProps> = ({ message, show, animated = true, duration, className, children }) => {
  if (!animated) {
    return (
      <h1 className={className || "text-[56px] font-cash font-medium leading-[48px] tracking-[-0.04em]"}>
        {children ? children : message}
      </h1>
    );
  }
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          // --- AnimatedMessage animation timing ---
          // To change the speed of the message fade/slide, adjust the duration below.
          // This is the ONLY place to change animation speed for AnimatedMessage.
          transition={{ duration: 0.9, ease: [0.32, 0.72, 0, 1] }}
          className={className || ''}
          role="status"
          aria-live="polite"
        >
                  <h1 className="text-[56px] font-cash font-medium leading-[48px] tracking-[-0.04em]">
          {children ? children : message}
        </h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedMessage; 