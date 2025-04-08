import { BaseScreen } from '../../components/common/BaseScreen';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface EndProps {
  onNext: () => void;
  amount?: string;       // Total amount (may be pre-calculated)
  baseAmount?: string;   // Base amount from Cart/TapToPay
  tipAmount?: string;    // Tip amount from Tipping screen
}

export const End = ({ onNext, amount, baseAmount = "10.80", tipAmount = "0" }: EndProps) => {
  const [total, setTotal] = useState(amount || baseAmount);

  // Calculate the total with tip when props change
  useEffect(() => {
    // If amount is provided directly, use it
    if (amount) {
      setTotal(amount);
      return;
    }
    
    // Otherwise calculate from base and tip
    if (baseAmount) {
      const base = parseFloat(baseAmount);
      const tip = tipAmount ? parseFloat(tipAmount) : 0;
      const totalWithTip = base + tip;
      setTotal(totalWithTip.toFixed(2));
    }
  }, [amount, baseAmount, tipAmount]);

  return (
    <BaseScreen onNext={onNext}>
      <div className="w-[800px] h-[500px] bg-[#1189D6] text-white p-10 flex flex-col justify-between rounded-[4px] border border-white/20 relative">
        <motion.div
          className="flex flex-col space-y-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-cash font-medium">
            Paid ${total} <span className="font-normal text-white/60">with tip</span>
          </h2>
          
          <h1 className="text-[56px] font-cash font-semibold leading-[48px] tracking-[-0.04em]">
            Thanks for<br />
            shopping local
          </h1>
        </motion.div>
        
        <motion.div
          className="absolute bottom-[40px] right-[40px]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <button 
            onClick={onNext}
            className="bg-black/15 hover:bg-black/25 transition-colors py-5 px-8 rounded-lg text-[32px] font-cash font-medium text-white w-[340px] h-[96px] text-center"
          >
            Get receipt
          </button>
        </motion.div>
      </div>
    </BaseScreen>
  );
}; 