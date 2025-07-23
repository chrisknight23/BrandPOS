import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { logNavigation } from '../utils/debug';
import { SCREEN_ORDER } from '../constants/screens';
import { Screen } from '../types/screen';
import * as screens from '../screens';
import DesktopIcon from '../assets/images/Desktop.svg';
import { useUserType } from '../context/UserTypeContext';
import SettingsPanel from './dev/SettingsPanel';
import { DropMenu } from './dev/dropMenu';
import ScreenNavigation, { ScreenNavItem } from './common/ScreenNavigation/ScreenNavigation';
import { useKioskMode } from '../hooks/useKioskMode';

// Configuration for which screens should use instant transitions
const INSTANT_SCREENS = ['Home', 'Follow', 'Screensaver', 'ScreensaverExit', 'ScreensaverFollow', 'Cart', 'Payment', 'Auth', 'Tipping', 'Reward', 'CustomTip', 'End'];

// Device detection utilities
const isIpad = () => {
  return /iPad|Macintosh/.test(navigator.userAgent) && 'ontouchend' in document;
};

const isPWAMode = () => {
  return window.matchMedia('(display-mode: standalone)').matches;
};

const isIpadPWA = () => {
  return isIpad() && isPWAMode();
};

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
  duration: 0.4,
  restSpeed: 0.001,
  restDelta: 0.001
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
  // Track if this is the first visit to Home (for starting vs idle state)
  const [isFirstHomeVisit, setIsFirstHomeVisit] = useState(true);
  // Track previous screen to detect when coming from End
  const [previousScreen, setPreviousScreen] = useState<Screen | null>(null);
  
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
  
  // Log the current screen for debugging and track Home visits
  useEffect(() => {
    console.log(`MainView: Current screen is now ${currentScreen}`);
    
    // If we're navigating away from Home for the first time, mark it as no longer first visit
    if (currentScreen !== 'Home' && isFirstHomeVisit) {
      setIsFirstHomeVisit(false);
    }
    
    // Reset isFirstHomeVisit when navigating to Home from End screen to trigger entry animation
    if (currentScreen === 'Home' && previousScreen === 'End') {
      setIsFirstHomeVisit(true);
    }
  }, [currentScreen, isFirstHomeVisit, previousScreen]);
  
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
  
  // Calculate the total from cart items - move this function earlier in the file
  const calculateCartTotal = useCallback(() => {
    if (cartItems.length === 0) return '0.00';
    
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;
    
    console.log(`MainView:calculateCartTotal: Subtotal=${subtotal.toFixed(2)}, Tax=${tax.toFixed(2)}, Total=${total.toFixed(2)}`);
    return total.toFixed(2);
  }, [cartItems]);
  
  // Calculate the total amount including tip if applicable
  const calculateTotalAmount = useCallback(() => {
    // If baseAmount isn't set but we have cart items, calculate from cart with tax
    if (!baseAmount && cartItems.length > 0) {
      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const tax = subtotal * TAX_RATE;
      const total = subtotal + tax;
      console.log(`MainView:calculateTotalAmount: Using cart items - Subtotal=${subtotal.toFixed(2)}, Tax=${tax.toFixed(2)}, Total=${total.toFixed(2)}`);
      return total.toFixed(2);
    }
    
    if (!baseAmount) return undefined;
    
    // baseAmount from Cart already includes tax, just add tip if there is one
    if (tipAmount && tipAmount !== '0') {
      const base = parseFloat(baseAmount);
      const tip = parseFloat(tipAmount);
      const total = base + tip;
      console.log(`MainView:calculateTotalAmount: Base=${base.toFixed(2)} (with tax) + Tip=${tip.toFixed(2)} = ${total.toFixed(2)}`);
      return total.toFixed(2);
    }
    
    // Otherwise, just return the base amount (already includes tax from Cart)
    console.log(`MainView:calculateTotalAmount: Using baseAmount=${baseAmount} (already includes tax)`);
    return baseAmount;
  }, [baseAmount, tipAmount, cartItems]);
  
  // Now handleNext can use calculateCartTotal
  const handleNext = useCallback((amount?: string) => {
    logNavigation('MainView:handleNext', `Navigate from ${currentScreen}`, { amount });
    
    console.log(`MainView:handleNext: Current baseAmount=${baseAmount}, tipAmount=${tipAmount}, newAmount=${amount}`);
    
    // Important: If an amount is provided, always use it
    if (amount) {
      if (currentScreen === 'Cart' || currentScreen === 'Payment') {
        console.log(`MainView:handleNext: Setting baseAmount to ${amount}`);
        setBaseAmount(amount);
      } else if (currentScreen === 'Tipping') {
        console.log(`MainView:handleNext: Setting tipAmount to ${amount}`);
        setTipAmount(amount);
      } else if (currentScreen === 'CustomTip') {
        console.log(`MainView:handleNext: Setting tipAmount to ${amount} and navigating to End`);
        setTipAmount(amount);
        setPreviousScreen(currentScreen);
        setCurrentScreen('End');
        return;
      }
    }
    
    // Ensure we have a baseAmount when needed
    if (!baseAmount && (currentScreen === 'Cart' || currentScreen === 'Payment')) {
      const cartTotal = calculateCartTotal();
      console.log(`MainView:handleNext: No baseAmount, setting from cart: ${cartTotal}`);
      setBaseAmount(cartTotal);
    }
    

    
    // Navigate to next screen by order
    const idx = SCREEN_ORDER.indexOf(currentScreen);
    if (idx < SCREEN_ORDER.length - 1) {
      const nextScreen = SCREEN_ORDER[idx + 1];
      console.log(`MainView:handleNext: Navigating from ${currentScreen} to ${nextScreen}`);
      setPreviousScreen(currentScreen);
      setCurrentScreen(nextScreen);
    }
  }, [currentScreen, baseAmount, calculateCartTotal, tipAmount]);
  
  // Handle back navigation
  const handleBack = useCallback(() => {
    logNavigation('MainView:handleBack', `Navigate back from ${currentScreen}`);
    const currentIndex = SCREEN_ORDER.indexOf(currentScreen);
    
    if (currentIndex > 0) {
      const prevScreen = SCREEN_ORDER[currentIndex - 1];
      console.log(`MainView: Navigating back from ${currentScreen} to ${prevScreen}`);
      setPreviousScreen(currentScreen);
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
    setPreviousScreen(currentScreen);
    setCurrentScreen('Home');
    setBaseAmount(null);
    setTipAmount(null);
  }, [currentScreen]);
  
  // QR code visibility state for SettingsPanel
  const [isQrVisible, setIsQrVisible] = useState(false);
  
  // Generate a unique session ID per app load, persisted in sessionStorage
  const sessionId = useMemo(() => {
    const stored = sessionStorage.getItem('sessionId');
    if (stored) return stored;

    const newId = window.crypto?.randomUUID?.() ||
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('sessionId', newId);
    return newId;
  }, []);

  // Reset the current session's status on the server for testing (without requiring restart)
  const handleResetSession = useCallback(async () => {
    logNavigation('MainView:handleResetSession', 'Resetting session status on server');
    console.log('MainView: Resetting session status for:', sessionId);
    
    try {
      // Always use localhost for reset-session specifically
      const response = await fetch(`http://localhost:3001/reset-session/${sessionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      });
      
      if (response.ok) {
        console.log('✅ Session status reset successfully');
        // Also navigate back to home screen
        setCurrentScreen('Home');
      } else {
        console.error('❌ Failed to reset session status');
      }
    } catch (error) {
      console.error('❌ Error resetting session status:', error);
    }
  }, [sessionId]);
  
  // Direct navigation to specific screen
  const goToScreen = useCallback((screen: Screen) => {
    logNavigation('MainView:goToScreen', `Navigating directly to ${screen}`, 
      { from: currentScreen });
    console.log(`MainView: Navigating directly from ${currentScreen} to ${screen}`);
    // Update previous screen before changing current screen
    setPreviousScreen(currentScreen);
    setCurrentScreen(screen);
  }, [currentScreen]);
  
  // Standard navigation to next screen based on current screen
  const handleScreenNext = useCallback(() => {
    const currentIndex = SCREEN_ORDER.indexOf(currentScreen);
    
    if (currentIndex < SCREEN_ORDER.length - 1) {
      const nextScreen = SCREEN_ORDER[currentIndex + 1];
      console.log(`MainView: Navigating from ${currentScreen} to ${nextScreen}`);
      setPreviousScreen(currentScreen);
      setCurrentScreen(nextScreen);
    } else {
      console.log(`MainView: Cannot navigate forward from ${currentScreen} (last screen)`);
    }
  }, [currentScreen]);
  
  // Check if this screen should use instant transitions
  const isInstantTransition = INSTANT_SCREENS.includes(currentScreen);
  
  // Get the current screen component
  const CurrentScreenComponent = screens[currentScreen as keyof typeof screens];
  
  // Simplify the effects - only keep one essential effect
  useEffect(() => {
    // Ensure base amount is set when on Payment, Tipping, etc.
    if ((currentScreen === 'Payment' || currentScreen === 'Tipping' || 
         currentScreen === 'End') && (!baseAmount || baseAmount === '0.00')) {
      const cartTotal = calculateCartTotal();
      console.log(`MainView: Setting base amount for screen ${currentScreen}: ${cartTotal}`);
      setBaseAmount(cartTotal);
    }
    
    // Update base amount when on Cart screen based on cart items
    if (currentScreen === 'Cart') {
      const cartTotal = calculateCartTotal();
      console.log(`MainView: Setting base amount for Cart: ${cartTotal}`);
      setBaseAmount(cartTotal);
    }
  }, [currentScreen, calculateCartTotal, baseAmount, cartItems]);
  
  // Prepare navigation pills/screens for ScreenNavigation
  const getNavScreens = (): ScreenNavItem[] => {
    return SCREEN_ORDER
      .filter(screen => screen !== 'CustomTip')
      .filter(screen => {
        if (userType === 'cash-local') {
          return true;
        }
        return true;
      })
      .map(screen => ({ label: screen, value: screen }));
  };
  
  // Handler for navigation pill selection
  const handleScreenNavSelect = (screen: string) => {
    goToScreen(screen as Screen);
  };
  
  const { userType, setUserType } = useUserType();
  
  // Kiosk mode for hiding development UI elements
  const { isKioskMode, toggleKioskMode } = useKioskMode({
    longPressDuration: 3000, // 3 second long press
    excludeElements: [
      '.settings-panel',
      '.drop-menu', 
      '.pill-button',
      'button',
      '[role="button"]',
      '.screen-navigation'
    ]
  });
  
  useEffect(() => {
    // Listen for dev QR scan simulation event
    const handleDevSimulateQr = () => {
      setCurrentScreen('End');
    };
    window.addEventListener('dev-simulate-qr-cashout', handleDevSimulateQr);
    return () => {
      window.removeEventListener('dev-simulate-qr-cashout', handleDevSimulateQr);
    };
  }, []);
  
  // Reset QR visibility when leaving screens that use QR codes
  useEffect(() => {
    if (isQrVisible) {
      setIsQrVisible(false);
    }
  }, [currentScreen, isQrVisible]);
  
  // Reset isPaused when navigating away from End screen
  useEffect(() => {
    if (currentScreen !== 'End' && isPaused) {
      setIsPaused(false);
    }
  }, [currentScreen, isPaused]);
  
  // Get props for the current screen component
  const getScreenProps = () => {
    // Log current state before generating props
    console.log(`MainView:getScreenProps: Preparing props for ${currentScreen}`, {
      baseAmount,
      tipAmount,
      totalAmount: calculateTotalAmount()
    });
    
    // Generate props with proper null/undefined handling
    const baseProps = {
      onNext: handleNext,
      onBack: handleBack,
      onComplete: handleNext,
      // Pass baseAmount as string or undefined (never null)
      baseAmount: baseAmount || undefined,
      // Pass tipAmount as string or undefined (never null)
      tipAmount: tipAmount || undefined,
      // Pass amount which includes both base and tip
      amount: calculateTotalAmount() || undefined,
      // Pass the raw cart items
      cartItems,
      onCartUpdate: handleCartUpdate,
      // QR code visibility
      isQrVisible,
      // Session ID for tracking
      sessionId,
      // Direct navigation function
      goToScreen: (screen: string) => goToScreen(screen as Screen)
    };

    // Add screen-specific props
    if (currentScreen === 'Home') {
      return {
        ...baseProps,
        // Home screen should be in idle mode if it's not the first visit
        isIdle: !isFirstHomeVisit
      };
    }
    
    if (currentScreen === 'End') {
      return {
        ...baseProps,
        // Skip welcome message when coming from Reward screen or Tipping screen (no tip)
        skipWelcome: previousScreen === 'Reward' || previousScreen === 'Tipping',
        // Pass pause state to End screen
        isPaused,
        setIsPaused
      };
    }

    return baseProps;
  };
  
  // --- Removed QR scan status effect ---
  return (
    <div
      className="flex flex-col w-screen h-screen bg-[#050505]"
      style={{
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1.5px, transparent 1.5px)',
        backgroundSize: '32px 32px',
        backgroundPosition: '0 0',
      }}
    >
      {/* Unified Settings Panel Container (collapsed/expanded) - Hidden in kiosk mode */}
      {!isKioskMode && (
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
          onResetSession={handleResetSession}
          isQrVisible={isQrVisible}
          onQrVisibleChange={setIsQrVisible}
          goToScreen={goToScreen}
          // Pass pause state to SettingsPanel
          isPaused={isPaused}
          setIsPaused={setIsPaused}
        />
      )}
      {/* Device and Environment DropMenus in the top left corner - Hidden in kiosk mode */}
      {!isKioskMode && (
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
            bottomButton={{
              label: "Display mode",
              onClick: () => {
                console.log("Display mode clicked");
                // TODO: Add display mode functionality
              }
            }}
          />
        </div>
      )}
      {/* User profile DropMenu on the right side, shifts left when dev panel is open (24px gap) - Hidden in kiosk mode */}
      {!isKioskMode && (
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
      )}
      {/* Main content area that centers all screens */}
      <motion.div
        className="flex-1 flex items-center relative overflow-hidden justify-center"
        animate={{ x: (isPanelOpen && !isKioskMode) ? -180 : 0 }}
        transition={drawerMotion}
      >
        {/* Kiosk mode indicator */}
        {isKioskMode && !isIpadPWA() && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[10003] bg-black/80 backdrop-blur-md border border-white/20 rounded-full px-4 py-2"
          >
            <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Kiosk Mode • Long press to exit
            </div>
          </motion.div>
        )}
        <AnimatePresence mode={isInstantTransition ? "wait" : "popLayout"} initial={false}>
          <motion.div
            key={`${currentScreen}-${refreshKey}`}
            className={`absolute flex items-center justify-center h-full ${
              (isPanelOpen && !isKioskMode) ? 'w-[calc(100%-360px)]' : 'w-full'
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
              transition: { duration: isInstantTransition ? 0 : 0.15 }
            }}
            transition={isInstantTransition ? { duration: 0 } : {
              ...drawerMotion,
              restSpeed: 0.001,
              restDelta: 0.001
            }}
            style={{
              // Performance optimizations
              willChange: isInstantTransition ? 'auto' : 'transform, opacity',
              backfaceVisibility: 'hidden'
            }}
          >
            {/* Apply key directly to component, not through spread */}
            <CurrentScreenComponent 
              key={`screen-${currentScreen}-${refreshKey}`} 
              {...getScreenProps()} 
            />
            {/* Centered screen navigation at the bottom of the device frame - Hidden in kiosk mode */}
            {!isKioskMode && (
              <div className="absolute bottom-12 left-0 w-full flex justify-center z-20 screen-navigation">
                <ScreenNavigation
                  screens={getNavScreens()}
                  currentScreen={currentScreen}
                  onScreenSelect={handleScreenNavSelect}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}; 