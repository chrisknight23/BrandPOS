import { BaseScreen } from '../../components/common/BaseScreen/index';
import { motion } from 'framer-motion';

// Mock data - in real app this would come from props or context
const cartData = {
  items: [
    { name: 'Item name', price: 10.80, quantity: 1 }
  ],
  taxRate: 0.00
};

export const Cart = ({ onNext }: { onNext: (amount?: string) => void }) => {
  const total = cartData.items.reduce((sum, item) => sum + item.price, 0);
  const tax = total * cartData.taxRate;
  const finalTotal = total + tax;

  const handleNext = () => {
    onNext(finalTotal.toFixed(2));
  };

  return (
    <BaseScreen onNext={handleNext}>
      <div 
        className="w-[800px] h-[500px] bg-black text-white p-8 flex flex-col cursor-pointer rounded-[4px] border border-white/20"
        onClick={handleNext}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleNext()}
        aria-label="Review cart and continue to payment"
      >
        {/* Total Header - Fixed */}
        <motion.div 
          className="text-6xl font-normal mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          ${finalTotal.toFixed(2)}
        </motion.div>

        {/* Items List - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {cartData.items.map((item, index) => (
            <motion.div 
              key={index}
              className="flex justify-between items-center mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <span className="text-2xl">{item.name}</span>
              <span className="text-2xl">${item.price.toFixed(2)}</span>
            </motion.div>
          ))}
        </div>

        {/* Tax Section */}
        <motion.div 
          className="mt-6 border-t border-white/20 pt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-2xl">Tax</span>
            <span className="text-2xl">${tax.toFixed(2)}</span>
          </div>
          <div className="text-white/60">
            Sales tax (${cartData.taxRate.toFixed(2)})
          </div>
        </motion.div>
      </div>
    </BaseScreen>
  );
}; 