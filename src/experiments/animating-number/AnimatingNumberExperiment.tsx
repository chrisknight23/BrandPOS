import { useState, useEffect } from 'react';
import { AnimatedNumber } from '../../components/common/AnimatedNumber';
import { motion, AnimatePresence } from 'framer-motion';

type NumberFormat = 'whole' | 'hundreds' | 'thousands' | 'no-numbers' | 'text' | 'mixed';

const FORMAT_OPTIONS: Record<NumberFormat, string> = {
  'whole': 'Whole Numbers',
  'hundreds': 'Hundreds',
  'thousands': 'Thousands',
  'no-numbers': 'No Numbers',
  'text': 'Text Content',
  'mixed': 'Number + Text'
};

// Predefined text options to cycle through
const TEXT_OPTIONS = ['FREE', 'SALE', 'NEW', 'HOT', 'DEAL'];

// Predefined suffix text options for mixed format
const SUFFIX_OPTIONS = ['OFF', 'BONUS', 'CASH BACK', 'CREDIT', 'REWARD'];

export const AnimatingNumberExperiment = () => {
  const [value, setValue] = useState(0);
  const [format, setFormat] = useState<NumberFormat>('whole');
  const [isOpen, setIsOpen] = useState(false);
  const [showDecimals, setShowDecimals] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [suffixIndex, setSuffixIndex] = useState(0);

  // Ensure initial state reflects the showDecimals toggle
  useEffect(() => {
    // Force a re-render when the showDecimals value changes
    // This ensures the AnimatedNumber updates properly
    setValue(prev => {
      // If the value is exactly 0, we want to "nudge" it to trigger a re-render
      return prev === 0 ? 0.00001 : prev;
    });
    
    // Reset to 0 after a small delay to allow the animation to show
    const timer = setTimeout(() => {
      setValue(0);
    }, 50);
    
    return () => clearTimeout(timer);
  }, [showDecimals]);

  const getDisplayValue = (val: number) => {
    switch (format) {
      case 'hundreds':
        return val * 100;
      case 'thousands':
        return val * 1000;
      default:
        return val;
    }
  };

  // Generate a random number that respects the current format
  const generateRandomNumberForFormat = () => {
    let randomValue: number;
    
    switch (format) {
      case 'whole':
        // Generate a number between 0 and 99 with two decimal places
        randomValue = Math.round((Math.random() * 99) * 100) / 100;
        break;
      case 'hundreds':
        // Generate a multiple of 100 between 100 and 900 with two decimal places
        randomValue = Math.round(((Math.floor(Math.random() * 9) + 1) + Math.random()) * 100) / 100;
        break;
      case 'thousands':
        // Generate a multiple of 1000 between 1000 and 9000 with two decimal places
        randomValue = Math.round(((Math.floor(Math.random() * 9) + 1) + Math.random()) * 100) / 100;
        break;
      case 'no-numbers':
      case 'text':
        // Set to 0 for showOnlyDollarSign mode or text mode
        randomValue = 0;
        // For text mode, cycle to the next text option
        if (format === 'text') {
          setTextIndex(prev => (prev + 1) % TEXT_OPTIONS.length);
        }
        break;
      case 'mixed':
        // Generate a small number between 1 and 25 for mixed format
        randomValue = Math.floor(Math.random() * 25) + 1;
        // Cycle to the next suffix option
        setSuffixIndex(prev => (prev + 1) % SUFFIX_OPTIONS.length);
        break;
      default:
        randomValue = Math.round((Math.random() * 99) * 100) / 100;
    }
    
    return randomValue;
  };

  return (
    <div className="w-screen h-screen bg-[#001707] flex items-center justify-center">
      {/* Left controls */}
      <div className="fixed top-4 left-4 flex gap-2 z-50">
        {/* Random/Refresh button */}
        <button
          className="w-12 h-12 rounded-full text-white transition-colors bg-[#00D64F] hover:bg-[#00C048] flex items-center justify-center"
          onClick={() => setValue(generateRandomNumberForFormat())}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
          </svg>
        </button>

        {/* Increment/Decrement buttons */}
        <div className="flex gap-2">
          <button
            className="w-12 h-12 rounded-full text-white transition-colors bg-[#00D64F] hover:bg-[#00C048] flex items-center justify-center"
            onClick={() => setValue(prev => prev - 1)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
            </svg>
          </button>
          <button
            className="w-12 h-12 rounded-full text-white transition-colors bg-[#00D64F] hover:bg-[#00C048] flex items-center justify-center"
            onClick={() => setValue(prev => prev + 1)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
          </button>
        </div>

        {/* Reset button */}
        <button
          className="w-12 h-12 rounded-full text-white transition-colors bg-[#00D64F] hover:bg-[#00C048] flex items-center justify-center"
          onClick={() => setValue(0)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18" />
            <path d="M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Top navigation container with just the format selector - moved away from the right edge */}
      <div className="fixed top-4 right-12">
        {/* Format selector dropdown */}
        <div className="relative">
          <button
            className="px-6 py-3 rounded-full text-[#00D64F] transition-colors bg-white/10 hover:bg-white/15 flex items-center gap-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {FORMAT_OPTIONS[format]}
            <svg 
              width="10" 
              height="6" 
              viewBox="0 0 10 6" 
              fill="none"
              className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
            >
              <path d="M1 1L5 5L9 1" stroke="#00D64F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full right-0 mt-2 bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden min-w-full"
              >
                {Object.entries(FORMAT_OPTIONS).map(([key, label]) => (
                  <button
                    key={key}
                    className={`w-full px-6 py-3 text-left transition-colors hover:bg-white/5 ${
                      format === key ? 'text-[#00D64F]' : 'text-white'
                    }`}
                    onClick={() => {
                      setFormat(key as NumberFormat);
                      setIsOpen(false);
                    }}
                  >
                    {label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Show Decimals Checkbox - at bottom right as requested */}
      <div className="fixed bottom-4 right-4 z-40">
        <label className="flex items-center gap-2 px-6 py-3 rounded-full text-[#00D64F] transition-colors bg-white/10 hover:bg-white/15 cursor-pointer">
          <input
            type="checkbox"
            checked={showDecimals}
            onChange={() => setShowDecimals(!showDecimals)}
            className="w-4 h-4 accent-[#00D64F]"
          />
          Show Decimals
        </label>
      </div>

      {/* AnimatedNumber display */}
      <div className="text-white text-8xl">
        <AnimatedNumber 
          value={getDisplayValue(value)} 
          showDollarSign 
          showDecimals={showDecimals}
          showFormattedZero={true}  // Always use formatted zero to ensure 0.00 displays properly
          showOnlyDollarSign={format === 'no-numbers'}
          className="text-[100px]"
          textContent={format === 'text' ? TEXT_OPTIONS[textIndex] : undefined}
          suffixText={format === 'mixed' ? SUFFIX_OPTIONS[suffixIndex] : undefined}
        />
      </div>
    </div>
  );
}; 