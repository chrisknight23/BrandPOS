/**
 * Available screen names in the application
 */
export type Screen = 
  | 'Home'
  | 'Screensaver'
  | 'ScreensaverExit'
  | 'Cart'
  | 'Payment'
  | 'Auth'
  | 'Tipping'
  | 'Cashback'
  | 'Cashout'
  | 'CustomTip'
  | 'End';

export interface ScreenProps {
  onNext: () => void;
} 