import { BaseScreen } from '../../components/common/BaseScreen';
import { LocalPass } from '../../components/common/LocalPass';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CashoutProps {
  amount?: string;
  onComplete?: () => void;
}

export const Cashout = ({ amount = '3', onComplete }: CashoutProps) => {
  // Animation sequence state
  const [flipped, setFlipped] = useState(true); // start on back
  const [cardState, setCardState] = useState<'initial' | 'expanded' | 'dropped'>('initial');
  const [slideOut, setSlideOut] = useState(false);

  useEffect(() => {
    // Flip the card to front after 800ms
    const flipTimeout = setTimeout(() => setFlipped(false), 800);
    // Move to compact state after 4000ms
    const compactTimeout = setTimeout(() => setCardState('dropped'), 4000);
    // Slide down after 4800ms (800ms after dropping)
    const slideTimeout = setTimeout(() => setSlideOut(true), 4800);
    // After slide out, wait 600ms, then navigate to End screen
    const endTimeout = setTimeout(() => {
      if (slideOut && onComplete) {
        onComplete();
      }
    }, 2000); // Time 
    return () => {
      clearTimeout(flipTimeout);
      clearTimeout(compactTimeout);
      clearTimeout(slideTimeout);
      clearTimeout(endTimeout);
    };
  }, [slideOut, onComplete]);

  return (
    <BaseScreen onNext={onComplete}>
      <div className="w-[800px] h-[500px] bg-black flex items-center justify-center relative overflow-hidden rounded-[16px] border border-[#222]">
        <motion.div
          initial={{ y: 0 }}
          animate={slideOut ? { y: 600 } : { y: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          className="w-full h-full flex items-center justify-center"
        >
          <LocalPass
            initialState={cardState}
            flipped={flipped}
            showButton={false}
            showHeader={false}
            animateIn={false}
            disableAnimation={true}
          />
        </motion.div>
      </div>
    </BaseScreen>
  );
};

export default Cashout; 