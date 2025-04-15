import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ExpandableDevPanel } from './dev/ExpandableDevPanel';
import { logNavigation } from '../utils/debug';
import { SCREEN_ORDER } from '../constants/screens';
import { Screen } from '../types/screen';
import * as screens from '../screens/checkout';

// Configuration for which screens should use instant transitions
const INSTANT_SCREENS = ['Home', 'Cart', 'TapToPay', 'Tipping', 'Cashback', 'End'];

// Define cart item interface
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

// Function to generate a random item
const generateRandomItem = (id: number): CartItem => {
  const itemNames = [
    'Coffee', 'Sandwich', 'Salad', 'Pastry', 
    'Smoothie', 'Burger', 'Pizza', 'Soda',
    'Chips', 'Cookie', 'Muffin', 'Water'
  ];
  const name = itemNames[Math.floor(Math.random() * itemNames.length)];
  // Random price between $3 and $25
  const price = Math.round((Math.random() * 22 + 3) * 100) / 100;
  return { id, name, price, quantity: 1 };
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
  
  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 1, name: 'Coffee', price: 4.50, quantity: 1 }
  ]);
  const [nextItemId, setNextItemId] = useState(2);
  
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
    
    // Ensure we're on the Cart screen to see the changes
    if (currentScreen !== 'Cart') {
      setCurrentScreen('Cart');
    }
  }, [currentScreen]);
  
  // Handle cart updates from the Cart component
  const handleCartUpdate = useCallback((items: CartItem[]) => {
    setCartItems(items);
  }, []);
  
  // Handle navigation to next screen with amounts
  const handleNext = useCallback((amount?: string) => {
    logNavigation('MainView:handleNext', `Navigate from ${currentScreen}`, { amount });
    
    if (amount) {
      // If coming from Cart or TapToPay, set as base amount
      if (currentScreen === 'Cart' || currentScreen === 'TapToPay') {
        console.log(`MainView: Setting base amount to ${amount}`);
        setBaseAmount(amount);
      }
      // If coming from Tipping, set as tip amount
      else if (currentScreen === 'Tipping') {
        console.log(`MainView: Setting tip amount to ${amount}`);
        setTipAmount(amount);
      }
    }
    
    handleScreenNext();
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
  
  // Render screen navigation buttons for quick debugging
  const renderScreenNav = () => (
    <div className="fixed bottom-4 left-4 flex gap-2 z-[9999] pointer-events-auto">
      {SCREEN_ORDER.map(screen => (
        <button
          key={screen}
          onClick={() => goToScreen(screen)}
          className={`px-2 py-1 rounded-md text-xs ${
            currentScreen === screen 
              ? 'bg-white text-black' 
              : 'bg-white/20 hover:bg-white/30 text-white'
          }`}
        >
          {screen}
        </button>
      ))}
    </div>
  );
  
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
        resetToHome: handleReset  // Also pass reset function as an alternative
      };
    } else if (currentScreen === 'Cart') {
      return {
        ...baseProps,
        amount: baseAmount || undefined,
        cartItems: cartItems,
        onCartUpdate: handleCartUpdate
      };
    } else if (currentScreen === 'TapToPay') {
      return {
        ...baseProps,
        amount: baseAmount || undefined
      };
    } else if (currentScreen === 'Tipping') {
      return {
        ...baseProps,
        goToScreen: goToScreen  // Pass direct navigation function to Tipping
      };
    } else if (currentScreen === 'Cashback') {
      return {
        ...baseProps,
        amount: tipAmount || "1" // Pass the tip amount to Cashback screen
      };
    } else {
      return baseProps;
    }
  };
  
  // Handle panel toggle notification from ExpandableDevPanel
  const handlePanelToggle = useCallback((isOpen: boolean) => {
    setIsPanelOpen(isOpen);
  }, []);
  
  return (
    <div className="flex flex-col w-screen h-screen bg-black">
      {/* Main content area that centers all screens */}
      <div className={`flex-1 flex items-center relative overflow-hidden ${
        isPanelOpen ? 'justify-start pl-8' : 'justify-center'
      }`}>
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
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 35,
              duration: isInstantTransition ? 0 : 0.2
            }}
          >
            {/* Apply key directly to component, not through spread */}
            <CurrentScreenComponent 
              key={`screen-${currentScreen}-${refreshKey}`} 
              {...getScreenProps()} 
            />
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Debug navigation */}
      {renderScreenNav()}
      
      {/* New Expandable Dev Panel */}
      <ExpandableDevPanel 
        currentScreen={currentScreen} 
        baseAmount={baseAmount} 
        tipAmount={tipAmount} 
        cartItems={cartItems}
        onBack={handleBack}
        onNext={handleDevNavNext}
        onRefresh={handleRefresh}
        onReset={handleReset}
        onPanelToggle={handlePanelToggle}
        onAddItem={handleAddItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
}; 