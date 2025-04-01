import { useEffect } from 'react';
import { motion } from 'framer-motion';

interface QRMomentProps {
  onNext: () => void;
}

export const QRMoment = ({ onNext }: QRMomentProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onNext();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div className="flex items-center justify-center w-full h-full bg-black">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative"
      >
        {/* Glow effect */}
        <motion.div
          animate={{
            boxShadow: [
              "0 0 20px rgba(59, 130, 246, 0.5)",
              "0 0 40px rgba(59, 130, 246, 0.3)",
              "0 0 20px rgba(59, 130, 246, 0.5)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-3xl bg-blue-500/20 blur-2xl"
        />

        {/* QR Code container */}
        <div className="relative w-64 h-64 bg-white rounded-3xl p-6 flex items-center justify-center">
          <div className="w-full h-full bg-gray-100 rounded-2xl flex items-center justify-center">
            <span className="text-gray-500">QR Code</span>
          </div>
        </div>

        {/* Scan text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-white text-lg font-medium"
        >
          Scan to complete
        </motion.p>
      </motion.div>
    </div>
  );
}; 