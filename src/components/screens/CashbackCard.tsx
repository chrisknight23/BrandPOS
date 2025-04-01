import { useEffect } from 'react';
import { CardFlip } from '../common/CardFlip';

interface CashbackCardProps {
  onNext: () => void;
}

export const CashbackCard = ({ onNext }: CashbackCardProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onNext();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onNext]);

  const frontContent = (
    <div className="w-full h-full bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Cash Back</h2>
      <div className="text-5xl font-bold text-green-600">$5</div>
      <p className="mt-4 text-gray-500 text-center">Tap to view QR code</p>
    </div>
  );

  const backContent = (
    <div className="w-full h-full bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center">
      <div className="w-48 h-48 bg-gray-100 rounded-2xl flex items-center justify-center">
        <span className="text-gray-500">QR Code</span>
      </div>
      <p className="mt-4 text-gray-500 text-center">Scan to complete</p>
    </div>
  );

  return (
    <div className="flex items-center justify-center w-full h-full bg-gray-50">
      <div className="w-80 h-96">
        <CardFlip
          front={frontContent}
          back={backContent}
          onFlip={() => {
            // Auto-progress after flip
            setTimeout(onNext, 2000);
          }}
        />
      </div>
    </div>
  );
}; 