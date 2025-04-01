import { BaseScreen } from '../../components/common/BaseScreen';
import { motion } from 'framer-motion';

export const Home = ({ onNext }: { onNext: () => void }) => {
  return (
    <BaseScreen onNext={onNext}>
      <motion.div 
        className="text-center cursor-pointer w-full h-full flex flex-col items-center justify-center"
        onClick={onNext}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onNext()}
        aria-label="Tap to start checkout"
      >
        <h1 className="text-4xl font-bold mb-4">Welcome</h1>
        <p className="text-xl text-gray-600">Tap anywhere to begin</p>
      </motion.div>
    </BaseScreen>
  );
}; 