import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BaseScreen } from '../../components/common/BaseScreen/index';

interface CustomTipProps {
  onNext: (amount: string) => void;
  goBack?: () => void;
}

export const CustomTip = ({ onNext, goBack }: CustomTipProps) => {
  const [amount, setAmount] = useState<string>('0');
  
  const handleNumberPress = (num: string) => {
    // Only allow one decimal point
    if (num === '.' && amount.includes('.')) return;
    
    // Logic to handle display of amount
    if (amount === '0' && num !== '.') {
      setAmount(num);
    } else {
      setAmount(prev => prev + num);
    }
  };
  
  const handleBackspace = () => {
    if (amount.length <= 1) {
      setAmount('0');
    } else {
      setAmount(prev => prev.slice(0, -1));
    }
  };
  
  const handleAddTip = () => {
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
      <div className="w-[800px] h-[500px] relative overflow-hidden rounded-[4px] border border-white/20">
        {/* Main container */}
        <motion.div 
          className="w-full h-full bg-black text-white p-6 flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-cash">Add a tip ${amount} total</h2>
            <button 
              onClick={handleCancel}
              className="text-2xl font-cash"
            >
              Cancel
            </button>
          </div>
          
          {/* Current amount display */}
          <div className="flex items-center justify-start mb-8">
            <span className="text-8xl font-bold font-cash">${amount}</span>
          </div>
          
          {/* Keypad and Add Tip button */}
          <div className="flex gap-6 flex-1">
            {/* Keypad grid */}
            <div className="grid grid-cols-3 gap-3 flex-1">
              {keypadItems.map((item) => (
                <button
                  key={item}
                  onClick={() => item === 'del' ? handleBackspace() : handleNumberPress(item)}
                  className="bg-[#222222] rounded-xl flex items-center justify-center text-3xl font-medium font-cash active:bg-[#333333] transition-colors"
                >
                  {item === 'del' ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="2"/>
                      <path d="M8 12H16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  ) : item}
                </button>
              ))}
            </div>
            
            {/* Add tip button */}
            <div className="w-[400px]">
              <button
                onClick={handleAddTip}
                className="w-full h-full bg-[#1189D6] rounded-xl flex items-center justify-center text-4xl font-cash active:bg-[#0D7BC3] transition-colors"
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