/**
 * Available screen names in the application
 */
export type Screen = 
  | 'Home'
  | 'Follow'
  | 'Screensaver'
  | 'ScreensaverFollow'
  | 'ScreensaverExit'
  | 'Cart'
  | 'Payment'
  | 'Auth'
  | 'Tipping'
  | 'CustomTip'
  | 'Reward'
  | 'End';

export interface ScreenProps {
  onNext: () => void;
} 