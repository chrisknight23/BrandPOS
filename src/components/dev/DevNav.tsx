interface DevNavProps {
  onBack: () => void;
  onRefresh: () => void;
  onNext: () => void;
}

export const DevNav = ({ onBack, onRefresh, onNext }: DevNavProps) => {
  return (
    <div className="fixed top-4 left-4 flex gap-2 z-50">
      <button
        className="px-4 py-2 rounded-full text-white bg-white/10 hover:bg-white/15 transition-colors"
        onClick={onBack}
      >
        Back
      </button>
      <button
        className="px-4 py-2 rounded-full text-white bg-white/10 hover:bg-white/15 transition-colors"
        onClick={onRefresh}
      >
        Refresh
      </button>
      <button
        className="px-4 py-2 rounded-full text-white bg-white/10 hover:bg-white/15 transition-colors"
        onClick={onNext}
      >
        Next
      </button>
    </div>
  );
}; 