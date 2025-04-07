import { AnimatePresence, motion } from 'framer-motion';
import { useScreenTransition } from '../hooks/useScreenTransition';
import { SCREEN_ORDER } from '../constants/screens';
import { screenVariants, screenTransition } from '../constants/animations';
import { ScreenContainer } from './layout/ScreenContainer';
import { Screen } from '../types/screen';
import * as screens from '../screens/checkout';
import { DevNav } from './dev/DevNav';
import { useState } from 'react';

/**
 * Main application view that manages screen transitions and state.
 * Handles the flow between different screens and maintains selected amount state.
 * Uses Framer Motion for smooth screen transitions.
 * 
 * @component
 */
export const MainView = () => {
  const { currentScreen, handleNext, handleBack } = useScreenTransition(SCREEN_ORDER, 'Home');
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedAmount, setSelectedAmount] = useState<string>("1");

  /**
   * Handles refreshing the current screen by incrementing the refresh key
   */
  const handleRefresh = () => {
    setRefreshKey(key => key + 1);
  };

  /**
   * Handles navigation to the next screen and updates selected amount if provided
   * @param amount - Optional amount selected by the user
   */
  const handleScreenNext = (amount?: string) => {
    if (amount) {
      setSelectedAmount(amount);
    }
    handleNext();
  };

  /**
   * Renders the current screen component with appropriate transitions
   * @returns React.ReactNode
   */
  const renderScreen = () => {
    const ScreenComponent = screens[currentScreen as keyof typeof screens];
    
    // Check if we're transitioning between Cart and TapToPay, or TapToPay and Tipping
    const isInstantTransition = currentScreen === 'Cart' || 
                               currentScreen === 'TapToPay' || 
                               currentScreen === 'Tipping' ||
                               currentScreen === 'Cashback';
    
    return ScreenComponent ? (
      <motion.div
        key={`${currentScreen}-${refreshKey}`}
        variants={screenVariants}
        initial={isInstantTransition ? "center" : "enter"}
        animate="center"
        exit={isInstantTransition ? "center" : "exit"}
        transition={isInstantTransition ? { duration: 0 } : screenTransition}
        className="absolute w-full h-full"
      >
        <ScreenComponent 
          onNext={handleScreenNext} 
          amount={currentScreen === 'Cashback' ? selectedAmount : undefined}
        />
      </motion.div>
    ) : null;
  };

  return (
    <ScreenContainer>
      {/* Dev navigation - will be removed in production */}
      <DevNav
        onBack={handleBack}
        onRefresh={handleRefresh}
        onNext={handleScreenNext}
      />
      <AnimatePresence mode="wait" initial={false}>
        {renderScreen()}
      </AnimatePresence>
    </ScreenContainer>
  );
}; 