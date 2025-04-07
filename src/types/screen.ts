/**
 * Available screen names in the application
 */
export type Screen = 
  | 'Home'
  | 'Cart'
  | 'TapToPay'
  | 'Tipping'
  | 'Cashback'
  | 'End';

export interface ScreenProps {
  onNext: () => void;
} 