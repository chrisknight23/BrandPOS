import { BaseScreen } from '../../components/common/BaseScreen/index';

export const Home = ({ onNext }: { onNext: () => void }) => {
  return (
    <BaseScreen onNext={onNext}>
      <div className="w-[800px] h-[500px] bg-black text-white flex items-center justify-center rounded-[8px] border border-[#222]">
        <h1 className="text-4xl font-cash">Welcome to Square POS</h1>
      </div>
    </BaseScreen>
  );
}; 