import { BaseScreen } from '../../components/common/BaseScreen';
import { motion } from 'framer-motion';

export const End = ({ onNext }: { onNext: () => void }) => {
  return (
    <BaseScreen onNext={onNext}>
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <h2 className="text-3xl font-bold mb-4">Thank You!</h2>
        <p className="text-xl text-gray-600">Transaction Complete</p>
      </motion.div>
    </BaseScreen>
  );
}; 