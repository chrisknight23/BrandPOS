import { motion } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';

/**
 * A card component that can expand to show additional content with a Lottie animation.
 * Features smooth layout animations using Framer Motion's layoutId for continuous transitions.
 * 
 * @component
 * @example
 * ```tsx
 * <LocalPass
 *   layoutId="amount-1"
 *   amount="1"
 *   isExpanded={false}
 *   onClick={() => handleClick()}
 * />
 * ```
 */
interface LocalPassProps {
  /** Unique ID for Framer Motion layout animations */
  layoutId: string;
  /** Amount to display on the card (e.g. "1", "2", "3") */
  amount: string;
  /** Whether the card is in its expanded state */
  isExpanded: boolean;
  /** Handler for click events */
  onClick?: () => void;
  /** Optional child elements to render in expanded state */
  children?: ReactNode;
}

export const LocalPass = ({ 
  layoutId, 
  amount, 
  isExpanded,
  onClick,
  children 
}: LocalPassProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  // Calculate scale to cover viewport (800x500) from natural size (344x444)
  const initialScale = Math.max(800/344, 500/444); // ≈ 2.33

  useEffect(() => {
    if (isExpanded) {
      setIsAnimating(false);
      
      // Start scale down animation after 2s
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    } else {
      setIsAnimating(false);
    }
  }, [isExpanded]);

  return (
    <>
      {isExpanded && <div className="h-full" />}
      
      <motion.div
        layoutId={layoutId}
        onClick={onClick}
        className={`
          ${isExpanded 
            ? 'fixed inset-0 m-auto rounded-2xl shadow-xl z-50 flex items-center justify-center' 
            : 'h-full rounded-2xl flex items-center justify-center cursor-pointer'}
          transition-colors duration-300
        `}
        style={{
          backgroundColor: isExpanded ? '#00B843' : '#00B843',
          width: isExpanded ? '344px' : '100%',
          height: isExpanded ? '444px' : '100%',
          transformOrigin: 'center',
          perspective: '1000px'
        }}
        animate={{
          scale: isExpanded 
            ? isAnimating 
              ? 1
              : initialScale
            : 1,
          rotateX: isExpanded && isAnimating ? [15, 0] : 0,
          rotateY: isExpanded && isAnimating ? [-10, 0] : 0,
          y: isExpanded && isAnimating ? [-50, 0] : 0,
          z: isExpanded && isAnimating ? [100, 0] : 0
        }}
        transition={{
          type: "spring",
          stiffness: isExpanded && isAnimating ? 250 : 300,
          damping: isExpanded && isAnimating ? 20 : 30,
          mass: 1.5,
          restDelta: 0.001,
          restSpeed: 0.001
        }}
      >
        {!isExpanded ? (
          <motion.span
            className="text-white text-[70px] font-medium font-cash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            ${amount}
          </motion.span>
        ) : (
          <motion.div 
            className="flex items-center justify-center w-full relative"
          />
        )}
      </motion.div>
    </>
  );
}; 