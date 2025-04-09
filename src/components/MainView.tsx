import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DevNav } from './dev/DevNav';
import { logNavigation } from '../utils/debug';
import { SCREEN_ORDER } from '../constants/screens';
import { Screen } from '../types/screen';
import * as screens from '../screens/checkout';

// Configuration for which screens should use instant transitions
const INSTANT_SCREENS = ['Home', 'Cart', 'TapToPay', 'Tipping'];

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
  
  // Log the current screen for debugging
  useEffect(() => {
    console.log(`MainView: Current screen is now ${currentScreen}`);
  }, [currentScreen]);
  
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
        tipAmount: tipAmount || undefined
      };
    } else if (currentScreen === 'Cart' || currentScreen === 'TapToPay') {
      return {
        ...baseProps,
        amount: baseAmount || undefined
      };
    } else if (currentScreen === 'Tipping') {
      return {
        ...baseProps,
        goToScreen: goToScreen  // Pass direct navigation function to Tipping
      };
    } else {
      return baseProps;
    }
  };
  
  return (
    <div className="flex flex-col w-screen h-screen bg-black">
      {/* Main content area that centers all screens */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentScreen}-${refreshKey}`}
            className="absolute flex items-center justify-center w-full h-full"
            initial={{ 
              x: isInstantTransition ? 0 : 300, 
              opacity: isInstantTransition ? 1 : 0 
            }}
            animate={{ 
              x: 0, 
              opacity: 1 
            }}
            exit={{ 
              x: isInstantTransition ? 0 : -300, 
              opacity: isInstantTransition ? 1 : 0 
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: isInstantTransition ? 0 : 0.3
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
      
      {/* DevNav buttons */}
      <DevNav
        onBack={handleBack}
        onRefresh={handleRefresh}
        onNext={handleDevNavNext}
        resetToHome={handleReset}
      />
    </div>
  );
}; 