import { BaseScreen } from '../components/common/BaseScreen';
import { motion } from 'framer-motion';
import { useEffect, useState, useMemo, useRef } from 'react';
import { Screen } from '../types/screen';
import { useUserType } from '../context/UserTypeContext';
import LocalCustomer from '../components/common/LocalCustomer';
import AnimatedMessage from '../components/common/AnimatedMessage/';
import ProgressButton from '../components/common/ProgressButton';

interface EndProps {
  onNext: () => void;
  amount?: string;       // Total amount (may be pre-calculated)
  baseAmount?: string;   // Base amount from Cart/Payment
  tipAmount?: string;    // Tip amount from Tipping screen
  goToScreen?: (screen: Screen) => void; // Add prop for direct navigation
  taxRate?: number;
  isPaused?: boolean;
  setIsPaused?: (paused: boolean) => void;
}

export const End = ({ onNext, amount, baseAmount, tipAmount = "0", goToScreen, taxRate = 0.0875, isPaused }: EndProps) => {
  const [total, setTotal] = useState(amount || baseAmount || "0");
  const [progress, setProgress] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);
  const [hasTip, setHasTip] = useState(false);
  const { userType } = useUserType();
  const [showFirst, setShowFirst] = useState(true);
  const [progressReady, setProgressReady] = useState(false); // Wait for fade-in

  // Timer constants
  const timerDuration = 12000; // 12 seconds total
  const initialDelay = 1500; // 1.5 second delay before timer starts

  // Start timer after fade-in completes
  useEffect(() => {
    if (!progressReady) return;
    const delayTimer = setTimeout(() => {
      setTimerStarted(true);
    }, initialDelay);
    return () => clearTimeout(delayTimer);
  }, [progressReady]);

  // Minimal, reliable timer effect
  useEffect(() => {
    if (!timerStarted || isPaused) return;
    const startTime = Date.now() - progress * timerDuration;
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(elapsed / timerDuration, 1);
      setProgress(newProgress);
      if (newProgress >= 1) {
        clearInterval(timer);
        if (goToScreen) {
          goToScreen('Home');
        } else {
          onNext();
        }
      }
    }, 50);
    return () => clearInterval(timer);
  }, [timerStarted, isPaused]);

  // Generate a random cash value under $30 for the local customer, persisted in sessionStorage for the session
  const randomCashValue = useMemo(() => {
    const key = 'localCustomerCashValue';
    const stored = sessionStorage.getItem(key);
    if (stored) return stored;
    const value = (Math.random() * 30).toFixed(2);
    sessionStorage.setItem(key, value);
    return value;
  }, []);

  // Calculate the total (base + tip) then apply tax to that subtotal
  useEffect(() => {
    // Log received values for debugging
    console.log(`End: Received amount=${amount}, baseAmount=${baseAmount}, tipAmount=${tipAmount}`);

    // Use amount directly if available
    if (amount) {
      console.log(`End: Using provided amount=${amount}`);
      setTotal(amount);
      return;
    }
    
    // If no amount but we have baseAmount (already includes tax from Cart)
    if (baseAmount) {
      const baseValue = parseFloat(baseAmount);
      const tipValue = tipAmount ? parseFloat(tipAmount) : 0;
      const totalValue = baseValue + tipValue;
      
      console.log(`End: Calculated total=${totalValue.toFixed(2)} from baseAmount=${baseAmount} (includes tax) and tipAmount=${tipAmount}`);
      setTotal(totalValue.toFixed(2));
    } else {
      console.log(`End: No valid amount values provided`);
      setTotal("0.00");
    }
    
    setHasTip((tipAmount ? parseFloat(tipAmount) : 0) > 0);
  }, [amount, baseAmount, tipAmount]);
  
  useEffect(() => {
    // Show 'Local Cash sent' for 2.5s, then switch to 'Thanks for shopping local'
    const timer = setTimeout(() => setShowFirst(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Set background color based on userType
  const bgColor = userType === 'cash-local' ? '#00B843' : '#1189D6';
  const showReceiptButton = userType !== 'cash-local';
  const showProgressBar = showReceiptButton && !showFirst;

  return (
    <BaseScreen onNext={onNext}>
      <div className="w-[800px] h-[500px] text-white p-10 flex flex-col justify-between rounded-[8px] relative"
        style={{ backgroundColor: bgColor }}
      >
        <motion.div
          className="flex flex-row items-start justify-between mb-6 px-4 mt-2 h-16"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Left: Paid text and thanks */}
          <div className="flex flex-col space-y-6">
            <h2 className="text-2xl font-cash font-medium">
              Paid ${total} {hasTip && <span className="font-normal text-white/60">with tip</span>}
            </h2>
            <AnimatedMessage show key={showFirst ? 'first' : 'second'}>
              {showFirst ? (
                <>Welcome to<br />Cash App Local</>
              ) : (
                <>Thanks for<br />shopping local</>
              )}
            </AnimatedMessage>
          </div>
          {/* Right: LocalCustomer profile */}
          {userType === 'cash-local' && (
            <div className="flex items-center">
              <LocalCustomer
                cashValue={randomCashValue}
                profileImage={"https://randomuser.me/api/portraits/men/32.jpg"}
              />
            </div>
          )}
        </motion.div>
        
        <motion.div
          className="absolute bottom-[40px] right-[40px]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {showReceiptButton && !showFirst && (
            <ProgressButton
              label="Get receipt"
              progress={progress}
              onClick={() => {
                if (goToScreen) {
                  goToScreen('Home');
                } else {
                  onNext();
                }
              }}
              show={true}
              paused={isPaused}
              onFadeInComplete={() => setProgressReady(true)}
            />
          )}
        </motion.div>
      </div>
    </BaseScreen>
  );
}; 