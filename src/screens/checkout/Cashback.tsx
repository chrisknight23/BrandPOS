import { LocalPass, CardState } from '../../components/common/LocalPass';
import { useEffect, useState, useCallback } from 'react';
import { useQRCodeScanStatus } from '../../hooks/useQRCodeScanStatus';
import { BaseScreen } from '../../components/common/BaseScreen/index';
import cashBackAnimation from '../../assets/CashBackLogo.json';
import { motion, AnimatePresence } from 'framer-motion';

interface CashbackProps {
  onNext: (amount?: string) => void;
  amount?: string;
  userType?: string;
  onQrVisibleChange?: (visible: boolean) => void;
  sessionId?: string;
}

export const Cashback = ({ onNext, amount = "1", userType, onQrVisibleChange, sessionId }: CashbackProps) => {
  // Determine the base value for returning customers
  const [baseReturningAmount, setBaseReturningAmount] = useState<number | null>(null);

  useEffect(() => {
    if (userType === 'returning') {
      // Generate a random value under $30 for returning customers
      const randomValue = Math.floor(Math.random() * 2900 + 100) / 100; // $1.00 to $29.99
      setBaseReturningAmount(randomValue);
    } else {
      setBaseReturningAmount(null);
    }
  }, [userType]);

  // Calculate the display amount
  let displayAmount: number;
  if (userType === 'returning' && baseReturningAmount !== null) {
    // Add the tip amount (from props.amount) to the base value
    const tip = parseFloat(amount) || 0;
    displayAmount = Math.round((baseReturningAmount + tip) * 100) / 100;
  } else {
    displayAmount = Math.round(parseFloat(amount)) || 1;
  }
  const formattedAmount = displayAmount.toString();

  // QR scan hook and effect
  const [isPolling, setIsPolling] = useState(false);
  const { scanned, handoffComplete, appReady, amount: statusAmount } = useQRCodeScanStatus(isPolling ? sessionId ?? '' : '');

  useEffect(() => {
    setIsPolling(true);
  }, []);

  // Navigate to Cashout immediately when QR is scanned
  useEffect(() => {
    if (scanned) {
      console.log('Cashback: QR code scanned, navigating to Cashout');
      onNext();
    }
  }, [scanned, onNext]);
  
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

  useEffect(() => {
    if (sessionId) {
      console.log('QR code sessionId is:', sessionId);
    }
  }, [sessionId]);

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

  // Example: log or render something special for returning customers
  useEffect(() => {
    if (userType === 'returning') {
      console.log('Cashback: Returning customer detected');
      // You can add more logic here for returning customers
    }
  }, [userType]);

  return (
    <BaseScreen onNext={onNext}>
      {/* Main container for the device frame - everything must stay within this boundary */}
      <motion.div 
        className="w-[800px] h-[500px] relative overflow-hidden rounded-[16px] border border-[#222]"
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
              buttonText="Claim"
              onAnimationComplete={handleAnimationComplete}
              autoPlay={true}
              suffixText="Back"
              onFlip={onQrVisibleChange}
              animateIn="outside-in"
              sessionId={sessionId}
            />
          </motion.div>
          
          {/* Cash App Logo in bottom left corner - only shown after card animation completes */}
          {/* (Logo logic removed for QR visibility tracking) */}
        </motion.div>
      </motion.div>
    </BaseScreen>
  );
}; 