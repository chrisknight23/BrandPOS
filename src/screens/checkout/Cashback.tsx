import { LocalPass } from '../../components/common/LocalPass';
import { useEffect } from 'react';
import { BaseScreen } from '../../components/common/BaseScreen/index';

interface CashbackProps {
  onNext: (amount?: string) => void;
  amount?: string;
}

export const Cashback = ({ onNext, amount = "1" }: CashbackProps) => {
  useEffect(() => {
    console.log(`Cashback: Component mounted with amount ${amount}`);
    
    return () => {
      console.log('Cashback: Component unmounting');
    };
  }, [amount]);

  const handleNextClick = () => {
    console.log('Cashback: Next clicked, navigating to next screen');
    onNext();
  };

  return (
    <BaseScreen onNext={onNext}>
      {/* Main container for the device frame - everything must stay within this boundary */}
      <div className="w-[800px] h-[500px] relative overflow-hidden rounded-[4px] border border-white/20">
        <div className="w-full h-full bg-black relative overflow-hidden flex items-center justify-center">
          <LocalPass
            amount={amount}
            isExpanded={true}
            onClick={handleNextClick}
            noAnimation={true}
          />
        </div>
      </div>
    </BaseScreen>
  );
}; 