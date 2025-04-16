import { useEffect, useState } from 'react';
import { BaseScreen } from '../../components/common/BaseScreen/index';
import { motion } from 'framer-motion';
import CreditCardCursor from '../../components/common/CreditCardCursor';

interface AuthProps {
  onNext: () => void;
  customerName?: string;
}

// Animation state types for visual elements
type AnimationState = 'initial' | 'active' | 'success' | 'completed';

export const Auth = ({ onNext, customerName = "Customer" }: AuthProps) => {
  const [animationState, setAnimationState] = useState<AnimationState>('initial');
  const [showCardCursor, setShowCardCursor] = useState(false);

  useEffect(() => {
    // Show card cursor after a delay
    const cursorTimer = setTimeout(() => {
      setShowCardCursor(true);
    }, 300);

    return () => {
      clearTimeout(cursorTimer);
    };
  }, []);

  const handleAuthenticated = () => {
    setAnimationState('success');
    
    // Transition to success and then complete
    setTimeout(() => {
      setAnimationState('completed');
      
      // Proceed to next screen after completion
      setTimeout(() => {
        onNext();
      }, 800);
    }, 1200);
  };

  return (
    <BaseScreen onNext={onNext}>
      <div className="w-[800px] h-[500px] bg-[#1189D6] relative overflow-hidden flex items-center justify-center rounded-[4px]">
        {/* Customer Name Display - static size matching Payment screen */}
        <div className="text-white text-[110px] leading-none font-medium">
          {customerName}
        </div>
        
        {/* Credit card cursor */}
        <CreditCardCursor active={showCardCursor} onTapComplete={handleAuthenticated} />
      </div>
    </BaseScreen>
  );
};
