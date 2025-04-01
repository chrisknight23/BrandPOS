import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BaseScreen } from '../../components/common/BaseScreen';
import { ScreenProps } from '../../types/screen';

export const CashbackCard = ({ onNext }: ScreenProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (isFlipped) {
      const timer = setTimeout(() => {
        onNext();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isFlipped, onNext]);

  return (
    <BaseScreen onNext={onNext} className="bg-gray-50">
      <div 
        className="relative w-80 h-96 cursor-pointer perspective-1000"
        onClick={() => setIsFlipped(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setIsFlipped(true)}
        aria-label="Tap to flip card"
      >
        <motion.div
          className="relative w-full h-full preserve-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Front of card */}
          <motion.div
            className="absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Cash Back</h2>
            <div className="text-5xl font-bold text-green-600">$5</div>
            <p className="mt-4 text-gray-500 text-center">Tap to view QR code</p>
          </motion.div>

          {/* Back of card (QR code) */}
          <motion.div
            className="absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">QR Code</span>
            </div>
            <p className="mt-4 text-gray-500 text-center">Scan to complete</p>
          </motion.div>
        </motion.div>
      </div>
    </BaseScreen>
  );
}; 