/**
 * Available screen names in the application
 */
export type Screen = 
  | 'Home'
  | 'Cart'
  | 'Payment'
  | 'Auth'
  | 'Tipping'
  | 'Cashback'
  | 'CashoutSuccess'
  | 'CustomTip'
  | 'End';

export interface ScreenProps {
  onNext: () => void;
} 