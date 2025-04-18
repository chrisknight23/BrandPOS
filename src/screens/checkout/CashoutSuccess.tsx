import { BaseScreen } from '../../components/common/BaseScreen';
import { LocalPass } from '../../components/common/LocalPass';

interface CashoutSuccessProps {
  amount?: string;
  onComplete?: () => void;
}

export const CashoutSuccess = ({ amount = '3', onComplete }: CashoutSuccessProps) => {
  return (
    <BaseScreen onNext={onComplete}>
      <div className="w-[800px] h-[500px] bg-black flex items-center justify-center relative overflow-hidden rounded-2xl">
        <LocalPass initialState="initial" />
      </div>
    </BaseScreen>
  );
};

export default CashoutSuccess; 