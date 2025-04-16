import { BaseScreen } from '../../components/common/BaseScreen/index';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

// Initial cart data
const initialCartData = {
  items: [
    { id: 1, name: 'Item name', price: 10.80, quantity: 1 }
  ],
  taxRate: 0.00
};

// Generate a random item name and price
// const generateRandomItem = (id: number): CartItem => {
//   const itemNames = [
//     'Coffee', 'Sandwich', 'Salad', 'Pastry', 
//     'Smoothie', 'Burger', 'Pizza', 'Soda',
//     'Chips', 'Cookie', 'Muffin', 'Water'
//   ];
//   const name = itemNames[Math.floor(Math.random() * itemNames.length)];
//   // Random price between $3 and $25
//   const price = Math.round((Math.random() * 22 + 3) * 100) / 100;
//   return { id, name, price, quantity: 1 };
// };

export const Cart = ({ 
  onNext,
  cartItems,
  onCartUpdate
}: { 
  onNext: (amount?: string) => void;
  cartItems?: CartItem[];
  onCartUpdate?: (items: CartItem[]) => void;
}) => {
  // Use provided cart items or default to initial data
  const [items, setItems] = useState<CartItem[]>(cartItems || initialCartData.items);
  const taxRate = initialCartData.taxRate;
  
  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * taxRate;
  const finalTotal = subtotal + tax;

  // Notify parent of cart changes
  useEffect(() => {
    if (onCartUpdate) {
      onCartUpdate(items);
    }
  }, [items, onCartUpdate]);

  // Update items if cartItems prop changes
  useEffect(() => {
    if (cartItems) {
      setItems(cartItems);
    }
  }, [cartItems]);

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
          {items.length > 0 ? (
            items.map((item, index) => (
              <motion.div 
                key={item.id}
                className="flex justify-between items-center mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="text-2xl">{item.name}</span>
                <span className="text-2xl">${item.price.toFixed(2)}</span>
              </motion.div>
            ))
          ) : (
            <motion.div
              className="text-center py-10 text-white/60 text-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Cart is empty
            </motion.div>
          )}
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
            Sales tax (${taxRate.toFixed(2)})
          </div>
        </motion.div>
      </div>
    </BaseScreen>
  );
}; 