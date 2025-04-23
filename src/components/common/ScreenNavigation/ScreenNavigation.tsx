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

/**
 * ScreenNavigation
 *
 * Bottom navigation bar for switching between screens.
 * Uses PillButton for each nav item.
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
  return (
    <nav className={`flex gap-1.5 ${className}`} aria-label="Screen navigation">
      {screens.map((screen) => (
        <PillButton
          key={screen.value}
          active={currentScreen === screen.value}
          onClick={() => onScreenSelect(screen.value)}
          ariaLabel={screen.label}
        >
          {screen.label}
        </PillButton>
      ))}
    </nav>
  );
};

export default ScreenNavigation; 