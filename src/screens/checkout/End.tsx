import { BaseScreen } from '../../components/common/BaseScreen';
import { motion } from 'framer-motion';

export const End = ({ onNext }: { onNext: () => void }) => {
  return (
    <BaseScreen onNext={onNext}>
      <div className="w-[800px] h-[500px] bg-black text-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-cash"
        >
          Thank you!
        </motion.div>
      </div>
    </BaseScreen>
  );
}; 