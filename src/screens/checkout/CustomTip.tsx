import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BaseScreen } from '../../components/common/BaseScreen/index';
import ClearIcon from '../../assets/images/clear.svg';
import { useUserType } from '../../context/UserTypeContext';

interface CustomTipProps {
  onNext: (amount: string) => void;
  goBack?: () => void;
  baseAmount?: string;
}

export const CustomTip = ({ onNext, goBack, baseAmount = '0' }: CustomTipProps) => {
  const [cents, setCents] = useState<number>(0);
  const [shake, setShake] = useState<boolean>(false);
  const tipAmount = cents / 100;
  // subtotal (base + tip) before tax
  const preTaxTotal = parseFloat(baseAmount) + tipAmount;
  // total including 8.75% tax for display
  const displayTotal = (preTaxTotal * 1.0875).toFixed(2);
  // format the typed tip only (cents)
  const amount = tipAmount.toFixed(2);
  
  const { userType } = useUserType();
  
  const handleNumberPress = (num: string) => {
    // Only digits; ignore decimal input
    if (num === '.') return;
    const digit = parseInt(num, 10);
    if (isNaN(digit)) return;
    setCents(prev => prev * 10 + digit);
  };
  
  const handleBackspace = () => {
    // Shake if at zero
    if (cents === 0) {
      setShake(true);
      return;
    }
    // Remove last digit
    setCents(prev => Math.floor(prev / 10));
  };
  
  const handleAddTip = () => {
    if (cents === 0) {
      setShake(true);
      return;
    }
    // pass only the tip amount (no tax) to onNext
    onNext(amount);
  };
  
  const handleCancel = () => {
    if (goBack) {
      goBack();
    }
  };
  
  // Keypad numbers and actions
  const keypadItems = [
    '1', '2', '3', 
    '4', '5', '6', 
    '7', '8', '9', 
    '.', '0', 'del'
  ];

  return (
    <BaseScreen onNext={() => {}}>
      <div className="w-[800px] h-[500px] relative overflow-hidden rounded-[8px] border border-[#222]">
        {/* Main container */}
        <motion.div 
          className="w-full h-full bg-black text-white p-8 flex flex-col"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-[24px] font-cash font-medium">
              Custom tip <span className="font-cash font-normal text-white/40">
                ${displayTotal} {cents > 0 ? 'with tip' : 'total'}
              </span>
            </h2>
            <button 
              onClick={handleCancel}
              className="text-[24px] font-cash font-medium"
            >
              Cancel
            </button>
          </div>
          
          {/* Current amount display */}
          <div className="flex items-center justify-start mb-4">
            <motion.span
              className="text-[72px] font-medium font-cash"
              animate={shake ? { x: [0, -8, 8, -8, 8, 0] } : {}}
              transition={{ duration: 0.3 }}
              onAnimationComplete={() => setShake(false)}
            >
              ${amount}
            </motion.span>
          </div>
          
          {/* Keypad and Add Tip button */}
          <div className="flex gap-4 flex-1">
            {/* Keypad grid */}
            <div className="grid grid-cols-3 gap-2 flex-1">
              {keypadItems.map((item) => (
                <button
                  key={item}
                  onClick={() => item === 'del' ? handleBackspace() : handleNumberPress(item)}
                  className="bg-[#222222] rounded-[12px] flex items-center justify-center text-[24px] font-medium font-cash active:bg-[#333333] transition-colors"
                >
                  {item === 'del' ? (
                    <img src={ClearIcon} alt="Clear input" className="w-6 h-6" />
                  ) : item}
                </button>
              ))}
            </div>
            
            {/* Add tip button */}
            <div className="w-[350px]">
              <button
                onClick={handleAddTip}
                className={`w-full h-full rounded-2xl flex items-center justify-center text-[32px] font-cash font-medium transition-colors
                  ${userType === 'cash-local' 
                    ? 'bg-[#00B843] active:bg-[#009C36]' 
                    : 'bg-[#1189D6] active:bg-[#0D7BC3]'}
                `}
              >
                Add tip
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </BaseScreen>
  );
};

export default CustomTip; 