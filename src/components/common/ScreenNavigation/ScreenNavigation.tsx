import React from 'react';
import PillButton from '../../ui/PillButton';

export interface ScreenNavItem {
  label: string;
  value: string;
}

interface ScreenNavigationProps {
  screens: ScreenNavItem[];
  currentScreen: string;
  onScreenSelect: (screen: string) => void;
  className?: string;
}

// Define screensaver screens that should be grouped in dropdown
const SCREENSAVER_SCREENS = ['Screensaver', 'ScreensaverFollow', 'ScreensaverExit'];
const PAYMENT_SCREENS = ['Payment', 'Auth'];
const TIPPING_SCREENS = ['Tipping', 'CustomTip'];

/**
 * ScreenNavigation
 *
 * Bottom navigation bar for switching between screens.
 * Uses PillButton for each nav item.
 * Groups screensaver screens under a dropdown.
 *
 * Props:
 * - screens: array of {label, value} for each screen
 * - currentScreen: the currently active screen value
 * - onScreenSelect: callback when a screen is selected
 * - className: optional extra classes
 */
const ScreenNavigation: React.FC<ScreenNavigationProps> = ({
  screens,
  currentScreen,
  onScreenSelect,
  className = '',
}) => {
  // Check if current screen is any screensaver screen
  const isScreensaverActive = SCREENSAVER_SCREENS.includes(currentScreen);
  
  // Check if current screen is any payment screen
  const isPaymentActive = PAYMENT_SCREENS.includes(currentScreen);
  
  // Check if current screen is any tipping screen
  const isTippingActive = TIPPING_SCREENS.includes(currentScreen);
  
      // Filter out grouped screens from main navigation (except main screens)
    const mainScreens = screens.filter(screen =>
      (!SCREENSAVER_SCREENS.includes(screen.value) || screen.value === 'Screensaver') &&
      (!PAYMENT_SCREENS.includes(screen.value) || screen.value === 'Payment') &&
      (!TIPPING_SCREENS.includes(screen.value) || screen.value === 'Tipping')
    );
  
      // Create screensaver dropdown items
    const screensaverDropdownItems = [
      { label: 'Screensaver', value: 'Screensaver' },
      { label: 'Exit to cart', value: 'ScreensaverExit' }
    ];
    
    // Create payment dropdown items
    const paymentDropdownItems = [
      { label: 'Payment', value: 'Payment' },
      { label: 'Auth', value: 'Auth' }
    ];
    
    // Create tipping dropdown items
    const tippingDropdownItems = [
      { label: 'Tipping', value: 'Tipping' },
      { label: 'Custom Tip', value: 'CustomTip' }
    ];

  return (
    <nav className={`flex gap-1.5 ${className}`} aria-label="Screen navigation">
              {mainScreens.map((screen) => {
          const isScreensaverPill = screen.value === 'Screensaver';
          const isPaymentPill = screen.value === 'Payment';
          const isTippingPill = screen.value === 'Tipping';

          return (
            <PillButton
              key={screen.value}
              active={
                isScreensaverPill ? isScreensaverActive :
                isPaymentPill ? isPaymentActive :
                isTippingPill ? isTippingActive :
                currentScreen === screen.value
              }
              onClick={() => onScreenSelect(screen.value)}
              ariaLabel={screen.label}
              hasDropdown={isScreensaverPill || isPaymentPill || isTippingPill}
              dropdownItems={
                isScreensaverPill ? screensaverDropdownItems :
                isPaymentPill ? paymentDropdownItems :
                isTippingPill ? tippingDropdownItems :
                undefined
              }
              onDropdownSelect={isScreensaverPill || isPaymentPill || isTippingPill ? onScreenSelect : undefined}
              currentDropdownValue={
                isScreensaverPill || isPaymentPill || isTippingPill ? currentScreen : undefined
              }
            >
              {screen.label}
            </PillButton>
          );
        })}
    </nav>
  );
};

export default ScreenNavigation; 