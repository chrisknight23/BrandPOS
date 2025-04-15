import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Screen } from '../../types/screen';
import { 
  getFeatureFlags, 
  toggleFeatureFlag, 
  resetFeatureFlags,
  isFeatureEnabled
} from '../../utils/featureFlags';
import { FEATURE_FLAGS, FeatureFlag } from '../../constants/featureFlags';
import FilterIcon from '../../assets/images/filter.svg';
import CloseIcon from '../../assets/images/close.svg';
import BackIcon from '../../assets/images/back.svg';
import LeftNavIcon from '../../assets/images/leftNav.svg';
import RightNavIcon from '../../assets/images/rightNav.svg';
import MoreIcon from '../../assets/images/more.svg';
import ChevronRightIcon from '../../assets/images/chevron-right.svg';
import { Button } from '../../components/ui/button';

interface ExpandableDevPanelProps {
  currentScreen: Screen;
  baseAmount: string | null;
  tipAmount: string | null;
  cartItems?: { id: number; name: string; price: number; quantity: number }[];
  onBack?: () => void;
  onNext?: () => void;
  onRefresh?: () => void;
  onReset?: () => void;
  onPanelToggle?: (isOpen: boolean) => void;
  onAddItem?: () => void;
  onClearCart?: () => void;
  onRemoveCartItem?: (itemId: number) => void;
}

// Define the navigation screens that can be shown in the panel
type PanelScreen = 'main' | 'app-info' | 'debug' | 'flag-details' | 'navigation' | 'cart' | 'profile' | 'feature-flags';

// Define user types for the segmented control
type UserType = 'new' | 'enrolled';

interface PanelScreenConfig {
  title: string;
  backButton?: boolean;
}

// Profile data for different user types
const profileData = {
  new: {
    name: 'Customer unknown',
    subtitle: 'Card being used for the first time',
    avatar: ' ',
    details: [
      { label: 'Status', value: 'New' },
      { label: 'Loyalty Points', value: '0' },
      { label: 'Orders', value: 'None' }
    ]
  },
  enrolled: {
    name: 'Jane Smith',
    subtitle: 'Enrolled since Jan 2023',
    avatar: '👩',
    details: [
      { label: 'Status', value: 'Gold Member' },
      { label: 'Loyalty Points', value: '2,450' },
      { label: 'Orders', value: '24 completed' }
    ]
  }
};

// Define a cart item interface - matching MainView for internal use
interface InternalCartItem {
  id: string;
  name: string;
  price: string;
  timestamp: number;
}

export const ExpandableDevPanel: React.FC<ExpandableDevPanelProps> = ({
  currentScreen,
  baseAmount,
  tipAmount,
  cartItems: parentCartItems = [],
  onBack,
  onNext,
  onRefresh,
  onReset,
  onPanelToggle,
  onAddItem,
  onClearCart,
  onRemoveCartItem
}) => {
  // Panel state
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Navigation state
  const [activeScreen, setActiveScreen] = useState<PanelScreen>('main');
  const [navHistory, setNavHistory] = useState<PanelScreen[]>(['main']);
  const [navDirection, setNavDirection] = useState<'forward' | 'backward'>('forward');
  const [selectedFlag, setSelectedFlag] = useState<FeatureFlag | null>(null);
  
  // User type state for segmented control
  const [userType, setUserType] = useState<UserType>('new');
  
  // Flags state
  const [featureFlags, setFeatureFlags] = useState<Record<string, boolean>>({});
  const [relevantFlags, setRelevantFlags] = useState<FeatureFlag[]>([]);

  // Cart state - convert from parent format
  const [localCartItems, setLocalCartItems] = useState<InternalCartItem[]>([]);
  
  // Convert parent cart items to internal format
  useEffect(() => {
    // Map parent cart items to internal format
    const convertedItems = parentCartItems.map(item => ({
      id: `parent-${item.id}`,
      name: item.name,
      price: `$${item.price.toFixed(2)}`,
      timestamp: Date.now()
    }));
    
    setLocalCartItems(convertedItems);
  }, [parentCartItems]);
  
  // Refs for measuring panel size
  const buttonRef = useRef<HTMLDivElement>(null);
  
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

  // Notify parent of panel state changes
  useEffect(() => {
    if (onPanelToggle) {
      onPanelToggle(isExpanded);
    }
  }, [isExpanded, onPanelToggle]);

  // Toggle panel open/closed
  const togglePanel = () => {
    setIsExpanded(prev => !prev);
    
    // Reset to main screen when opening
    if (!isExpanded) {
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

  // Handle user type selection
  const handleUserTypeChange = (type: UserType) => {
    setUserType(type);
    // You could add additional logic here to update feature flags based on user type
    console.log(`User type changed to: ${type}`);
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

  // Handle cart functions
  const handleAddItem = () => {
    // Just call the parent's onAddItem to keep synchronized
    if (onAddItem) onAddItem();
  };

  const handleAddMultipleItems = () => {
    // Call the parent's onAddItem multiple times
    if (onAddItem) {
      for (let i = 0; i < 5; i++) {
        onAddItem();
      }
    }
  };

  const handleClearCart = () => {
    // Just call the parent's onClearCart
    if (onClearCart) onClearCart();
  };

  const handleRemoveCartItem = (id: string) => {
    // Remove from local state
    setLocalCartItems(prev => prev.filter(item => item.id !== id));
    
    // If the parent provided a remove function and the ID is from a parent item,
    // extract the numeric ID and call the parent's remove function
    if (onRemoveCartItem && id.startsWith('parent-')) {
      const parentId = parseInt(id.replace('parent-', ''), 10);
      if (!isNaN(parentId)) {
        onRemoveCartItem(parentId);
      }
    }
  };

  // Handle checkout - Navigate to TapToPay screen
  const handleCheckout = () => {
    if (onNext && currentScreen === 'Cart') {
      // If we're on the Cart screen, navigate to TapToPay
      onNext();
    } else if (currentScreen === 'Home' && onNext) {
      // If we're on Home, we need to go to Cart first, then to TapToPay
      onNext();
      // Add a small delay before navigating to TapToPay to allow for screen transition
      setTimeout(() => {
        if (onNext) onNext();
      }, 100);
    }
  };

  // Navigation functions
  const navigateTo = (screen: PanelScreen) => {
    console.log(`Navigating to: ${screen}`);
    setNavDirection('forward');
    setActiveScreen(screen);
    setNavHistory(prev => [...prev, screen]);
  };

  const navigateBack = () => {
    console.log(`Navigating back from: ${activeScreen}, history: ${navHistory.join(',')}`);
    if (navHistory.length <= 1) {
      // If we're at the root level, close the panel
      console.log('At root level, closing panel');
      togglePanel();
      return;
    }
    
    setNavDirection('backward');
    const newHistory = [...navHistory];
    newHistory.pop();
    const previousScreen = newHistory[newHistory.length - 1];
    console.log(`Going back to: ${previousScreen}`);
    setNavHistory(newHistory);
    setActiveScreen(previousScreen);
  };

  // Get screen configuration
  const getScreenConfig = (screen: PanelScreen): PanelScreenConfig => {
    switch (screen) {
      case 'main':
        return { title: currentScreen, backButton: false };
      case 'app-info':
        return { title: 'App Info', backButton: true };
      case 'debug':
        return { title: 'Debug', backButton: true };
      case 'flag-details':
        return { title: selectedFlag?.name || 'Flag Details', backButton: true };
      case 'navigation':
        return { title: 'Navigation', backButton: true };
      case 'cart':
        return { title: 'Cart Management', backButton: true };
      case 'profile':
        return { title: 'User Profile', backButton: true };
      case 'feature-flags':
        return { title: `${currentScreen} Features`, backButton: true };
      default:
        return { title: currentScreen, backButton: false };
    }
  };

  // Block cart screen if not on Cart
  useEffect(() => {
    if (activeScreen === 'cart' && currentScreen !== 'Cart') {
      navigateBack();
    }
  }, [currentScreen, activeScreen]);

  // Calculate total if both amounts exist
  const totalAmount = baseAmount && tipAmount 
    ? (parseFloat(baseAmount) + parseFloat(tipAmount)).toFixed(2)
    : null;

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
    // Profile button component that will be used in all screens
    const ProfileButton = (
      <button
        className="w-full rounded-lg px-4 py-3 mb-3 border border-white/20 text-white text-left flex items-center justify-between"
        onClick={() => navigateTo('profile')}
      >
        <div>
          <div className="font-medium">{profileData[userType].name}</div>
          <p className="text-white/60 text-sm">{profileData[userType].subtitle}</p>
        </div>
        {profileData[userType].avatar && (
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
            {profileData[userType].avatar}
          </div>
        )}
      </button>
    );
    
    switch (activeScreen) {
      case 'main':
        return (
          <div className="space-y-4 flex flex-col h-full">
            {/* Main content section - takes up available space */}
            <div className="flex-1">
              {/* Profile Button */}
              {ProfileButton}
              
              {/* Always show items section on Home or Cart screens, regardless of cart contents */}
              {(currentScreen === 'Home' || currentScreen === 'Cart') && (
                <div className="rounded-lg">
                  <div className="flex items-center pt-3 pb-2">
                    <h3 className="text-white font-medium">Items ({localCartItems.length})</h3>
                  </div>
                  <div className="space-y-3">
                    {/* Only show cart items if there are any */}
                    {localCartItems.length > 0 ? (
                      localCartItems.map(item => (
                        <div key={item.id} className="bg-white/5 rounded-lg px-4 py-3 flex items-center justify-between">
                          <div>
                            <div className="text-white font-medium">{item.name}</div>
                            <div className="text-white/60 text-sm">{item.price}</div>
                          </div>
                          <button 
                            onClick={() => handleRemoveCartItem(item.id)}
                            className="p-1.5 text-white/40 hover:text-white/70 hover:bg-white/10 rounded-full"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-white/40 text-center py-8">
                        No items in cart
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Bottom buttons section */}
            <div className="space-y-4 mt-auto">
              {/* Buttons only shown on Home or Cart screens */}
              {(currentScreen === 'Home' || currentScreen === 'Cart') && (
                <>
                  {/* Add item button */}
                  <button
                    onClick={handleAddItem}
                    className="w-full rounded-lg px-4 py-3 border border-white/20 flex items-center justify-center"
                  >
                    <span className="text-white/80 font-medium">Add item</span>
                  </button>
                  
                  {/* Checkout button */}
                  <Button
                    onClick={handleCheckout}
                    disabled={localCartItems.length === 0}
                    className={`w-full rounded-full py-4 ${
                      localCartItems.length > 0 
                        ? 'bg-[#00B843] hover:bg-[#00A33C] active:bg-[#008F35]' 
                        : 'bg-white/10 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-center text-white">
                      <div className="text-base font-medium">Checkout</div>
                    </div>
                  </Button>
                </>
              )}
              
              {/* Divider */}
              <div className="border-t border-white/10 pt-4"></div>
              
              {/* Feature button */}
              <Button
                onClick={() => setActiveScreen('feature-flags')}
                className="w-full rounded-lg py-3"
              >
                <div className="flex items-center justify-between text-white">
                  <div className="text-white/80 font-medium">Features</div>
                  <img src={ChevronRightIcon} alt="arrow" width={20} height={20} />
                </div>
              </Button>
            </div>
          </div>
        );
      
      case 'feature-flags':
        return (
          <div className="space-y-4">
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
            <div className="pt-4 pb-6">
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
      
      case 'app-info':
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

            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-medium mb-3">Panel Navigation History</h3>
              <div className="text-white/70">
                {navHistory.map((screen, index) => (
                  <div key={index} className="flex items-center py-1">
                    <div className={`w-2 h-2 rounded-full mr-2 ${index === navHistory.length - 1 ? 'bg-green-500' : 'bg-white/30'}`}></div>
                    <span className={`${index === navHistory.length - 1 ? 'text-white' : 'text-white/60'}`}>
                      {screen}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-medium mb-3">Environment</h3>
              <div className="text-white/70 space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/60">Version:</span>
                  <span className="text-white font-medium">V0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Mode:</span>
                  <span className="text-white font-medium">{process.env.NODE_ENV || 'development'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Window Size:</span>
                  <span className="text-white font-medium">{`${window.innerWidth}x${window.innerHeight}`}</span>
                </div>
              </div>
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
      
      case 'cart':
        return (
          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-medium mb-3">Cart Management</h3>
              
              <div className="space-y-4">
                <div className="bg-white/10 rounded-lg p-3">
                  <h4 className="text-white text-sm font-medium mb-2">Add Items</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleAddItem}
                      className="py-2 px-3 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white text-sm rounded transition-colors flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Add Item
                    </button>
                    <button
                      onClick={handleAddMultipleItems}
                      className="py-2 px-3 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white text-sm rounded transition-colors flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Add 5 Items
                    </button>
                  </div>
                </div>
                
                {localCartItems.length > 0 && (
                  <div className="bg-white/10 rounded-lg p-3">
                    <h4 className="text-white text-sm font-medium mb-2">Current Items ({localCartItems.length})</h4>
                    <div className="max-h-40 overflow-y-auto divide-y divide-white/5 bg-white/5 rounded-lg">
                      {localCartItems.map(item => (
                        <div key={item.id} className="px-3 py-2 flex items-center justify-between">
                          <div>
                            <div className="text-white text-sm font-medium">{item.name}</div>
                            <div className="text-white/60 text-xs">{item.price}</div>
                          </div>
                          <button 
                            onClick={() => handleRemoveCartItem(item.id)}
                            className="p-1 text-white/40 hover:text-white/70 hover:bg-white/10 rounded-full"
                          >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="bg-white/10 rounded-lg p-3">
                  <h4 className="text-white text-sm font-medium mb-2">Clear Cart</h4>
                  <button
                    onClick={handleClearCart}
                    className="w-full py-2 px-3 bg-red-900/30 hover:bg-red-900/50 active:bg-red-900/70 text-white text-sm rounded transition-colors flex items-center justify-center"
                    disabled={localCartItems.length === 0}
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M3 7H21M16 7L15.133 4.266C14.9426 3.64976 14.3745 3.22534 13.7303 3.22534H10.2697C9.62553 3.22534 9.05742 3.64976 8.867 4.266L8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Clear All Items
                  </button>
                </div>
              </div>
              
              <p className="mt-4 text-xs text-white/50">
                These controls let you quickly modify the cart for testing purposes.
              </p>
            </div>
          </div>
        );
      
      case 'profile':
        return (
          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-medium mb-3">User Profile</h3>
              <div className="text-white/70 space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/60">Name:</span>
                  <span className="text-white font-medium">{profileData[userType].name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Subtitle:</span>
                  <span className="text-white font-medium">{profileData[userType].subtitle}</span>
                </div>
                {profileData[userType].avatar && (
                  <div className="flex justify-between">
                    <span className="text-white/60">Avatar:</span>
                    <span className="text-white font-medium">{profileData[userType].avatar}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-medium mb-3">Customer Type</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-white cursor-pointer flex items-center">
                    <div className="text-white/90">New customer</div>
                  </label>
                  <div className="relative inline-flex items-center">
                    <input
                      type="radio"
                      className="sr-only"
                      name="customerType"
                      checked={userType === 'new'}
                      onChange={() => handleUserTypeChange('new')}
                    />
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      userType === 'new' ? 'border-[#00B843] bg-[#00B843]/10' : 'border-white/30'
                    }`}>
                      {userType === 'new' && (
                        <div className="w-3 h-3 rounded-full bg-[#00B843]"></div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-white cursor-pointer flex items-center">
                    <div className="text-white/90">Returning customer</div>
                  </label>
                  <div className="relative inline-flex items-center">
                    <input
                      type="radio"
                      className="sr-only"
                      name="customerType"
                      checked={userType === 'enrolled'}
                      onChange={() => handleUserTypeChange('enrolled')}
                    />
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      userType === 'enrolled' ? 'border-[#00B843] bg-[#00B843]/10' : 'border-white/30'
                    }`}>
                      {userType === 'enrolled' && (
                        <div className="w-3 h-3 rounded-full bg-[#00B843]"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-medium mb-3">User Details</h3>
              <div className="text-white/70 space-y-2">
                {profileData[userType].details.map((detail, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-white/60">{detail.label}:</span>
                    <span className="text-white font-medium">{detail.value}</span>
                  </div>
                ))}
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
    <LayoutGroup>
      <div className="fixed top-0 right-0 p-4 z-[10000]">
        {isExpanded ? (
          // Expanded panel - no animations
          <div 
            className="bg-[#141414] rounded-[24px] overflow-hidden shadow-lg border border-white/10 w-[calc(100vw-32px)] h-[calc(100vh-32px)] max-w-[360px] flex flex-col"
            ref={buttonRef}
          >
            {/* Header area */}
            <div className="px-6 pt-4">
              <div className="flex justify-between items-center mb-4">
                <button
                  className="p-2 -ml-2 text-white/60 hover:text-white"
                  onClick={currentConfig.backButton ? navigateBack : togglePanel}
                >
                  <img 
                    src={currentConfig.backButton ? BackIcon : CloseIcon} 
                    alt={currentConfig.backButton ? "Back" : "Close"} 
                    className="w-5 h-5" 
                  />
                </button>
                
                {!currentConfig.backButton && (
                  <div className="flex space-x-2">
                    <button
                      className="text-white/60 hover:text-white"
                      onClick={handleAppBack}
                      disabled={!onBack}
                    >
                      <img src={LeftNavIcon} alt="Previous" className="w-8 h-8" />
                    </button>
                    <button
                      className="text-white/60 hover:text-white"
                      onClick={handleAppNext}
                      disabled={!onNext}
                    >
                      <img src={RightNavIcon} alt="Next" className="w-8 h-8" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="mb-2">
                <span className="text-white font-medium text-2xl">
                  {currentConfig.title}
                </span>
              </div>
            </div>

            {/* Content with nested screen animations */}
            <div className="relative flex-1 overflow-hidden">
              <AnimatePresence custom={navDirection} initial={false}>
                <motion.div
                  key={activeScreen}
                  className="absolute inset-0 overflow-auto px-6 py-6"
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
            
            {/* Version text at bottom */}
            <div className="px-6 py-2 flex justify-between items-center text-white/30 text-xs">
              <span>Version number V0</span>
              <button 
                onClick={() => navigateTo('debug')}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <img src={MoreIcon} alt="More options" className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          // Collapsed button - no animations
          <div 
            className="bg-[#141414] rounded-[24px] overflow-hidden shadow-lg border border-white/10 cursor-pointer"
            onClick={togglePanel}
          >
            <div className="flex items-center justify-between pl-6 pr-4 py-3">
              <div className="flex-1 flex items-center justify-center">
                <span className="text-white font-medium">
                  {currentScreen}
                </span>
              </div>
              
              <div className="p-2 text-white/60">
                <img src={FilterIcon} alt="Filter" className="w-5 h-5" />
              </div>
            </div>
          </div>
        )}
      </div>
    </LayoutGroup>
  );
}; 