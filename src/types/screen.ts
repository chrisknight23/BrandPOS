/**
 * Available screen names in the application
 */
export type Screen = 
  | 'Home'
  | 'Screensaver'
  | 'Cart'
  | 'Payment'
  | 'Auth'
  | 'Tipping'
  | 'Cashback'
  | 'Cashout'
  | 'CustomTip'
  | 'End'
  | 'Test3D';

export interface ScreenProps {
  onNext: () => void;
} 