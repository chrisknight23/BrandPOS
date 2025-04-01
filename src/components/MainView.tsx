import { AnimatePresence, motion } from 'framer-motion';
import { useScreenTransition } from '../hooks/useScreenTransition';
import { SCREEN_ORDER } from '../constants/screens';
import { screenVariants, screenTransition } from '../constants/animations';
import { ScreenContainer } from './layout/ScreenContainer';
import { Screen } from '../types/screen';
import * as screens from '../screens/checkout';
import { DevNav } from './dev/DevNav';
import { useState } from 'react';

export const MainView = () => {
  const { currentScreen, handleNext, handleBack } = useScreenTransition(SCREEN_ORDER);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(key => key + 1);
  };

  const renderScreen = () => {
    const ScreenComponent = screens[currentScreen as keyof typeof screens];
    
    // Check if we're transitioning between Cart and TapToPay
    const isInstantTransition = currentScreen === 'Cart' || currentScreen === 'TapToPay';
    
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
        <ScreenComponent onNext={handleNext} />
      </motion.div>
    ) : null;
  };

  return (
    <ScreenContainer>
      {/* Dev navigation - will be removed in production */}
      <DevNav
        onBack={handleBack}
        onRefresh={handleRefresh}
        onNext={handleNext}
      />
      <AnimatePresence mode="wait" initial={false}>
        {renderScreen()}
      </AnimatePresence>
    </ScreenContainer>
  );
}; 