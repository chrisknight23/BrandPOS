import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../../ui/button';

interface InteractionViewProps {
  cartItems?: { id: number; name: string; price: number; quantity: number }[];
  onAddItem?: () => void;
  onClearCart?: () => void;
  onRemoveCartItem?: (itemId: number) => void;
  currentScreen?: string;
  simulateScan?: () => void;
  isQrVisible?: boolean;
  goToScreen?: (screen: string) => void;
  isPaused?: boolean;
  setIsPaused?: (paused: boolean) => void;
}

const InteractionView: React.FC<InteractionViewProps> = ({ cartItems = [], onAddItem, onClearCart, onRemoveCartItem, currentScreen, simulateScan, isQrVisible, goToScreen, isPaused, setIsPaused }) => {
  // Animation variants (copied from ExpandableDevPanel)
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    }
  };

  // Header title and description logic (copied from original drawer)
  const getScreenDescription = (screen: string | undefined): string => {
    switch (screen) {
      case 'Home':
        return 'Home Screen: Users see the Square POS welcome screen. This is where merchants start the payment process by adding items to the cart.';
      case 'Cart':
        return 'Cart Screen: Users see the total price ($) at the top and a list of items below with individual prices. They can review their order before tapping to continue to payment.';
      case 'Payment':
        return 'Payment Screen: Users see a blue screen with the amount and payment notches. They tap their Cash Card or contactless payment method to complete the transaction.';
      case 'Tipping':
        return 'Tipping Screen: Users choose from preset tip amounts or select a custom tip. The screen alternates between "Give a Tip" and "Earn Local Cash" prompts.';
      case 'Cashback':
        return 'Cashback Screen: Users can select a cashback amount from preset options or choose no cashback. A Cash App card animation appears when making a selection.';
      case 'End':
        return 'End Screen: Users see a transaction complete message with their total amount. The payment flow is complete and they can start a new transaction.';
      default:
        return screen ? `${screen} Screen: Control hub for this screen. Manage features and test different user experiences.` : '';
    }
  };

  return (
    <div className="w-full h-full flex flex-col min-h-0">
      {/* Header title and sub copy */}
      <div className="pb-1">
        <h2 className="text-white text-[24px] font-cash font-semibold mb-2">
          {currentScreen}
        </h2>
        <div className="relative">
          <p className="text-white/60 text-sm line-clamp-3">
            {getScreenDescription(currentScreen)}
          </p>
        </div>
      </div>
      {/* Main content area: scrollable */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 flex flex-col min-h-0 overflow-auto w-full">
          {/* Cart items now appear just above the bottom buttons, pushing up as items are added */}
          {currentScreen === 'Cart' && (
            <>
              <motion.div
                className="flex items-center justify-between mt-6 pb-2 w-full"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1], exit: { duration: 0.18, ease: [0.32, 0.72, 0, 1] } }}
                layout
              >
                <h3 className="text-white font-medium">Items ({cartItems.length})</h3>
                <button
                  type="button"
                  onClick={onClearCart}
                  className="text-white/50 text-base font-medium hover:text-white transition-colors"
                  disabled={cartItems.length === 0}
                  aria-label="Clear cart"
                >
                  Clear
                </button>
              </motion.div>
              <motion.div className="flex flex-col gap-2 mb-4 w-full" layout transition={{ type: 'spring', stiffness: 420, damping: 32 }}>
                <AnimatePresence initial={false}>
                  {cartItems.length > 0 ? (
                    cartItems.map(item => (
                      <motion.div
                        key={item.id}
                        className="bg-white/5 rounded-lg px-4 py-3 flex items-center justify-between h-16 min-h-16 w-full"
                        transition={{
                          duration: 0.3,
                          ease: [0.32, 0.72, 0, 1],
                          exit: { duration: 0.18, ease: [0.32, 0.72, 0, 1] }
                        }}
                        layout
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <div>
                          <div className="text-white font-medium">{item.name}</div>
                          <div className="text-white/60 text-sm">${item.price.toFixed(2)}</div>
                        </div>
                        <button 
                          onClick={() => onRemoveCartItem && onRemoveCartItem(item.id)}
                          className="p-1.5 text-white/40 hover:text-white/70 hover:bg-white/10 rounded-full"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </motion.div>
                    ))
                  ) : null}
                </AnimatePresence>
              </motion.div>
              <div className="mt-10" />
            </>
          )}
        </div>
        {/* Bottom buttons section pinned to bottom */}
        <div className="space-y-4 mt-auto w-full">
          {(currentScreen === 'Home' || currentScreen === 'Cart') && (
            <div className={`flex ${currentScreen === 'Cart' ? 'flex-row gap-3' : 'flex-col gap-4'} w-full`}>
              {/* Add item button */}
              <button
                onClick={onAddItem}
                className={`rounded-full py-4 flex-1 flex items-center justify-center bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors ${currentScreen === 'Cart' ? '' : 'w-full'}`}
              >
                <div className="flex items-center justify-center text-white">
                  <svg className="w-4 h-4 text-white/80 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div className="text-base font-medium text-white/80">Add item</div>
                </div>
              </button>
              {/* Only show Checkout button on Cart screen */}
              {currentScreen === 'Cart' && (
                <Button
                  onClick={() => {}}
                  disabled={cartItems.length === 0}
                  variant="primary"
                  className={`flex-1 ${cartItems.length > 0 ? '' : 'bg-white/10 cursor-not-allowed'}`}
                >
                  <div className="flex items-center justify-center text-white">
                    <div className="text-base font-medium">Checkout</div>
                  </div>
                </Button>
              )}
            </div>
          )}
          {/* End screen: show Pause/Play button */}
          {currentScreen === 'End' && setIsPaused && (
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setIsPaused(!isPaused)}
              aria-label={isPaused ? 'Play' : 'Pause'}
            >
              <div className="flex items-center justify-center text-white">
                <div className="text-base font-medium">{isPaused ? 'Play' : 'Pause'}</div>
              </div>
            </Button>
          )}
          {/* Cashback screen: show Scan QR button only when card is flipped (QR visible) */}
          <AnimatePresence>
            {currentScreen === 'Cashback' && isQrVisible && (
              <motion.div
                key="scan-qr-btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                className="w-full"
              >
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => { if (goToScreen) goToScreen('Cashout'); }}
                  aria-label="Scan QR"
                >
                  <div className="flex items-center justify-center text-white">
                    <div className="text-base font-medium">Scan QR</div>
                  </div>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default InteractionView; 