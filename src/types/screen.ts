/**
 * Available screen names in the application
 */
export type Screen = 
  | 'Home'
  | 'Cart'
  | 'Payment'
  | 'Tipping'
  | 'Cashback'
  | 'CustomTip'
  | 'End';

export interface ScreenProps {
  onNext: () => void;
} 