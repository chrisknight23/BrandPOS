/**
 * Available screen names in the application
 */
export type Screen = 
  | 'Home'
  | 'Follow'
  | 'Screensaver'
  | 'ScreensaverExit'
  | 'ScreensaverFollow'
  | 'Cart'
  | 'Payment'
  | 'Auth'
  | 'Tipping'
  | 'Reward'
  | 'Cashout'
  | 'CustomTip'
  | 'End';

export interface ScreenProps {
  onNext: () => void;
} 