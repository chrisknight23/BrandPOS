import { BaseScreen } from '../../components/common/BaseScreen';
import { motion, AnimatePresence } from 'framer-motion';
import LocalCashIcon from '../../assets/images/Local-Cash-32px.svg';
import { TipButton } from '../../components/common/TipButton';
import { useState } from 'react';

export const Tipping = ({ onNext }: { onNext: (amount?: string) => void }) => {
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);

  const handleAmountClick = (amount: string) => {
    setSelectedAmount(amount);
    // Add a slight delay to allow the animation to play
    // setTimeout(() => onNext(amount), 200); // Temporarily disabled for local expansion work
  };

  return (
    <BaseScreen onNext={onNext}>
      {/* Main container needs relative positioning for the absolute positioned expanded card */}
      <motion.div 
        className="relative w-[800px] h-[500px] bg-black text-white p-6 flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header Container - Conditionally hide if a button is selected */}
        <AnimatePresence>
          {!selectedAmount && (
            <motion.div 
              className="flex items-center justify-between mb-6 px-4 mt-2 h-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 0.2, // Faster fade out
                delay: 0, 
              }}
            >
              {/* Left side: Avatar and Title */}
              <div className="flex items-center gap-3">
                {/* Avatar placeholder */}
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white/15" />
                {/* "Tip Alice?" title */}
                <h2 className="text-[24px] font-medium font-cash">Tip Alice?</h2>
              </div>

              {/* Right side: Local Cash Button */}
              <div className="relative">
                {/* Expandable button container */}
                <motion.div 
                  className="flex items-center bg-black border border-white/20 rounded-full overflow-hidden"
                  initial={{ width: "56px" }}
                  animate={{ width: "auto" }}
                  transition={{
                    duration: 0.5,
                    delay: 0.4,
                    ease: [0.32, 0.72, 0, 1]
                  }}
                >
                  {/* "Local Cash" text - slides in from right */}
                  <motion.span 
                    className="text-[18px] font-medium font-cash whitespace-nowrap pl-6"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.5,
                      ease: [0.32, 0.72, 0, 1]
                    }}
                  >
                    Local Cash
                  </motion.span>
                  {/* Local Cash icon - stays fixed in position */}
                  <div className="py-4 pr-4 ml-2">
                    <img src={LocalCashIcon} alt="Local Cash" className="w-8 h-8" />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Tip Amount Buttons Container */}
        {/* This container defines the grid layout. Only render the selected button OR all buttons */}
        <div className="grid grid-cols-3 gap-3 flex-1 mb-3">
          {['1', '2', '3'].map((amount) => (
            // Only render the button if nothing is selected OR if it's the selected one
            (!selectedAmount || selectedAmount === amount) && (
              <TipButton
                key={amount}
                layoutId={`amount-${amount}`}
                amount={amount}
                onClick={() => handleAmountClick(amount)}
                isSelected={selectedAmount === amount}
              />
            )
          ))}
        </div>

        {/* Bottom Buttons - Conditionally hide if a button is selected */}
        <AnimatePresence>
          {!selectedAmount && (
            <motion.div 
              className="grid grid-cols-2 gap-3 mt-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }} // Add exit animation
              transition={{ 
                duration: 0.2, // Faster fade out
                delay: 0 // Sync with header fade out
              }}
            >
              {['Custom', 'No tip'].map((text) => (
                <button
                  key={text}
                  onClick={() => onNext()} // Keep original onNext for these buttons
                  className="py-6 bg-white/15 rounded-2xl text-[32px] font-medium font-cash active:bg-white/20 transition-colors"
                >
                  {text}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Remove the separate Background overlay, the expanded button provides its own background */}
      {/* 
      <AnimatePresence>
        {selectedAmount && (
          <motion.div
            className="absolute w-[800px] h-[500px] bg-black rounded-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>
      */}
    </BaseScreen>
  );
}; 