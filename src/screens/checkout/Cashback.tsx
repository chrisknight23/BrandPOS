import { LocalPass, CardState } from '../../components/common/LocalPass';
import { useEffect, useState, useCallback } from 'react';
import { BaseScreen } from '../../components/common/BaseScreen/index';
import cashBackAnimation from '../../assets/CashBackLogo.json';
import CashAppLogo from '../../assets/images/CashApplogo.svg';
import { motion, AnimatePresence } from 'framer-motion';

interface CashbackProps {
  onNext: (amount?: string) => void;
  amount?: string;
}

export const Cashback = ({ onNext, amount = "1" }: CashbackProps) => {
  // Format the amount to ensure it's a whole number for the display
  const formattedAmount = Math.round(parseFloat(amount)).toString();
  
  const [cardState, setCardState] = useState<CardState>('expanded');
  // Track whether we're currently transitioning states
  const [isTransitioning, setIsTransitioning] = useState(false);
  // State to control logo visibility
  const [showLogo, setShowLogo] = useState(false);
  
  // Force an explicit reset when entering the screen
  useEffect(() => {
    console.log(`Cashback: Component mounted with tip amount ${amount}`);
    
    // Reset to expanded state on mount
    setCardState('expanded');
    setIsTransitioning(false);
    setShowLogo(false);
    
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
    
    // Show the logo when the card reaches the initial state
    if (newState === 'initial') {
      // Wait a moment after the card reaches initial state to show logo
      setTimeout(() => {
        setShowLogo(true);
      }, 500);
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
    console.log(`Current card state: ${cardState}, transitioning: ${isTransitioning}, logo: ${showLogo}`);
  }, [cardState, isTransitioning, showLogo]);

  return (
    <BaseScreen onNext={onNext}>
      {/* Main container for the device frame - everything must stay within this boundary */}
      <motion.div 
        className="w-[800px] h-[500px] relative overflow-hidden rounded-[4px] border border-white/20"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 1 }}
      >
        {/* Black background for consistency */}
        <div className="absolute inset-0 bg-black" />
        
        {/* Content container */}
        <motion.div 
          className="w-full h-full relative flex items-center justify-center"
          style={{ zIndex: 2 }}
        >
          {/* Original LocalPass card component */}
          <motion.div>
            <LocalPass
              amount={formattedAmount}
              initialState={cardState}
              isExpanded={cardState === 'expanded'}
              onClick={handleNextClick}
              onStateChange={handleStateChange}
              lottieAnimation={cashBackAnimation}
              noAnimation={false}
              useRandomValues={false}
              headerText="Local Cash"
              subheaderText=""
              buttonText="Cash Out"
              onAnimationComplete={handleAnimationComplete}
              autoPlay={true}
              animationDelay={500}
              suffixText="Back"
            />
          </motion.div>
          
          {/* Cash App Logo in bottom left corner - only shown after card animation completes */}
          <AnimatePresence>
            {showLogo && (
              <motion.div 
                className="absolute bottom-8 left-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{ zIndex: 3 }}
              >
                <img src={CashAppLogo} alt="Cash App" width={100} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </BaseScreen>
  );
}; 