export type Screen = 
  | 'Home'
  | 'Cart'
  | 'TapToPay'
  | 'Tipping'
  | 'CashbackCard'
  | 'QRMoment'
  | 'End';

export interface ScreenProps {
  onNext: () => void;
} 