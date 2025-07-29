/**
 * Available screen names in the application
 */
export type Screen = 'Home' | 'Follow' | 'Screensaver' | 'ScreensaverFollow' | 'ScreensaverExit' | 'Cart' | 'Payment' | 'Auth' | 'Tipping' | 'CustomTip' | 'Reward' | 'RewardScanned' | 'End';

export interface NavigationOptions {
  fromEndScreen?: boolean;
}

export type GoToScreenFunction = (screen: Screen, options?: NavigationOptions) => void;

export interface ScreenProps {
  onNext: () => void;
} 