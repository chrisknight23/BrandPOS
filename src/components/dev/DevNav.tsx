import { logNavigation } from '../../utils/debug';
import { SCREEN_ORDER } from '../../constants/screens';

interface DevNavProps {
  onBack: () => void;
  onRefresh: () => void;
  onNext: () => void;
  resetToHome?: () => void;
}

export const DevNav = ({ onBack, onRefresh, onNext, resetToHome }: DevNavProps) => {
  // Wrap callbacks to add logging
  const handleBack = () => {
    logNavigation('DevNav', 'Back button clicked');
    onBack();
  };

  const handleRefresh = () => {
    logNavigation('DevNav', 'Refresh button clicked');
    onRefresh();
  };

  const handleNext = () => {
    logNavigation('DevNav', 'Next button clicked');
    try {
      onNext();
    } catch (error) {
      console.error('Error in DevNav Next button:', error);
    }
  };

  // Create a more visible style for easier testing
  return (
    <div className="fixed top-4 left-4 flex gap-2 z-[9999] pointer-events-auto">
      <button
        className="px-4 py-2 rounded-full text-white bg-white/20 hover:bg-white/30 transition-colors"
        onClick={handleBack}
      >
        Back
      </button>
      <button
        className="px-4 py-2 rounded-full text-white bg-white/20 hover:bg-white/30 transition-colors"
        onClick={handleRefresh}
      >
        Refresh
      </button>
      <button
        className="px-4 py-2 rounded-full text-white bg-white/20 hover:bg-white/30 transition-colors"
        onClick={handleNext}
      >
        Next
      </button>
    </div>
  );
}; 