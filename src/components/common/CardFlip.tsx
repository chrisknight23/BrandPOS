import { useState } from 'react';
import { motion } from 'framer-motion';

interface CardFlipProps {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
  onFlip?: () => void;
}

export const CardFlip = ({ front, back, className = '', onFlip }: CardFlipProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(true);
    onFlip?.();
  };

  return (
    <div 
      className={`relative w-full h-full cursor-pointer perspective-1000 ${className}`}
      onClick={handleFlip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleFlip()}
      aria-label="Tap to flip card"
    >
      <motion.div
        className="relative w-full h-full preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* Front of card */}
        <motion.div
          className="absolute w-full h-full backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {front}
        </motion.div>

        {/* Back of card */}
        <motion.div
          className="absolute w-full h-full backface-hidden"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {back}
        </motion.div>
      </motion.div>
    </div>
  );
}; 