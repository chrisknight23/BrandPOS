import { motion } from 'framer-motion';

interface DevNavProps {
  onBack: () => void;
  onRefresh: () => void;
  onNext: () => void;
}

export const DevNav = ({ onBack, onRefresh, onNext }: DevNavProps) => {
  return (
    <motion.div 
      className="fixed top-4 left-4 z-50 flex gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <button
        onClick={onBack}
        className="w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-md flex items-center justify-center backdrop-blur-sm transition-colors"
        aria-label="Go back"
      >
        ←
      </button>
      <button
        onClick={onRefresh}
        className="w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-md flex items-center justify-center backdrop-blur-sm transition-colors"
        aria-label="Refresh screen"
      >
        ↻
      </button>
      <button
        onClick={onNext}
        className="w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-md flex items-center justify-center backdrop-blur-sm transition-colors"
        aria-label="Go to next screen"
      >
        →
      </button>
    </motion.div>
  );
}; 