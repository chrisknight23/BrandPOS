import { useState } from 'react';
import { Screen } from '../types/screen';

export const useScreenTransition = (screenOrder: Screen[], initialScreen?: Screen) => {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(() => {
    if (initialScreen) {
      const index = screenOrder.indexOf(initialScreen);
      return index >= 0 ? index : 0;
    }
    return 0;
  });

  const handleNext = () => {
    if (currentScreenIndex < screenOrder.length - 1) {
      setCurrentScreenIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentScreenIndex > 0) {
      setCurrentScreenIndex(prev => prev - 1);
    }
  };

  return {
    currentScreen: screenOrder[currentScreenIndex],
    handleNext,
    handleBack,
  };
}; 