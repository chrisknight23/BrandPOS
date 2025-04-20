// This file has been migrated to SettingsPanel/views/SettingsView.tsx and should no longer be used.

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getFeatureFlags, 
  toggleFeatureFlag, 
  resetFeatureFlags,
  isFeatureEnabled
} from '../../utils/featureFlags';
import { Screen } from '../../types/screen';
import { FEATURE_FLAGS, FeatureFlag } from '../../constants/featureFlags';

interface DevFeaturePanelProps {
  currentScreen: Screen;
  baseAmount: string | null;
  tipAmount: string | null;
  onBack?: () => void;
  onNext?: () => void;
  onRefresh?: () => void;
  onReset?: () => void;
}

// Define the navigation screens that can be shown in the panel
type PanelScreen = 'main' | 'debug' | 'flag-details' | 'navigation';

interface PanelScreenConfig {
  title: string;
  backButton?: boolean;
}

/**
 * A panel for managing feature flags during development.
 * Uses an iOS-like navigation stack for moving between different screens.
 */
export const DevFeaturePanel: React.FC<DevFeaturePanelProps> = ({ 
  currentScreen,
  baseAmount,
  tipAmount,
  onBack,
  onNext,
  onRefresh,
  onReset
}) => {
  // Track panel open state
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  
  // Navigation state
  const [activeScreen, setActiveScreen] = useState<PanelScreen>('main');
  const [navHistory, setNavHistory] = useState<PanelScreen[]>(['main']);
  const [navDirection, setNavDirection] = useState<'forward' | 'backward'>('forward');
  const [selectedFlag, setSelectedFlag] = useState<FeatureFlag | null>(null);
  
  // Flags state
  const [featureFlags, setFeatureFlags] = useState<Record<string, boolean>>({});
  const [relevantFlags, setRelevantFlags] = useState<FeatureFlag[]>([]);
  
  // Initialize flags from storage when component mounts
  useEffect(() => {
    setFeatureFlags(getFeatureFlags());
  }, []);

  // Update relevant flags when screen changes
  useEffect(() => {
    // Filter flags relevant to the current screen
    const flags = FEATURE_FLAGS.filter(flag => 
      flag.availableOn === 'all' || 
      (Array.isArray(flag.availableOn) && flag.availableOn.includes(currentScreen))
    );
    setRelevantFlags(flags);
  }, [currentScreen]);

  // Toggle panel open/closed
  const togglePanel = () => {
    setIsPanelOpen(prev => !prev);
    // Reset to main screen when opening
    if (!isPanelOpen) {
      setActiveScreen('main');
      setNavHistory(['main']);
    }
  };

  // Handle toggling a feature flag
  const handleToggleFlag = (flagId: string) => {
    const updatedFlags = toggleFeatureFlag(flagId);
    setFeatureFlags(updatedFlags);
  };

  // Handle resetting all flags to defaults
  const handleResetFlags = () => {
    const defaultFlags = resetFeatureFlags();
    setFeatureFlags(defaultFlags);
  };

  // Handle app navigation functions
  const handleAppBack = () => {
    if (onBack) onBack();
  };

  const handleAppNext = () => {
    if (onNext) onNext();
  };

  const handleAppRefresh = () => {
    if (onRefresh) onRefresh();
  };

  const handleAppReset = () => {
    if (onReset) onReset();
  };

  // Navigation functions
  const navigateTo = (screen: PanelScreen) => {
    setNavDirection('forward');
    setActiveScreen(screen);
    setNavHistory(prev => [...prev, screen]);
  };

  const navigateBack = () => {
    if (navHistory.length <= 1) return;
    
    setNavDirection('backward');
    const newHistory = [...navHistory];
    newHistory.pop();
    setNavHistory(newHistory);
    setActiveScreen(newHistory[newHistory.length - 1]);
  };

  // Get screen configuration
  const getScreenConfig = (screen: PanelScreen): PanelScreenConfig => {
    switch (screen) {
      case 'main':
        return { title: 'Dev Tools' };
      case 'debug':
        return { title: 'Debug Info', backButton: true };
      case 'flag-details':
        return { title: selectedFlag?.name || 'Flag Details', backButton: true };
      case 'navigation':
        return { title: 'Navigation', backButton: true };
      default:
        return { title: 'Dev Tools' };
    }
  };

  // Calculate total if both amounts exist
  const totalAmount = baseAmount && tipAmount 
    ? (parseFloat(baseAmount) + parseFloat(tipAmount)).toFixed(2)
    : null;

  // Panel animations
  const panelVariants = {
    closed: {
      x: '100%',
      opacity: 0.9,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      x: '0%',
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 30,
      }
    }
  };

  // Screen animation variants
  const screenVariants = {
    enter: (direction: 'forward' | 'backward') => ({
      x: direction === 'forward' ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 400, damping: 30 },
        opacity: { duration: 0.2 }
      }
    },
    exit: (direction: 'forward' | 'backward') => ({
      x: direction === 'forward' ? '-100%' : '100%',
      opacity: 0,
      transition: {
        x: { type: 'spring', stiffness: 400, damping: 30 },
        opacity: { duration: 0.2 }
      }
    })
  };

  // Flag item animations
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

  // Render a button with chevron
  const renderNavButton = (label: string, onClick: () => void, disabled = false) => (
    <button
      className={`w-full py-3 px-4 mb-2 rounded-lg text-white text-left flex items-center justify-between
        ${disabled ? 'bg-white/5 text-white/40 cursor-not-allowed' : 'bg-white/10 hover:bg-white/15 active:bg-white/20'}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span>{label}</span>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/40" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>
    </button>
  );

  // Render the current screen content
  const renderScreenContent = () => {
    switch (activeScreen) {
      case 'main':
        return (
          <div className="space-y-4">
            {/* Main navigation groups */}
            <div className="mb-6">
              <h3 className="text-white font-medium mb-2">Navigation & Debug</h3>
              <div 
                className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-between"
                onClick={() => navigateTo('navigation')}
              >
                <div>
                  <div className="font-medium text-white">App Navigation</div>
                  <p className="text-white/60 text-sm">Navigate between screens</p>
                </div>
                <div className="text-white/40">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Feature flags list header */}
            <div className="py-2">
              <h3 className="text-white font-medium">Feature Flags</h3>
              <p className="text-white/60 text-xs">Showing flags for the current screen</p>
            </div>

            {/* Feature flag list */}
            {relevantFlags.length > 0 ? (
              relevantFlags.map(flag => (
                <motion.div 
                  key={flag.id}
                  variants={itemVariants}
                  className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors flex items-center justify-between"
                  onClick={() => {
                    setSelectedFlag(flag);
                    navigateTo('flag-details');
                  }}
                >
                  <div>
                    <div className="font-medium text-white flex items-center">
                      {flag.name}
                      {featureFlags[flag.id] && (
                        <span className="ml-2 px-1.5 py-0.5 bg-green-500 rounded-full text-xs text-black font-medium">
                          ON
                        </span>
                      )}
                    </div>
                    <p className="text-white/60 text-sm">{flag.description}</p>
                  </div>
                  <div className="text-white/40">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                variants={itemVariants}
                className="text-white/60 text-center py-8"
              >
                No feature flags available for this screen
              </motion.div>
            )}

            {/* Reset button */}
            <div className="pt-4 pb-2">
              <button
                onClick={handleResetFlags}
                className="w-full px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded transition-colors"
              >
                Reset All Flags to Default
              </button>
            </div>
          </div>
        );
      
      case 'navigation':
        return (
          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-medium mb-3">App Navigation</h3>
              <div className="space-y-2">
                {renderNavButton('Back', handleAppBack, !onBack)}
                {renderNavButton('Next', handleAppNext, !onNext)}
                {renderNavButton('Refresh', handleAppRefresh, !onRefresh)}
                {renderNavButton('Reset to Home', handleAppReset, !onReset)}
              </div>
              <p className="mt-4 text-xs text-white/50">
                Use these controls to navigate between screens in the app. 
                These replace the DevNav buttons that were previously at the top of the screen.
              </p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-medium mb-3">Current Navigation State</h3>
              <div className="text-white/70 space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/60">Current Screen:</span>
                  <span className="text-white font-medium">{currentScreen}</span>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'debug':
        return (
          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-medium mb-3">Application State</h3>
              <div className="text-white/70 space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/60">Current Screen:</span>
                  <span className="text-white font-medium">{currentScreen}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Base Amount:</span>
                  <span className="text-white font-medium">{baseAmount || 'null'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Tip Amount:</span>
                  <span className="text-white font-medium">{tipAmount || 'null'}</span>
                </div>
                {totalAmount && (
                  <div className="flex justify-between">
                    <span className="text-white/60">Total Amount:</span>
                    <span className="text-white font-medium">${totalAmount}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-medium mb-3">Active Feature Flags</h3>
              {Object.entries(featureFlags)
                .filter(([_, value]) => value)
                .map(([key]) => {
                  const flag = FEATURE_FLAGS.find(f => f.id === key);
                  return flag ? (
                    <div key={key} className="flex items-center py-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-white">{flag.name}</span>
                    </div>
                  ) : null;
                })}
              {!Object.values(featureFlags).some(v => v) && (
                <div className="text-white/60 text-sm">No flags currently enabled</div>
              )}
            </div>
          </div>
        );
      
      case 'flag-details':
        if (!selectedFlag) return null;
        return (
          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-medium mb-1">{selectedFlag.name}</h3>
              <p className="text-white/60 text-sm mb-4">{selectedFlag.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-white">Enable this flag</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={featureFlags[selectedFlag.id] || false}
                    onChange={() => handleToggleFlag(selectedFlag.id)}
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
              
              <div className="pt-2 border-t border-white/10">
                <div className="text-white/60 text-xs mt-2">
                  <div className="mb-1">
                    Flag ID: <span className="text-white/80 font-mono">{selectedFlag.id}</span>
                  </div>
                  <div>
                    Available on: {selectedFlag.availableOn === 'all' 
                      ? 'All screens' 
                      : Array.isArray(selectedFlag.availableOn) 
                        ? selectedFlag.availableOn.join(', ')
                        : selectedFlag.availableOn
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const currentConfig = getScreenConfig(activeScreen);

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={togglePanel}
        className="fixed top-4 right-4 z-[10000] px-4 py-2 rounded-full text-white bg-white/20 hover:bg-white/30 transition-colors"
      >
        {isPanelOpen ? 'Close Panel' : 'Dev Tools'}
      </button>

      {/* Main panel with navigation */}
      <AnimatePresence>
        {isPanelOpen && (
          <motion.div
            className="fixed top-0 right-0 bottom-0 w-80 bg-black/90 backdrop-blur-md border-l border-white/20 z-[9999] overflow-hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={panelVariants}
          >
            {/* Header */}
            <div className="sticky top-0 bg-black/90 backdrop-blur-md pt-4 px-3 pb-3 border-b border-white/20 flex items-center">
              {currentConfig.backButton && (
                <button 
                  onClick={navigateBack}
                  className="p-2 -ml-2 mr-1 text-white/60 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
              <h2 className="text-white text-lg font-medium flex-1">{currentConfig.title}</h2>
              <button 
                onClick={togglePanel}
                className="p-2 -mr-2 text-white/60 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Content area with screens */}
            <div className="relative h-[calc(100%-60px)] overflow-hidden">
              <AnimatePresence custom={navDirection} initial={false}>
                <motion.div
                  key={activeScreen}
                  className="absolute inset-0 overflow-auto p-3"
                  custom={navDirection}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  variants={screenVariants}
                >
                  {renderScreenContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}; 