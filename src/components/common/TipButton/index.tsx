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
        ${isSelected ? 'fixed inset-0 z-50 m-0 p-0 rounded-[4px]' : 'relative h-full w-full'}
      `}
      style={isSelected ? {
        width: '800px',
        height: '500px',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        margin: 0,
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