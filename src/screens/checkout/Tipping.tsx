import { BaseScreen } from '../../components/common/BaseScreen';
import LocalCashIcon from '../../assets/images/Local-Cash-32px.svg';

export const Tipping = ({ onNext }: { onNext: () => void }) => {
  return (
    <BaseScreen onNext={onNext}>
      <div className="w-[800px] h-[500px] bg-black text-white p-6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 px-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-white/15" />
            <h2 className="text-[24px] font-medium font-cash">Tip Alice?</h2>
          </div>
          <div className="px-6 py-3 bg-black border border-white/20 rounded-full flex items-center gap-2">
            <span className="text-[18px] font-medium font-cash">Local Cash</span>
            <img src={LocalCashIcon} alt="Local Cash" className="w-8 h-8" />
          </div>
        </div>

        {/* Tip Amount Buttons */}
        <div className="grid grid-cols-3 gap-3 flex-1 mb-3">
          {['1', '2', '3'].map((amount) => (
            <button
              key={amount}
              onClick={onNext}
              className="h-full bg-[#1189D6] rounded-2xl flex items-center justify-center text-[70px] font-medium font-cash active:bg-[#0E6EB0] transition-colors"
            >
              ${amount}
            </button>
          ))}
        </div>

        {/* Bottom Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-auto">
          {['Custom', 'No tip'].map((text) => (
            <button
              key={text}
              onClick={onNext}
              className="py-6 bg-white/15 rounded-2xl text-[32px] font-medium font-cash active:bg-white/20 transition-colors"
            >
              {text}
            </button>
          ))}
        </div>
      </div>
    </BaseScreen>
  );
}; 