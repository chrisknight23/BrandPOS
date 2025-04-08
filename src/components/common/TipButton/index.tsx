import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import cashbackAnimation from '../../../assets/CashBackLogo.json';

interface TipButtonProps {
  amount: string;
  layoutId: string;
  onClick?: () => void;
  isSelected?: boolean;
}

export const TipButton = ({ amount, layoutId, onClick, isSelected }: TipButtonProps) => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  // Start the animation when selected
  useEffect(() => {
    if (isSelected && lottieRef.current) {
      lottieRef.current.goToAndPlay(0);
    }
  }, [isSelected]);

  // Use a safer approach for layout animations
  return (
    <motion.div
      layoutId={isSelected ? layoutId : undefined} // Only use layoutId when selected
      onClick={onClick}
      className={`
        flex items-center justify-center cursor-pointer rounded-2xl bg-[#1189D6]
        ${isSelected
          ? 'absolute inset-0 w-full h-full z-10'
          : 'relative h-full w-full'
        }
      `}
      whileTap={!isSelected ? { scale: 0.95 } : undefined}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        layout: {
          type: "spring",
          stiffness: 300,
          damping: 30
        }
      }}
      layout
      initial={isSelected ? undefined : { opacity: 1 }}
      animate={isSelected ? undefined : { opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {!isSelected ? (
        <motion.span 
          className="text-white text-[70px] font-medium font-cash"
          layout="position"
        >
          ${amount}
        </motion.span>
      ) : (
        <motion.div 
          layout
          className="flex items-center justify-center"
          style={{ 
            width: 158, 
            height: 158, 
            flexShrink: 0,
            flexGrow: 0
          }}
        >
          <Lottie 
            lottieRef={lottieRef}
            animationData={cashbackAnimation}
            loop={false}
            autoplay={true}
            style={{
              width: '100%',
              height: '100%'
            }}
            rendererSettings={{
              preserveAspectRatio: 'xMidYMid meet'
            }}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default TipButton; 