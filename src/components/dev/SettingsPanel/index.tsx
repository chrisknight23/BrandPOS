import { Dispatch, SetStateAction } from 'react';
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
  setIsPaused?: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
  onPanelToggle: Dispatch<SetStateAction<boolean>>;
}

const SettingsPanel: React.FC<SettingsPanelProps> = (props) => {
  const isPWA = useIsPWA();

  // Set up edge gesture in PWA mode
  useEdgeGesture({
    onGestureComplete: () => {
      console.log('Edge gesture completed, opening panel');
      props.onPanelToggle(true);
    },
    threshold: 80 // Slightly lower threshold for easier activation
  });

  return (
    <TabProvider>
      <ExpandableDevPanel {...props} />
    </TabProvider>
  );
};

export default SettingsPanel; 