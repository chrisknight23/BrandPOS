import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProgressButtonProps {
  label: React.ReactNode;
  progress: number; // 0 to 1
  onClick?: () => void;
  show?: boolean;
  className?: string;
  paused?: boolean;
  onFadeInComplete?: () => void; // Called after fade-in animation completes
}

export const ProgressButton: React.FC<ProgressButtonProps> = ({ label, progress, onClick, show = true, className, paused, onFadeInComplete }) => {
  // If paused, freeze the progress bar at its current value (no animation)
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className={`relative overflow-hidden rounded-full w-[340px] h-[96px] cursor-pointer ${className || ''}`}
          onClick={onClick}
          role="button"
          tabIndex={0}
          aria-label={typeof label === 'string' ? label : 'Progress button'}
          onAnimationComplete={onFadeInComplete}
        >
          {/* Base button background */}
          <div className="absolute inset-0 bg-black/15" />
          {/* Progress bar - drains from left to right */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-black/[0.10]"
              initial={{ x: 0 }}
              animate={paused ? undefined : { x: -progress * 100 + '%' }}
              style={paused ? { x: -progress * 100 + '%' } : undefined}
              transition={{ ease: 'linear', duration: 0.05 }}
            />
          </div>
          {/* Button text - stays on top */}
          <div className="relative z-10 flex items-center justify-center h-full">
            <span className="text-[32px] font-cash font-medium text-white">
              {label}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProgressButton; 