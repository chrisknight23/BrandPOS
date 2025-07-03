import { BaseScreen } from '../components/common/BaseScreen/index';
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
    { id: 1, name: 'Espresso', price: 3.95, quantity: 1 }
  ],
  taxRate: 0.0875 // 8.75% typical US sales tax
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
        className="w-[800px] h-[500px] bg-black text-white rounded-[16px] border border-[#222] shadow-[0_8px_32px_0_rgba(0,0,0,0.18)] flex justify-end"
      >
        {/* Left Panel - Cart Content */}
        <div 
          className="flex-1 px-10 pt-[100px] pb-8 flex flex-col cursor-pointer"
          onClick={handleNext}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleNext()}
          aria-label="Review cart and continue to payment"
        >
          {/* Total Header - Fixed */}
          <div className="text-[72px] font-cash font-medium mb-12">
            ${finalTotal.toFixed(2)}
          </div>

          {/* Items List - Scrollable, now also contains the tax section */}
          <div className="flex-1 overflow-y-auto">
            {items.length > 0 ? (
              <>
                {items.map((item, index) => (
                  <motion.div 
                    key={item.id}
                    className="flex justify-between items-center mb-6"
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="text-[36px] font-cash">{item.name}</span>
                    <span className="text-[36px] font-cash">${item.price.toFixed(2)}</span>
                  </motion.div>
                ))}
                {/* Tax Section - now inside the same container as items */}
                <motion.div 
                  className="mt-2"
                  // No initial/animate for instant appearance
                  >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl">Tax</span>
                    <span className="text-2xl">${tax.toFixed(2)}</span>
                  </div>
                  <div className="text-white/60">
                    Sales tax (${taxRate.toFixed(2)})
                  </div>
                </motion.div>
              </>
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
        </div>

        {/* Right Panel - Brand Card */}
        <div className="bg-black flex flex-col items-center justify-center mt-6 mr-6 mb-6">
          {/* Content Container with Border */}
          <div className="border border-[#333] rounded-[24px] p-5 flex flex-col items-center">
            {/* Brand Pass Card */}
            <div className="w-[161px] h-[213px] bg-[#5D5D3F] rounded-[32px] border-t border-white/20 flex flex-col items-center justify-center p-4 mb-6">
              {/* Avatar/Logo placeholder */}
              <div className="w-16 h-16 bg-[#8B8B6B] rounded-full mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">m</span>
              </div>
            </div>
            
            {/* Brand Name */}
            <div className="text-white/70 text-[14px] font-medium mb-2 text-left w-full">$mileendbagel</div>
            
            {/* Description Text */}
            <div className="text-white text-left text-[20px] leading-[24px] mb-6 w-full">
              Follow us on<br/>
              Cash App and<br/>
              earn rewards
            </div>
            
            {/* Follow Button */}
            <button className="bg-white/15 text-white px-8 py-3 rounded-full text-[18px] font-medium hover:bg-white/20 transition-colors w-full">
              Follow
            </button>
          </div>
        </div>
      </div>
    </BaseScreen>
  );
}; 