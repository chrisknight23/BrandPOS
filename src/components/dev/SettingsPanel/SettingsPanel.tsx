/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
// Globals for browser and Node.js
/* global console, setTimeout, process, window */
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Screen } from '../../../types/screen';
import { 
  getFeatureFlags, 
  toggleFeatureFlag, 
  resetFeatureFlags
} from '../../../utils/featureFlags';
import { FEATURE_FLAGS, FeatureFlag } from '../../../constants/featureFlags';
import { SCREEN_ORDER } from '../../../constants/screens';
import FilterIcon from '../../../assets/images/filter.svg';
import CloseIcon from '../../../assets/images/close.svg';
import BackIcon from '../../../assets/images/back.svg';
// import LeftNavIcon from '../../assets/images/leftNav.svg';
// import RightNavIcon from '../../assets/images/rightNav.svg';
// import MoreIcon from '../../assets/images/more.svg';
// import ChevronRightIcon from '../../assets/images/chevron-right.svg';
import ControlIcon from '../../../assets/images/16/control.svg';
import avatarIcon from '../../../assets/images/avatar.svg';
import { Button } from '../../ui/button';
import { MiniDrawButton } from '../mini-draw';
import CategoryEntertainmentIcon from '../../../assets/images/16/category-entertainment.svg';
import InvestingIcon from '../../../assets/images/16/investing.svg';
import DocumentIcon from '../../../assets/images/16/document.svg';
import { useUserType } from '../../../context/UserTypeContext';
import { useTab } from './TabContext';
import InteractionView from './views/InteractionView';
import AnalyticsView from './views/AnalyticsView';
import ChangelogView from './views/ChangelogView';
import SettingsView from './views/SettingsView';

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
type UserType = 'new' | 'returning' | 'enrolled';

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
    bio: 'A customer that has not been identified as a Cash App customer and does not have a Cash App account. This represents a completely new user with no transaction history or saved information.',
    details: [
      { label: 'Status', value: 'New' },
      { label: 'Loyalty Points', value: '0' },
      { label: 'Orders', value: 'None' },
      { label: 'Cash App installed', value: 'No' }
    ]
  },
  returning: {
    name: 'John Doe',
    subtitle: 'Visited 3 times',
    avatar: '👨',
    bio: 'Regular customer who visits occasionally. Has made a few purchases but has not yet cashed out their local cash. Still uses a physical card for most transactions.',
    details: [
      { label: 'Status', value: 'Regular' },
      { label: 'Loyalty Points', value: '350' },
      { label: 'Orders', value: '3 completed' },
      { label: 'Cash App installed', value: 'No' }
    ]
  },
  enrolled: {
    name: 'Jane Smith',
    subtitle: 'Enrolled since Jan 2023',
    avatar: '👩',
    bio: 'Loyal customer who frequently uses Cash App. Has completed the enrollment process and actively participates in the rewards program. Prefers contactless payment for all transactions.',
    details: [
      { label: 'Status', value: 'Gold Member' },
      { label: 'Loyalty Points', value: '2,450' },
      { label: 'Orders', value: '24 completed' },
      { label: 'Cash App installed', value: 'Yes' }
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
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Tab context
  const { activeTab, setActiveTab } = useTab();
  // Ensure 'interaction' is the default view when the drawer opens
  useEffect(() => {
    setActiveTab('interaction');
  }, [setActiveTab]);
  
  // Flags state
  const [featureFlags, setFeatureFlags] = useState<Record<string, boolean>>({});
  const [relevantFlags, setRelevantFlags] = useState<FeatureFlag[]>([]);

  // Cart state - convert from parent format
  const [localCartItems, setLocalCartItems] = useState<InternalCartItem[]>([]);
  
  // Description state
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  
  // User type context
  const { setUserType } = useUserType();
  
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
      setActiveTab('interaction');
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
    // Check if we're trying to navigate from Home to Cart (which would be the next screen)
    if (currentScreen === 'Home' && onNext) {
      const nextScreenIndex = SCREEN_ORDER.indexOf(currentScreen) + 1;
      const isNavigatingToCart = SCREEN_ORDER[nextScreenIndex] === 'Cart';
      
      // If we're navigating to Cart and the cart is empty, add an item first
      if (isNavigatingToCart && localCartItems.length === 0 && onAddItem) {
        console.log('Navigating from Home to Cart with empty cart, adding an item first');
        onAddItem(); // Add an item first
        
        // Wait a short moment for the state to update before navigating
        setTimeout(() => {
          if (onNext) onNext();
        }, 100);
        return;
      }
    }
    
    // Normal navigation for other cases
    if (onNext) {
      onNext();
    }
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
    console.log('Clearing cart...');
    // Just call the parent's onClearCart
    if (onClearCart) {
      onClearCart();
      
      // The cart is now empty, so we need to reset the local cart state as well
      setLocalCartItems([]);
    }
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

  // Handle checkout - Navigate to Payment screen
  const handleCheckout = () => {
    if (onNext && currentScreen === 'Cart') {
      // If we're on the Cart screen, navigate to Payment
      onNext();
    } else if (currentScreen === 'Home' && onNext) {
      // If we're on Home, we need to go to Cart first, then to Payment
      onNext();
      // Add a small delay before navigating to Payment to allow for screen transition
      setTimeout(() => {
        if (onNext) onNext();
      }, 100);
    }
  };

  // Navigation functions
  const navigateTo = (tab: PanelScreen) => {
    console.log(`Navigating to: ${tab}`);
    setActiveTab(tab);
  };

  const navigateBack = () => {
    console.log(`Navigating back from: ${activeTab}`);
    if (activeTab === 'main') {
      // If we're at the root level, close the panel
      console.log('At root level, closing panel');
      togglePanel();
      return;
    }
    setActiveTab('interaction');
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
        return { title: activeTab === 'interaction' ? 'Flag Details' : 'Flag Details', backButton: true };
      case 'navigation':
        return { title: 'Navigation', backButton: true };
      case 'cart':
        return { title: 'Cart Management', backButton: true };
      case 'profile':
        return { title: 'Customer Selection', backButton: true };
      case 'feature-flags':
        return { title: `${currentScreen} Features`, backButton: true };
      default:
        return { title: currentScreen, backButton: false };
    }
  };

  // Get screen description
  const getScreenDescription = (screen: PanelScreen): string => {
    switch (screen) {
      case 'main':
        switch (currentScreen) {
          case 'Home':
            return 'Home Screen: Users see the Square POS welcome screen. This is where merchants start the payment process by adding items to the cart.';
          case 'Cart':
            return 'Cart Screen: Users see the total price ($) at the top and a list of items below with individual prices. They can review their order before tapping to continue to payment.';
          case 'Payment':
            return 'Payment Screen: Users see a blue screen with the amount and payment notches. They tap their Cash Card or contactless payment method to complete the transaction.';
          case 'Tipping':
            return 'Tipping Screen: Users choose from preset tip amounts or select a custom tip. The screen alternates between "Give a Tip" and "Earn Local Cash" prompts.';
          case 'Cashback':
            return 'Cashback Screen: Users can select a cashback amount from preset options or choose no cashback. A Cash App card animation appears when making a selection.';
          case 'End':
            return 'End Screen: Users see a transaction complete message with their total amount. The payment flow is complete and they can start a new transaction.';
          default:
            return `${currentScreen} Screen: Control hub for this screen. Manage features and test different user experiences.`;
        }
      case 'app-info':
        return 'Shows financial details of the current transaction: base amount charged, tip amount selected by the customer, and the calculated total amount.';
      case 'debug':
        return 'Provides technical insights about the application: current screen in view, active feature flags, app version, window size, and detailed navigation history.';
      case 'flag-details':
        return 'Allows toggling of specific features for the selected flag. Shows detailed information including the flag ID and which screens the flag affects.';
      case 'navigation':
        return 'Controls movement through the payment flow sequence: Home → Cart → Tap to Pay → Tipping → Cashback → End. Buttons let you move forward/backward or reset.';
      case 'cart':
        return 'Manages the shopping cart: add single or multiple items, view current items with price details, remove individual items, or clear the entire cart.';
      case 'profile':
        return ''; // Remove description for profile screen
      case 'feature-flags':
        return 'Enables/disables features available on the current screen. For example: animations on Cashback screen, enhanced UI on Tipping screen, or payment indicators.';
      default:
        return '';
    }
  };

  // Block cart screen if not on Cart
  useEffect(() => {
    if (activeTab === 'cart' && currentScreen !== 'Cart') {
      navigateBack();
    }
    // No longer navigate back if cart is empty - stay on cart screen
  }, [currentScreen, activeTab]);

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

  // Render the current tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'interaction':
        return <InteractionView cartItems={parentCartItems} onAddItem={onAddItem} onClearCart={onClearCart} onRemoveCartItem={onRemoveCartItem} currentScreen={currentScreen} />;
      case 'analytics':
        return <AnalyticsView currentScreen={currentScreen} baseAmount={baseAmount} tipAmount={tipAmount} onBack={onBack} onNext={onNext} onRefresh={onRefresh} onReset={onReset} />;
      case 'changelog':
        return <ChangelogView />;
      default:
        return <InteractionView cartItems={parentCartItems} onAddItem={onAddItem} onClearCart={onClearCart} onRemoveCartItem={onRemoveCartItem} currentScreen={currentScreen} />;
    }
  };

  const currentConfig = getScreenConfig((activeTab as any));

  return (
    <LayoutGroup>
      <div className="w-full h-full flex flex-col min-h-0 min-w-0 overflow-hidden p-6" ref={buttonRef}>
        {/* Header area */}
        <div>
          <div>
            <div className="flex justify-between items-center">
              {/* Back button on the left, if present */}
              {currentConfig.backButton ? (
                <button
                  className="p-2 text-white/60 hover:text-white"
                  onClick={navigateBack}
                  aria-label="Back"
                >
                  <img 
                    src={BackIcon} 
                    alt="Back" 
                    className="w-5 h-5" 
                  />
                </button>
              ) : (
                <div className="w-9" />
              )}
              {/* Spacer for title or alignment, if needed */}
              <div />
              {/* Close button always on the right */}
              <button
                className="p-2 text-white/60 hover:text-white"
                onClick={togglePanel}
                aria-label="Close"
              >
                <img 
                  src={CloseIcon} 
                  alt="Close" 
                  className="w-5 h-5" 
                />
              </button>
            </div>
          </div>
        </div>

        {/* Main title reflects the current screen name, sub copy is the screen description */}
        {activeTab !== 'profile' && getScreenDescription((activeTab as any)) && (
          <div className="pt-0 pl-0 pr-0">
            <h2 className="text-white text-[24px] font-cash font-semibold mb-2">
              {currentConfig.title}
            </h2>
            <div 
              className="relative cursor-pointer" 
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
            >
              <p className={`text-white/60 text-sm ${!isDescriptionExpanded ? 'line-clamp-3' : ''}`}>
                {getScreenDescription((activeTab as any))}
              </p>
            </div>
          </div>
        )}

        {/* Content area for tab views */}
        <div className="flex-1 flex flex-col min-h-0 min-w-0 overflow-auto p-0">
          {renderTabContent()}
        </div>
        {/* Divider between content and footer */}
        <div className="border-t border-white/10 my-4 w-full" />
        {/* Footer navigation */}
        <div>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              {/* Tab: Interaction */}
              <button
                className={`w-10 h-10 rounded-full border ${activeTab === 'interaction' ? 'border-white bg-white' : 'border-white/20 bg-transparent hover:bg-white/5 active:bg-white/10'} flex items-center justify-center`}
                onClick={() => setActiveTab('interaction')}
                aria-label="Interaction"
              >
                <img src={CategoryEntertainmentIcon} alt="Interaction" className="w-4 h-4" width="16" height="16" style={{ filter: activeTab === 'interaction' ? 'invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%)' : undefined }} />
              </button>
              {/* Tab: Analytics */}
              <button
                className={`w-10 h-10 rounded-full border ${activeTab === 'analytics' ? 'border-white bg-white' : 'border-white/20 bg-transparent hover:bg-white/5 active:bg-white/10'} flex items-center justify-center`}
                onClick={() => setActiveTab('analytics')}
                aria-label="Analytics"
              >
                <img src={InvestingIcon} alt="Analytics" className="w-4 h-4" width="16" height="16" />
              </button>
              {/* Tab: Changelog */}
              <button
                className={`w-10 h-10 rounded-full border ${activeTab === 'changelog' ? 'border-white bg-white' : 'border-white/20 bg-transparent hover:bg-white/5 active:bg-white/10'} flex items-center justify-center`}
                onClick={() => setActiveTab('changelog')}
                aria-label="Changelog"
              >
                <img src={DocumentIcon} alt="Changelog" className="w-4 h-4" width="16" height="16" />
              </button>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => activeTab === 'feature-flags' ? setActiveTab('main') : setActiveTab('feature-flags')}
                className={`w-10 h-10 rounded-full border ${
                  activeTab === 'feature-flags' 
                    ? 'bg-white border-white' 
                    : 'border-white/20 bg-transparent hover:bg-white/5 active:bg-white/10'
                } flex items-center justify-center`}
              >
                <img 
                  src={ControlIcon} 
                  alt="Features" 
                  width={16} 
                  height={16}
                  className={activeTab === 'feature-flags' ? 'brightness-0' : 'opacity-80'} 
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </LayoutGroup>
  );
};

export default ExpandableDevPanel; 