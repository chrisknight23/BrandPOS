import { LocalPass } from '../../components/common/LocalPass';

interface CashbackProps {
  onNext: () => void;
  amount?: string;
}

export const Cashback = ({ onNext, amount = "1" }: CashbackProps) => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[800px] h-[500px] bg-black relative overflow-hidden flex items-center justify-center">
        <LocalPass
          layoutId={`amount-${amount}`}
          amount={amount}
          isExpanded={true}
          onClick={onNext}
        />
      </div>
    </div>
  );
}; 