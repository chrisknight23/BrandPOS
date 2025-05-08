import { BaseScreen } from '../../components/common/BaseScreen';
import { LocalPass } from '../../components/common/LocalPass';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQRCodeScanStatus } from '../../hooks/useQRCodeScanStatus';

interface CashoutProps {
  amount?: string;
  onComplete?: () => void;
  sessionId?: string;
}

export const Cashout = ({ amount = '3', onComplete, sessionId }: CashoutProps) => {
  // Animation sequence state
  const [flipped, setFlipped] = useState(true); // start on back
  const [cardState, setCardState] = useState<'initial' | 'expanded' | 'dropped'>('initial');
  const [slideOut, setSlideOut] = useState(false);
  
  // Add QR code polling for handoff status
  const [isPolling, setIsPolling] = useState(false);
  const { scanned, handoffComplete, appReady } = useQRCodeScanStatus(
    isPolling && sessionId ? sessionId : ''
  );

  // Log state changes for debugging
  useEffect(() => {
    console.log(`Cashout: Animation states - flipped: ${flipped}, cardState: ${cardState}, slideOut: ${slideOut}`);
  }, [flipped, cardState, slideOut]);
  
  // Log API status changes
  useEffect(() => {
    if (sessionId) {
      console.log(`Cashout: API status - scanned: ${scanned}, handoffComplete: ${handoffComplete}, appReady: ${appReady}`);
    }
  }, [sessionId, scanned, handoffComplete, appReady]);

  // Start polling when component mounts
  useEffect(() => {
    if (sessionId) {
      console.log('Cashout: Starting polling with sessionId:', sessionId);
      setIsPolling(true);
    }
  }, [sessionId]);

  // Flip card to front immediately on mount
  useEffect(() => {
    // Short delay to ensure smooth transition after screen change
    const flipTimeout = setTimeout(() => {
      console.log('Cashout: Flipping card to front');
      setFlipped(false);
    }, 300);
    
    return () => clearTimeout(flipTimeout);
  }, []);

  // Complete animation sequence ONLY when appReady is true
  useEffect(() => {
    if (appReady) {
      console.log('Cashout: App ready received, completing animation sequence');
      
      // Move to compact/dropped state
      setCardState('dropped');
      
      // Short delay before slide out for visual flow
      const slideTimeout = setTimeout(() => {
        console.log('Cashout: Starting slide out animation');
        setSlideOut(true);
      }, 400);
      
      return () => {
        clearTimeout(slideTimeout);
      };
    }
  }, [appReady]);

  // Fallback animation if no appReady signal is received after a timeout
  useEffect(() => {
    if (!sessionId) {
      // If no sessionId, run automatic sequence after longer delay
      const compactTimeout = setTimeout(() => {
        console.log('Cashout: Fallback - setting card to dropped state');
        setCardState('dropped');
      }, 4000);
      
      const slideTimeout = setTimeout(() => {
        console.log('Cashout: Fallback - starting slide out animation');
        setSlideOut(true);
      }, 4800);
      
      return () => {
        clearTimeout(compactTimeout);
        clearTimeout(slideTimeout);
      };
    }
  }, [sessionId]);

  // After slide out, wait for animation to complete, then navigate to End screen
  useEffect(() => {
    if (slideOut && onComplete) {
      const endTimeout = setTimeout(() => {
        console.log('Cashout: Animation complete, navigating to End screen');
        onComplete();
      }, 1200); // Reduced from 2000ms to 1200ms since we're not staggering animations anymore
      
      return () => clearTimeout(endTimeout);
    }
  }, [slideOut, onComplete]);

  return (
    <BaseScreen onNext={onComplete}>
      <div className="w-[800px] h-[500px] bg-black flex items-center justify-center relative overflow-hidden rounded-[16px] border border-[#222]">
        <motion.div
          initial={{ y: 0 }}
          animate={slideOut ? { y: 600 } : { y: 0 }}
          transition={{ 
            type: 'spring', 
            stiffness: 120, 
            damping: 20,
            duration: 0.8
          }}
          className="w-full h-full flex items-center justify-center"
        >
          <LocalPass
            initialState={cardState}
            flipped={flipped}
            showButton={false}
            showHeader={false}
            animateIn={false}
            disableAnimation={true}
            sessionId={sessionId}
          />
        </motion.div>
      </div>
    </BaseScreen>
  );
};

export default Cashout; 