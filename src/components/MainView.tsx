import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { logNavigation } from '../utils/debug';
import { SCREEN_ORDER } from '../constants/screens';
import { Screen } from '../types/screen';
import * as screens from '../screens/checkout';
import DesktopIcon from '../assets/images/Desktop.svg';
import { useUserType } from '../context/UserTypeContext';
import SettingsPanel from './dev/SettingsPanel';
import FilterIcon from '../assets/images/filter.svg';
import { DropMenu } from './dev/dropMenu';
import { useEnvironment } from '../environment/EnvironmentContext';
import ScreenNavigation, { ScreenNavItem } from './common/ScreenNavigation/ScreenNavigation';
import { useQRCodeScanStatus } from '../hooks/useQRCodeScanStatus';

// Configuration for which screens should use instant transitions
const INSTANT_SCREENS = ['Home', 'Cart', 'Payment', 'Auth', 'Tipping', 'Cashback', 'CustomTip', 'Cashout', 'End'];

// Define cart item interface
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

// Add types for window object properties
declare global {
  interface Window {
    cartItems?: CartItem[];
  }
}

// Function to generate a random item
const generateRandomItem = (id: number): CartItem => {
  const coffeeShopItems = [
    { name: 'Espresso', minPrice: 3.50, maxPrice: 4.50 },
    { name: 'Cappuccino', minPrice: 4.50, maxPrice: 5.50 },
    { name: 'Latte', minPrice: 4.75, maxPrice: 5.75 },
    { name: 'Mocha', minPrice: 5.25, maxPrice: 6.25 },
    { name: 'Americano', minPrice: 3.75, maxPrice: 4.75 },
    { name: 'Cold Brew', minPrice: 4.50, maxPrice: 5.50 },
    { name: 'Macchiato', minPrice: 4.25, maxPrice: 5.25 },
    { name: 'Flat White', minPrice: 4.50, maxPrice: 5.50 },
    { name: 'Chai Latte', minPrice: 4.75, maxPrice: 5.75 },
    { name: 'Croissant', minPrice: 3.50, maxPrice: 4.50 },
    { name: 'Blueberry Muffin', minPrice: 3.75, maxPrice: 4.75 },
    { name: 'Cinnamon Roll', minPrice: 4.25, maxPrice: 5.25 },
    { name: 'Avocado Toast', minPrice: 7.50, maxPrice: 9.50 },
    { name: 'Bagel with Cream Cheese', minPrice: 4.25, maxPrice: 5.25 },
    { name: 'Breakfast Sandwich', minPrice: 6.50, maxPrice: 8.50 },
    { name: 'Iced Tea', minPrice: 3.50, maxPrice: 4.50 },
    { name: 'Hot Chocolate', minPrice: 4.25, maxPrice: 5.25 },
    { name: 'Caramel Frappuccino', minPrice: 5.50, maxPrice: 6.50 },
    { name: 'Biscotti', minPrice: 2.75, maxPrice: 3.75 },
    { name: 'Banana Bread', minPrice: 3.75, maxPrice: 4.75 }
  ];
  
  // Get currently used item names to avoid duplicates
  const usedNames = window.cartItems ? window.cartItems.map(item => item.name) : [];
  
  // Filter out items that are already in the cart
  const availableItems = coffeeShopItems.filter(item => !usedNames.includes(item.name));
  
  // If all items are used, reset and allow all items again
  const itemPool = availableItems.length > 0 ? availableItems : coffeeShopItems;
  
  // Choose a random item from the available pool
  const randomItem = itemPool[Math.floor(Math.random() * itemPool.length)];
  
  // Generate a price within the item's price range
  const priceRange = randomItem.maxPrice - randomItem.minPrice;
  const price = Math.round((randomItem.minPrice + (Math.random() * priceRange)) * 100) / 100;
  
  return { id, name: randomItem.name, price, quantity: 1 };
};

// Add a constant for the tax rate
const TAX_RATE = 0.0875;

// Add this near the top of the MainView component, after imports:
const drawerMotion = {
  type: 'spring',
  stiffness: 400,
  damping: 35,
  duration: 0.4
};

/**
 * Main application view that manages screen transitions and state.
 * Handles the flow between different screens and maintains selected amount state.
 * Uses Framer Motion for smooth screen transitions.
 * 
 * @component
 */
export const MainView = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('Home');
  const [refreshKey, setRefreshKey] = useState(0);
  const [baseAmount, setBaseAmount] = useState<string | null>(null);
  const [tipAmount, setTipAmount] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  // Add pause state for End screen timer
  const [isPaused, setIsPaused] = useState(false);
  
  // Track previous isPanelOpen to determine open/close direction
  const prevPanelOpenRef = useRef(isPanelOpen);
  const isOpening = !prevPanelOpenRef.current && isPanelOpen;
  useEffect(() => {
    prevPanelOpenRef.current = isPanelOpen;
  }, [isPanelOpen]);
  
  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 1, name: 'Espresso', price: 3.95, quantity: 1 }
  ]);
  const [nextItemId, setNextItemId] = useState(2);
  
  // Make cart items available globally for the generateRandomItem function
  useEffect(() => {
    window.cartItems = cartItems;
  }, [cartItems]);
  
  // Log the current screen for debugging
  useEffect(() => {
    console.log(`MainView: Current screen is now ${currentScreen}`);
  }, [currentScreen]);
  
  // Handle adding an item to the cart
  const handleAddItem = useCallback(() => {
    console.log('MainView: Adding item to cart');
    const newItem = generateRandomItem(nextItemId);
    setCartItems(prevItems => [...prevItems, newItem]);
    setNextItemId(prevId => prevId + 1);
    
    // Ensure we're on the Cart screen to see the changes
    if (currentScreen !== 'Cart') {
      setCurrentScreen('Cart');
    }
  }, [nextItemId, currentScreen]);
  
  // Handle clearing the cart
  const handleClearCart = useCallback(() => {
    console.log('MainView: Clearing cart');
    setCartItems([]);
    
    // Navigate back to Home screen when cart is cleared
    setCurrentScreen('Home');
  }, []);
  
  // Handle removing a specific item from the cart
  const handleRemoveCartItem = useCallback((itemId: number) => {
    console.log(`MainView: Removing item ${itemId} from cart`);
    
    // Check if this is the last item
    const isLastItem = cartItems.length === 1;
    
    // Remove the item
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    
    // If it was the last item, navigate back to Home screen
    if (isLastItem) {
      setCurrentScreen('Home');
    } else if (currentScreen !== 'Cart') {
      // Otherwise ensure we're on the Cart screen to see the changes
      setCurrentScreen('Cart');
    }
  }, [cartItems, currentScreen]);
  
  // Handle cart updates from the Cart component
  const handleCartUpdate = useCallback((items: CartItem[]) => {
    setCartItems(items);
    // No longer navigate to Home when cart is empty
  }, []);
  
  // Add a listener to ensure cart is never empty when on Cart screen
  useEffect(() => {
    if (currentScreen === 'Cart' && cartItems.length === 0) {
      // Add a default item if the cart is empty on Cart screen
      const defaultItem = generateRandomItem(nextItemId);
      setCartItems([defaultItem]);
      setNextItemId(prevId => prevId + 1);
    }
  }, [currentScreen, cartItems.length, nextItemId]);
  
  // Handle navigation to next screen with amounts
  const handleNext = useCallback((amount?: string) => {
    logNavigation('MainView:handleNext', `Navigate from ${currentScreen}`, { amount });
    
    if (amount) {
      if (currentScreen === 'Cart' || currentScreen === 'Payment') {
        setBaseAmount(amount);
      } else if (currentScreen === 'Tipping') {
        setTipAmount(amount);
      } else if (currentScreen === 'CustomTip') {
        setTipAmount(amount);
        setCurrentScreen('End');
        return;
      }
    }
    // Explicitly go to End after Cashout
    if (currentScreen === 'Cashout') {
      setCurrentScreen('End');
      return;
    }
    // Navigate to next screen by order
    const idx = SCREEN_ORDER.indexOf(currentScreen);
    if (idx < SCREEN_ORDER.length - 1) {
      setCurrentScreen(SCREEN_ORDER[idx + 1]);
    }
  }, [currentScreen]);
  
  // Handle back navigation
  const handleBack = useCallback(() => {
    logNavigation('MainView:handleBack', `Navigate back from ${currentScreen}`);
    const currentIndex = SCREEN_ORDER.indexOf(currentScreen);
    
    if (currentIndex > 0) {
      const prevScreen = SCREEN_ORDER[currentIndex - 1];
      console.log(`MainView: Navigating back from ${currentScreen} to ${prevScreen}`);
      setCurrentScreen(prevScreen);
    } else {
      console.log(`MainView: Cannot go back from ${currentScreen} (first screen)`);
    }
  }, [currentScreen]);
  
  // Refresh the current screen by updating its key
  const handleRefresh = useCallback(() => {
    logNavigation('MainView:handleRefresh', `Refreshing ${currentScreen}`);
    console.log(`MainView: Refreshing ${currentScreen}`);
    setRefreshKey(prev => prev + 1);
  }, [currentScreen]);
  
  // Special handler for DevNav next button
  const handleDevNavNext = useCallback(() => {
    logNavigation('MainView:handleDevNavNext', `Navigate next from ${currentScreen}`);
    handleScreenNext();
  }, [currentScreen]);
  
  // Reset back to Home screen
  const handleReset = useCallback(() => {
    logNavigation('MainView:handleReset', 'Resetting to Home screen');
    console.log('MainView: Resetting to Home screen');
    setCurrentScreen('Home');
    setBaseAmount(null);
    setTipAmount(null);
  }, []);
  
  // Direct navigation to specific screen
  const goToScreen = useCallback((screen: Screen) => {
    logNavigation('MainView:goToScreen', `Navigating directly to ${screen}`, 
      { from: currentScreen });
    console.log(`MainView: Navigating directly from ${currentScreen} to ${screen}`);
    setCurrentScreen(screen);
  }, [currentScreen]);
  
  // Standard navigation to next screen based on current screen
  const handleScreenNext = useCallback(() => {
    const currentIndex = SCREEN_ORDER.indexOf(currentScreen);
    
    if (currentIndex < SCREEN_ORDER.length - 1) {
      const nextScreen = SCREEN_ORDER[currentIndex + 1];
      console.log(`MainView: Navigating from ${currentScreen} to ${nextScreen}`);
      setCurrentScreen(nextScreen);
    } else {
      console.log(`MainView: Cannot navigate forward from ${currentScreen} (last screen)`);
    }
  }, [currentScreen]);
  
  // Check if this screen should use instant transitions
  const isInstantTransition = INSTANT_SCREENS.includes(currentScreen);
  
  // Get the current screen component
  const CurrentScreenComponent = screens[currentScreen as keyof typeof screens];

  // Calculate the total amount including tip if applicable
  const calculateTotalAmount = useCallback(() => {
    if (!baseAmount) return undefined;
    
    // If there's a tip, add it to the base amount
    if (tipAmount && tipAmount !== '0') {
      const base = parseFloat(baseAmount);
      const tip = parseFloat(tipAmount);
      return (base + tip).toFixed(2);
    }
    
    // Otherwise, just return the base amount
    return baseAmount;
  }, [baseAmount, tipAmount]);
  
  // Prepare navigation pills/screens for ScreenNavigation
  const getNavScreens = (): ScreenNavItem[] => {
    return SCREEN_ORDER
      .filter(screen => screen !== 'CustomTip')
      .filter(screen => {
        if (userType === 'cash-local') {
          return screen !== 'Cashback' && screen !== 'Cashout';
        }
        return true;
      })
      .map(screen => ({ label: screen, value: screen }));
  };
  
  // Handler for navigation pill selection
  const handleScreenNavSelect = (screen: string) => {
    goToScreen(screen as Screen);
  };
  
  // Calculate the total from cart items
  const calculateCartTotal = useCallback(() => {
    if (cartItems.length === 0) return '0.00';
    
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return total.toFixed(2);
  }, [cartItems]);
  
  // Update the base amount when the cart items change or when navigating to Payment
  useEffect(() => {
    if (currentScreen === 'Payment') {
      const cartTotal = calculateCartTotal();
      console.log(`MainView: Setting base amount to cart total: ${cartTotal}`);
      setBaseAmount(cartTotal);
    }
  }, [currentScreen, calculateCartTotal]);
  
  // Additional effect to update base amount when cart changes
  useEffect(() => {
    if (currentScreen === 'Cart') {
      const cartTotal = calculateCartTotal();
      setBaseAmount(cartTotal);
    }
  }, [cartItems, currentScreen, calculateCartTotal]);
  
  // QR code visibility state for Cashback/SettingsPanel
  const [isQrVisible, setIsQrVisible] = useState(false);
  
  // Generate a unique session ID per app load
  const sessionId = useMemo(() => {
    if (window.crypto && window.crypto.randomUUID) {
      return window.crypto.randomUUID();
    }
    // Fallback for older browsers
    return Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15);
  }, []);

  // Use the polling hook to detect QR scan
  const scanned = useQRCodeScanStatus(sessionId);

  // When scanned, navigate to Cashout screen
  useEffect(() => {
    if (scanned && currentScreen !== 'Cashout') {
      setCurrentScreen('Cashout');
    }
  }, [scanned, currentScreen]);
  
  // Get screen-specific props WITHOUT including the key
  const getScreenProps = () => {
    // Base props without key
    const baseProps = {
      onNext: handleNext,
    };

    // Return props specific to the current screen
    if (currentScreen === 'End') {
      return {
        ...baseProps,
        amount: calculateTotalAmount(),
        baseAmount: baseAmount || undefined,
        tipAmount: tipAmount || undefined,
        goToScreen: goToScreen,  // Pass direct navigation function to End
        resetToHome: handleReset,  // Also pass reset function as an alternative
        taxRate: TAX_RATE,
        isPaused,
        setIsPaused,
      };
    } else if (currentScreen === 'Cart') {
      return {
        ...baseProps,
        amount: calculateCartTotal(), // Use calculated cart total
        cartItems: cartItems,
        onCartUpdate: handleCartUpdate
      };
    } else if (currentScreen === 'Payment') {
      return {
        ...baseProps,
        amount: baseAmount || calculateCartTotal(), // Use baseAmount or cart total as fallback
        taxRate: TAX_RATE
      };
    } else if (currentScreen === 'Auth') {
      return {
        ...baseProps,
        amount: baseAmount || calculateCartTotal() // Pass the amount from Payment to Auth
      };
    } else if (currentScreen === 'Tipping') {
      return {
        ...baseProps,
        goToScreen: goToScreen  // Pass direct navigation function to Tipping
      };
    } else if (currentScreen === 'Cashback') {
      return {
        ...baseProps,
        amount: tipAmount || "1",
        userType,
        onQrVisibleChange: setIsQrVisible,
        sessionId, // Pass sessionId for QR code
      };
    } else if (currentScreen === 'CustomTip') {
      return {
        ...baseProps,
        baseAmount: baseAmount || '0',
        goBack: () => goToScreen('Tipping')
      };
    } else if (currentScreen === 'Cashout') {
      return {
        onNext: () => {}, // no-op to satisfy type
        onComplete: handleNext,
        amount: tipAmount || "3",
      };
    } else {
      return baseProps;
    }
  };
  
  const { userType, setUserType } = useUserType();
  const { environment, setEnvironment } = useEnvironment();
  
  useEffect(() => {
    // Listen for dev QR scan simulation event
    const handleDevSimulateQr = () => {
      setCurrentScreen('Cashout');
    };
    window.addEventListener('dev-simulate-qr-cashout', handleDevSimulateQr);
    return () => {
      window.removeEventListener('dev-simulate-qr-cashout', handleDevSimulateQr);
    };
  }, []);
  
  // Reset QR visibility when leaving Cashback screen
  useEffect(() => {
    if (currentScreen !== 'Cashback' && isQrVisible) {
      setIsQrVisible(false);
    }
  }, [currentScreen, isQrVisible]);
  
  // Reset isPaused when navigating away from End screen
  useEffect(() => {
    if (currentScreen !== 'End' && isPaused) {
      setIsPaused(false);
    }
  }, [currentScreen, isPaused]);
  
  return (
    <div
      className="flex flex-col w-screen h-screen bg-[#050505]"
      style={{
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1.5px, transparent 1.5px)',
        backgroundSize: '32px 32px',
        backgroundPosition: '0 0',
      }}
    >
      {/* Unified Settings Panel Container (collapsed/expanded) */}
      <SettingsPanel
        isOpen={isPanelOpen}
        onPanelToggle={setIsPanelOpen}
        currentScreen={currentScreen}
        baseAmount={baseAmount}
        tipAmount={tipAmount}
        cartItems={cartItems}
        onAddItem={handleAddItem}
        onClearCart={handleClearCart}
        onRemoveCartItem={handleRemoveCartItem}
        onBack={handleBack}
        onNext={handleDevNavNext}
        onRefresh={handleRefresh}
        onReset={handleReset}
        isQrVisible={isQrVisible}
        onQrVisibleChange={setIsQrVisible}
        goToScreen={goToScreen}
        // Pass pause state to SettingsPanel
        isPaused={isPaused}
        setIsPaused={setIsPaused}
      />
      {/* Device and Environment DropMenus in the top left corner */}
      <div className="fixed top-6 left-6 z-[10002] flex flex-col gap-4">
        <DropMenu
          title="Device"
          rowLabels={["Register", "Stand", "Reader"]}
          iconSrc={DesktopIcon}
          onRowSelect={(rowIndex) => {
            if (rowIndex === 0) setUserType('new');
            else if (rowIndex === 1) setUserType('returning');
            else if (rowIndex === 2) setUserType('cash-local');
          }}
        />
        <DropMenu
          title="Environment"
          rowLabels={["SQ buyer display", "Cash App", "Cash Web"]}
          onRowSelect={(rowIndex) => {
            const env = rowIndex === 0 ? 'POS' : rowIndex === 1 ? 'iOS' : 'Web';
            setEnvironment(env);
          }}
          initialSelectedRow={['POS', 'iOS', 'Web'].map((v, i) => ["Square POS", "Cash App", "Cash Web"][i]).indexOf(
            environment === 'POS' ? 'Square POS' : environment === 'iOS' ? 'Cash App' : 'Cash Web'
          ) + 1}
        />
      </div>
      {/* User profile DropMenu on the right side, shifts left when dev panel is open (24px gap) */}
      <motion.div
        className="fixed top-6 z-[10002]"
        initial={{ right: 104 }}
        animate={{ right: isPanelOpen ? 450 : 84 }}
        transition={drawerMotion}
      >
        <DropMenu
          title="Customer"
          rowLabels={["New customer", "Returning customer", "Cash Local customer"]}
          onRowSelect={(rowIndex) => {
            if (rowIndex === 0) setUserType('new');
            else if (rowIndex === 1) setUserType('returning');
            else if (rowIndex === 2) setUserType('cash-local');
          }}
        />
      </motion.div>
      {/* Main content area that centers all screens */}
      <motion.div
        className="flex-1 flex items-center relative overflow-hidden justify-center"
        animate={{ x: isPanelOpen ? -180 : 0 }}
        transition={drawerMotion}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={`${currentScreen}-${refreshKey}`}
            className={`absolute flex items-center justify-center h-full ${
              isPanelOpen ? 'w-[calc(100%-360px)]' : 'w-full'
            }`}
            initial={{ 
              x: isInstantTransition ? 0 : 200, 
              opacity: isInstantTransition ? 1 : 0.8
            }}
            animate={{ 
              x: 0, 
              opacity: 1 
            }}
            exit={{ 
              x: isInstantTransition ? 0 : -200, 
              opacity: isInstantTransition ? 1 : 0.8,
              transition: { duration: 0.15 }
            }}
            transition={drawerMotion}
          >
            {/* Apply key directly to component, not through spread */}
            <CurrentScreenComponent 
              key={`screen-${currentScreen}-${refreshKey}`} 
              {...getScreenProps()} 
            />
            {/* Centered screen navigation at the bottom of the device frame */}
            <div className="absolute bottom-12 left-0 w-full flex justify-center z-20">
              <ScreenNavigation
                screens={getNavScreens()}
                currentScreen={currentScreen}
                onScreenSelect={handleScreenNavSelect}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}; 