import { BaseScreen } from '../components/common/BaseScreen/index';
import { ScreensaverCard } from '../components/common/ScreensaverCard';
import { AnimatedQRCode } from '../components/common/AnimatedQRCode';
import { ToggleButton } from '../components/ui/ToggleButton';
import { BRAND_COLORS } from '../constants/colors';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTextContent } from '../context/TextContentContext';
import QRIcon from '../assets/images/24/qr.svg';
import SMSIcon from '../assets/images/24/comm-sms.svg';

// PWA detection utility
const isPWAMode = () => {
  const standaloneMode = window.matchMedia('(display-mode: standalone)').matches;
  const fullscreenMode = window.matchMedia('(display-mode: fullscreen)').matches;
  const navigatorStandalone = (window.navigator as any).standalone === true;
  
  return standaloneMode || fullscreenMode || navigatorStandalone;
};

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
  const { getText } = useTextContent();
  // Use provided cart items or default to initial data
  const [items, setItems] = useState<CartItem[]>(cartItems || initialCartData.items);
  const [cardCentered, setCardCentered] = useState(false);
  const [toggleIndex, setToggleIndex] = useState(0); // Track toggle button state
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
        className="w-full h-full bg-black text-white rounded-[16px] shadow-[0_8px_32px_0_rgba(0,0,0,0.18)] flex justify-end"
      >
        {/* Left Panel - Cart Content */}
        <motion.div 
          className="flex-1 px-10 pt-[100px] pb-8 flex flex-col cursor-pointer"
          onClick={handleNext}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleNext()}
          aria-label="Review cart and continue to payment"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            duration: 0.3,
            ease: [0.32, 0.72, 0, 1]
          }}
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
                    Sales tax (${taxRate.toFixed(2)}%)
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
        </motion.div>

        {/* Lightbox overlay - appears when card is centered */}
        {cardCentered && (
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            style={{ zIndex: 10 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.3,
              ease: [0.32, 0.72, 0, 1]
            }}
          />
        )}

        {/* Right controls - appears when card is centered */}
        {cardCentered && (
          <motion.div 
            className="absolute right-0 top-0 h-full flex flex-col justify-center items-center p-8"
            style={{ zIndex: 30 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.3,
              ease: "easeOut"
            }}
          >
            {/* Toggle Button */}
            <ToggleButton
              selectedIndex={toggleIndex}
              onToggle={(index: number) => {
                setToggleIndex(index);
              }}
              icons={[
                // QR icon (index 0)
                <img src={QRIcon} alt="QR Code" className="w-6 h-6 block" />,
                // SMS icon (index 1)
                <img src={SMSIcon} alt="SMS" className="w-6 h-6 block" />
              ]}
            />

            {/* Close button positioned at bottom */}
            <motion.button
              onClick={() => setCardCentered(false)}
              className="w-16 h-16 rounded-full bg-black border border-white/20 flex items-center justify-center absolute bottom-8"
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
              tabIndex={0}
              aria-label="Close and return to cart"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>
          </motion.div>
        )}

        {/* Right Panel - Brand Card (Same as ScreensaverExit) */}
        <div className="bg-black h-full flex flex-col py-6 pr-6">
          {/* Content Container with Border */}
          <div className="border border-[#333] rounded-[24px] flex flex-col h-full m-0 p-5" style={{ width: '201px' }}>
            {/* Empty space where card will land */}
            <div className="w-[161px] h-[213px] mb-6">
              {/* Empty placeholder for card landing area */}
            </div>
            
            {/* Brand Name */}
            <div className="text-white/70 text-[14px] font-medium mb-2 text-left w-full">$mileendbagel</div>
            
            {/* Description Text - now with flex-1 to fill available space */}
            <div 
              className="flex-1 text-white text-left text-[20px] leading-[24px] w-full line-clamp-3"
              dangerouslySetInnerHTML={{ __html: getText('rightRail') }}
            />
            
            {/* Follow Button - removed mb-6 from text above since button will be pushed to bottom */}
            <button 
              onClick={() => setCardCentered(true)}
              className="mt-6 bg-white/15 text-white px-8 py-3 rounded-full text-[18px] font-medium hover:bg-white/20 transition-colors w-full"
            >
              Follow
            </button>
          </div>

          {/* ScreensaverCard positioned in the right rail (landed state) */}
          <motion.div
            className="absolute top-[44px] right-[45px] w-[161px] h-[213px] flex items-center justify-center"
            style={{ 
              zIndex: 20,
              // Adjust initial position in PWA mode - bring it up from 64px to 52px
              top: isPWAMode() ? '52px' : '44px'
            }}
            animate={{
              // Center the card horizontally in PWA mode when flipped
              x: cardCentered ? (isPWAMode() ? '-50vw' : -281) : 0,
              // Center vertically in viewport when flipped in PWA mode
              y: cardCentered ? (isPWAMode() ? '50vh' : 100) : 0,
              // Center the card relative to viewport in PWA mode
              left: cardCentered && isPWAMode() ? '50%' : 'auto',
              top: cardCentered && isPWAMode() ? '50%' : 'auto',
              transform: cardCentered && isPWAMode() ? 'translate(-50%, -50%)' : 'none'
            }}
            transition={{
              duration: 0.8,
              ease: [0.32, 0.72, 0, 1]
            }}
          >
            <motion.div
              initial={{
                scale: 0.45,
                scaleX: 1,
                rotateZ: 0
              }}
              animate={{
                scale: cardCentered ? 1 : 0.45,
                scaleX: cardCentered ? 1 : 1,
                rotateZ: cardCentered ? 0 : 0
              }}
              transition={{
                duration: 0.8,
                ease: [0.32, 0.72, 0, 1]
              }}
              style={{ 
                transformOrigin: 'center'
              }}
            >
              <ScreensaverCard 
                backgroundColor={BRAND_COLORS.primary}
                brandName="$mileendbagel"
                initialPhase="normal"        // Start in normal state (landed)
                targetPhase="normal"         // Stay in normal state
                autoStart={false}           // No animation needed
                startDelay={0}              
                onExpandStart={() => {}}
                showFrontContent={false}    // Hide header and button, show only logo
                showBackContent={true}      // Show QR code on back face when centered
                flipToQR={cardCentered}     // Use the flipToQR prop to show QR code when centered
                customBackContent={
                  <div className="w-full h-full flex flex-col items-center justify-center p-8">
                    {/* QR code container with opacity transition */}
                    <motion.div 
                      className="relative overflow-hidden"
                      style={{ maxHeight: '300px' }}
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: cardCentered ? 1 : 0
                      }}
                      transition={{
                        duration: 0.3,
                        ease: [0.32, 0.72, 0, 1]
                      }}
                    >
                      <AnimatedQRCode
                        value={`https://chrisk.ngrok.app/landing/follow-session`}
                        size={260}
                        animateIn={cardCentered ? "sequential" : false}
                        disableAnimation={false}
                        speed={100.0}
                        darkColor="#FFFFFF"
                        lightColor="transparent"
                        placeholderOpacity={1.0}
                        logo="cash-icon"
                        className="max-h-[260px] overflow-hidden"
                        onAnimationComplete={() => {
                          console.log("QR animation complete");
                        }}
                      />
                    </motion.div>
                  </div>
                }
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </BaseScreen>
  );
}; 