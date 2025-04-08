import { motion } from 'framer-motion';

interface TipButtonProps {
  amount: string;
  layoutId: string;
  onClick?: () => void;
  isSelected?: boolean;
}

export const TipButton = ({ amount, layoutId, onClick, isSelected }: TipButtonProps) => {
  return (
    <motion.div
      layoutId={layoutId}
      onClick={onClick}
      className={`
        flex items-center justify-center cursor-pointer rounded-2xl bg-[#1189D6]
        ${isSelected ? 'z-50' : 'relative h-full w-full'}
      `}
      style={isSelected ? {
        width: '800px',
        height: '500px',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 'auto',
        padding: 0
      } : undefined}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.3
      }}
      whileTap={!isSelected ? { scale: 0.95 } : undefined}
    >
      <motion.span 
        className={`text-white font-medium font-cash ${isSelected ? 'text-[120px]' : 'text-[70px]'}`}
        layoutId={`${layoutId}-text`}
      >
        ${amount}
      </motion.span>
    </motion.div>
  );
};

export default TipButton;