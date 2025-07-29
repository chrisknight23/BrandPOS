import { useState } from 'react';
import { ExpandableDevPanel } from './SettingsPanel';
import { useEdgeGesture } from '../../../hooks/useEdgeGesture';
import { useIsPWA } from '../../../hooks/useIsPWA';
import { Screen, NavigationOptions } from '../../../types/screen';
import { TabProvider } from './TabContext';

interface SettingsPanelProps {
  currentScreen: Screen;
  baseAmount: string | null;
  tipAmount: string | null;
  cartItems?: { id: number; name: string; price: number; quantity: number }[];
  onBack?: () => void;
  onNext?: () => void;
  onRefresh?: () => void;
  onReset?: () => void;
  onResetSession?: () => void;
  onAddItem?: () => void;
  onClearCart?: () => void;
  onRemoveCartItem?: (itemId: number) => void;
  simulateScan?: () => void;
  isQrVisible?: boolean;
  onQrVisibleChange?: (visible: boolean) => void;
  goToScreen?: (screen: Screen, options?: NavigationOptions) => void;
  isPaused?: boolean;
  setIsPaused?: (paused: boolean) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const isPWA = useIsPWA();

  // Set up edge gesture in PWA mode
  useEdgeGesture({
    onGestureComplete: () => {
      setIsOpen(true);
    },
    threshold: 80 // Slightly lower threshold for easier activation
  });

  return (
    <TabProvider>
      <ExpandableDevPanel
        {...props}
        isOpen={isOpen}
        onPanelToggle={(open) => setIsOpen(open)}
      />
    </TabProvider>
  );
};

export default SettingsPanel; 