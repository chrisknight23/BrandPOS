import { BaseScreen } from '../../components/common/BaseScreen';
import { LocalPass } from '../../components/common/LocalPass';
import { useState } from 'react';

interface CashoutProps {
  amount?: string;
  onComplete?: () => void;
  onSimulateScan?: (handler: () => void) => void; // Parent can register a handler to trigger scan
}

export const Cashout = ({ amount = '3', onComplete, onSimulateScan }: CashoutProps) => {
  const [flipped, setFlipped] = useState(true); // start on back

  // Register the scan handler with the parent
  if (onSimulateScan) {
    onSimulateScan(() => setFlipped(false));
  }

  return (
    <BaseScreen onNext={onComplete}>
      <div className="w-[800px] h-[500px] bg-black flex items-center justify-center relative overflow-hidden rounded-[16px] border border-[#222]">
        <LocalPass initialState="initial" showButton={false} showHeader={false} initialFlipped={true} flipped={flipped} />
      </div>
    </BaseScreen>
  );
};

export default Cashout; 