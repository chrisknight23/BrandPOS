import { LocalPass, CardState } from '../../components/common/LocalPass';
import { useEffect, useState, useCallback, useRef } from 'react';
import { BaseScreen } from '../../components/common/BaseScreen/index';
import cashBackAnimation from '../../assets/CashBackLogo.json';
import { motion } from 'framer-motion';

interface CashbackProps {
  onNext: (amount?: string) => void;
  amount?: string;
}

export const Cashback = ({ onNext, amount = "1" }: CashbackProps) => {
  const [cardState, setCardState] = useState<CardState>('expanded');
  // Track whether we're currently transitioning states
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Force an explicit reset when entering the screen
  useEffect(() => {
    console.log(`Cashback: Component mounted with tip amount ${amount}`);
    
    // Reset to expanded state on mount
    setCardState('expanded');
    setIsTransitioning(false);
    
    return () => {
      console.log('Cashback: Component unmounting');
    };
  }, [amount]);

  const handleNextClick = () => {
    console.log('Cashback: Next clicked, navigating to next screen');
    onNext();
  };
  
  // Handle state changes from the card animation
  const handleStateChange = (newState: CardState) => {
    console.log(`Cashback: Card state changed to ${newState}`);
    
    if (newState !== cardState) {
      setIsTransitioning(true);
    }
  };
  
  // Handle animation completion and state changes
  const handleAnimationComplete = useCallback(() => {
    console.log('Cashback: Animation completed, transitioning to initial state');
    
    // Allow a short delay to ensure animations complete properly
    setTimeout(() => {
      // Set to initial state
      setCardState('initial');
      // Mark transition as complete
      setIsTransitioning(false);
    }, 50);
  }, []);
  
  // For debugging
  useEffect(() => {
    console.log(`Current card state: ${cardState}, transitioning: ${isTransitioning}`);
  }, [cardState, isTransitioning]);

  return (
    <BaseScreen onNext={onNext}>
      {/* Main container for the device frame - everything must stay within this boundary */}
      <motion.div 
        className="w-[800px] h-[500px] relative overflow-hidden rounded-[4px] border border-white/20"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 1 }}
      >
        <motion.div 
          className="w-full h-full bg-black relative overflow-hidden flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
        >
          <LocalPass
            amount={amount}
            initialState={cardState}
            isExpanded={cardState === 'expanded'}
            onClick={handleNextClick}
            onStateChange={handleStateChange}
            lottieAnimation={cashBackAnimation}
            noAnimation={false}
            useRandomValues={false}
            headerText="Local Cash"
            subheaderText="Earned for tipping at local businesses"
            buttonText="Accept Cash"
            onAnimationComplete={handleAnimationComplete}
            autoPlay={true}
          />
        </motion.div>
      </motion.div>
    </BaseScreen>
  );
}; 