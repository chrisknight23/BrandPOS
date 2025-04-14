/**
 * Available screen names in the application
 */
export type Screen = 
  | 'Home'
  | 'Cart'
  | 'TapToPay'
  | 'Tipping'
  | 'Cashback'
  | 'CustomTip'
  | 'End';

export interface ScreenProps {
  onNext: () => void;
} 