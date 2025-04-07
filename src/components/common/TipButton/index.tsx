import { motion } from 'framer-motion';

interface TipButtonProps {
  /** Amount to display (e.g. "1", "2", "3") */
  amount: string;
  /** Unique layout ID for Framer Motion animations */
  layoutId: string;
  /** Click handler */
  onClick?: () => void;
  /** Whether the button is selected and should expand */
  isSelected?: boolean;
}

export const TipButton = ({ amount, layoutId, onClick, isSelected }: TipButtonProps) => {
  return (
    <motion.div
      layoutId={layoutId}
      onClick={onClick}
      className={`
        flex items-center justify-center cursor-pointer rounded-2xl
        ${isSelected
          ? 'absolute top-0 left-0 w-[800px] h-[500px] bg-[#1189D6] z-10 pointer-events-none'
          : 'relative h-full bg-[#1189D6]'
        }
      `}
      whileTap={!isSelected ? { scale: 0.90, translateY: 4 } : {}}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 25,
        scale: {
          type: "spring",
          stiffness: 200,
          damping: 20
        }
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <motion.span 
        className="text-white text-[70px] font-medium font-cash"
      >
        ${amount}
      </motion.span>
    </motion.div>
  );
}; 