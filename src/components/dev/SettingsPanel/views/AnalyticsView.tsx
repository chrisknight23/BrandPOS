import React from 'react';

const AnalyticsView: React.FC<{
  currentScreen?: string;
  baseAmount?: string | null;
  tipAmount?: string | null;
  onBack?: () => void;
  onNext?: () => void;
  onRefresh?: () => void;
  onReset?: () => void;
}> = ({ currentScreen = '', baseAmount = null, tipAmount = null, onBack, onNext, onRefresh, onReset }) => {
  const totalAmount = baseAmount && tipAmount
    ? (parseFloat(baseAmount) + parseFloat(tipAmount)).toFixed(2)
    : baseAmount || '';

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header title and sub copy */}
      <div className="pb-1">
        <h2 className="text-white text-[24px] font-cash font-semibold mb-2">
          Analytics
        </h2>
        <div className="relative">
          <p className="text-white/60 text-sm line-clamp-3">
            View app analytics, debug information, and navigation state. Use this tab to inspect the current screen, amounts, and other technical details for troubleshooting and QA.
          </p>
        </div>
      </div>
      <div className="flex-1" />
      <button
        className="w-full rounded-full py-4 flex items-center justify-center bg-white/5 hover:bg-white/10 active:bg-white/15 transition-colors text-white font-medium mt-auto"
      >
        View all
      </button>
    </div>
  );
};

export default AnalyticsView; 