import { useEffect, useState } from 'react';
import { BaseScreen } from '../../components/common/BaseScreen/index';
import { motion, AnimatePresence } from 'framer-motion';
import CreditCardCursor from '../../components/common/CreditCardCursor';

interface ArrowProps {
  direction: 'up' | 'down';
  state: AnimationState;
}

type AnimationState = 'idle' | 'arrowEntry' | 'paymentPrompts' | 'arrowExit';

const Arrow = ({ direction, state }: ArrowProps) => {
  const isVisible = state === 'arrowEntry' || state === 'paymentPrompts';
  const yOffset = direction === 'up' ? -80 : 80;
  const returnOffset = direction === 'up' ? -40 : 40;
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute left-1/2"
          style={{ 
            top: direction === 'up' ? '140px' : 'auto',
            bottom: direction === 'down' ? '140px' : 'auto',
            height: '16px',
          }}
          initial={{ opacity: 0, x: -6, y: 0 }}
          animate={{
            opacity: state === 'paymentPrompts' ? 1 : 0,
            x: -6,
            y: state === 'paymentPrompts' ? yOffset : returnOffset,
          }}
          exit={{ opacity: 0, x: -6, y: returnOffset }}
          transition={{ 
            duration: 1.2,
            delay: 0.2,
            ease: [0.32, 0.72, 0, 1]
          }}
        >
          <div className={`w-0 h-0 border-8 border-transparent rounded-[1px] ${
            direction === 'up' ? 'border-b-white' : 'border-t-white'
          }`} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const PaymentNotch = ({ position, text }: { position: 'top' | 'bottom', text: string }) => {
  const isTop = position === 'top';
  
  return (
    <motion.div
      className={`
        absolute 
        ${isTop ? 'top-0' : 'bottom-0'}
        left-[346px]
        flex items-center justify-center
        overflow-visible
        w-[108px]
      `}
      style={{
        left: 'calc(50% - 54px)',
        transformOrigin: isTop ? 'top' : 'bottom'
      }}
      initial={{ 
        scale: 0,
        opacity: 0
      }}
      animate={{ 
        scale: 1,
        opacity: 1
      }}
      transition={{
        duration: 0.5,
        delay: 0.5,
        ease: [0.32, 0.72, 0, 1]
      }}
    >
      {/* Main notch body */}
      <svg
        width="108"
        height="40"
        viewBox="0 0 108 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={isTop ? 
            "M0 0H108V24C108 32.8366 100.837 40 92 40H16C7.16344 40 0 32.8366 0 24V0Z" :
            "M0 0V16C0 7.16344 7.16344 0 16 0H92C100.837 0 108 7.16344 108 16V40H0V0Z"
          }
          fill="black"
        />
      </svg>

      {/* Left corner piece with quarter-circle cutout */}
      <svg
        width="8"
        height="8"
        viewBox="0 0 8 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`absolute -left-[8px] ${isTop ? 'top-0' : 'bottom-0'}`}
      >
        <path
          d={isTop ?
            "M0 0H8V8C8 3.58172 4.41828 0 0 0Z" :
            "M0 8H8V0C8 4.41828 4.41828 8 0 8Z"
          }
          fill="black"
        />
      </svg>

      {/* Right corner piece with quarter-circle cutout */}
      <svg
        width="8"
        height="8"
        viewBox="0 0 8 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`absolute -right-[8px] ${isTop ? 'top-0' : 'bottom-0'}`}
      >
        <path
          d={isTop ?
            "M8 0H0V8C0 3.58172 3.58172 0 8 0Z" :
            "M8 8H0V0C0 4.41828 3.58172 8 8 8Z"
          }
          fill="black"
        />
      </svg>

      <motion.span
        className="absolute text-white font-medium font-cash"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ 
          opacity: 1,
          scale: 1 
        }}
        transition={{ 
          opacity: { 
            duration: 0.4,
            delay: 0.4,
            ease: [0.32, 0.72, 0, 1]
          },
          scale: {
            duration: 0.4,
            delay: 0.4,
            ease: [0.32, 0.72, 0, 1]
          }
        }}
      >
        {text}
      </motion.span>
    </motion.div>
  );
};

interface PaymentProps {
  onNext: (amount?: string) => void;
  amount?: string;
}

export const Payment = ({ onNext, amount = "10.80" }: PaymentProps) => {
  const [animationState, setAnimationState] = useState<AnimationState>('idle');
  const [notchesVisible, setNotchesVisible] = useState(false);
  const [showCardCursor, setShowCardCursor] = useState(true);

  useEffect(() => {
    // Start all animations immediately
    setAnimationState('paymentPrompts');
    setNotchesVisible(true);

    // Exit arrows after 2s
    const timeout = setTimeout(() => {
      setAnimationState('arrowExit');
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  const handleNext = () => {
    // Pass along the amount to the next screen
    onNext(amount);
  };
  
  const handleTapComplete = () => {
    // When tap animation completes, proceed to next screen
    setShowCardCursor(false);
    setTimeout(() => {
      handleNext();
    }, 800); // Give some time to see the card animation complete
  };

  return (
    <BaseScreen onNext={handleNext}>
      <div className="w-[800px] h-[500px] bg-[#1189D6] relative overflow-hidden flex items-center justify-center rounded-[8px]">
        {/* Price Display */}
        <motion.div 
          className="text-white text-[110px] leading-none font-medium origin-center"
          initial={{ scale: 0.836 }}
          animate={{ scale: 1 }}
          transition={{ 
            duration: 1,
            delay: 0.2,
            ease: [0.32, 0.72, 0, 1]
          }}
        >
          ${parseFloat(amount).toFixed(2)}
        </motion.div>

        {/* Arrows */}
        <Arrow direction="up" state={animationState} />
        <Arrow direction="down" state={animationState} />

        {/* Payment Notches */}
        <AnimatePresence>
          {notchesVisible && (
            <>
              <PaymentNotch position="top" text="Tap" />
              <PaymentNotch position="bottom" text="Insert" />
            </>
          )}
        </AnimatePresence>
        
        {/* Credit card cursor */}
        <CreditCardCursor active={showCardCursor} onTapComplete={handleTapComplete} />
      </div>
    </BaseScreen>
  );
}; 