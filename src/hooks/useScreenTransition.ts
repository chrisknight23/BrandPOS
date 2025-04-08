import { useState, useCallback } from 'react';
import { Screen } from '../types/screen';
import { logNavigation } from '../utils/debug';

export const useScreenTransition = (screenOrder: Screen[], initialScreen?: Screen) => {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(() => {
    if (initialScreen) {
      const index = screenOrder.indexOf(initialScreen);
      return index >= 0 ? index : 0;
    }
    return 0;
  });

  const handleNext = useCallback(() => {
    if (currentScreenIndex < screenOrder.length - 1) {
      const fromScreen = screenOrder[currentScreenIndex];
      const toScreen = screenOrder[currentScreenIndex + 1];
      
      logNavigation('useScreenTransition', 'Navigation forward', {
        from: fromScreen,
        to: toScreen,
        currentIndex: currentScreenIndex,
        nextIndex: currentScreenIndex + 1
      });
      
      setCurrentScreenIndex(prev => prev + 1);
    } else {
      logNavigation('useScreenTransition', 'Cannot navigate forward - already at last screen', {
        current: screenOrder[currentScreenIndex],
        index: currentScreenIndex
      });
    }
  }, [currentScreenIndex, screenOrder]);

  const handleBack = useCallback(() => {
    if (currentScreenIndex > 0) {
      const fromScreen = screenOrder[currentScreenIndex];
      const toScreen = screenOrder[currentScreenIndex - 1];
      
      logNavigation('useScreenTransition', 'Navigation backward', {
        from: fromScreen,
        to: toScreen,
        currentIndex: currentScreenIndex,
        nextIndex: currentScreenIndex - 1
      });
      
      setCurrentScreenIndex(prev => prev - 1);
    } else {
      logNavigation('useScreenTransition', 'Cannot navigate backward - already at first screen', {
        current: screenOrder[currentScreenIndex],
        index: currentScreenIndex
      });
    }
  }, [currentScreenIndex, screenOrder]);

  const resetToScreen = useCallback((targetScreen: Screen) => {
    const targetIndex = screenOrder.indexOf(targetScreen);
    if (targetIndex >= 0) {
      const fromScreen = screenOrder[currentScreenIndex];
      
      logNavigation('useScreenTransition', 'Resetting to specific screen', {
        from: fromScreen,
        to: targetScreen,
        fromIndex: currentScreenIndex,
        toIndex: targetIndex
      });
      
      setCurrentScreenIndex(targetIndex);
    } else {
      logNavigation('useScreenTransition', 'Cannot reset - target screen not found', {
        targetScreen,
        availableScreens: screenOrder
      });
    }
  }, [currentScreenIndex, screenOrder]);

  // Debug info about current screen
  const currentScreen = screenOrder[currentScreenIndex];
  logNavigation('useScreenTransition', 'Current screen', {
    screen: currentScreen,
    index: currentScreenIndex,
    totalScreens: screenOrder.length
  });

  return {
    currentScreen,
    handleNext,
    handleBack,
    resetToScreen
  };
}; 