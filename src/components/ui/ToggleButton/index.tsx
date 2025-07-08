import React from 'react';
import { motion } from 'framer-motion';

export interface ToggleButtonProps {
  /** Currently selected option index (0 or 1) */
  selectedIndex: number;
  /** Click handler with option index */
  onToggle: (index: number) => void;
  /** Array of two icons to display */
  icons: [React.ReactNode, React.ReactNode];
  /** Optional className for styling */
  className?: string;
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  selectedIndex,
  onToggle,
  icons,
  className = ''
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* Oval container with stroke */}
      <div className="rounded-full border border-white/20 bg-black relative" style={{ width: '72px', height: '132px' }}>
        
        {/* Animated white circle selector */}
        <motion.div
          className="absolute bg-white rounded-full shadow-lg shadow-white/20"
          style={{
            width: '60px',
            height: '60px',
            left: '50%',
            top: '6px',
            marginLeft: '-30px'
          }}
          animate={{
            y: selectedIndex === 0 ? 0 : 60
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
            mass: 0.8,
            velocity: 2
          }}
        />

        {/* Top icon (option 0) */}
        <button
          onClick={() => onToggle(0)}
          className="absolute rounded-full flex items-center justify-center z-10"
          style={{
            top: '6px',
            left: '50%',
            marginLeft: '-30px',
            width: '60px',
            height: '60px'
          }}
        >
          <div className={`
            transition-all duration-300 flex items-center justify-center
            ${selectedIndex === 0 
              ? '' 
              : 'opacity-70 brightness-0 invert'
            }
          `}>
            {icons[0]}
          </div>
        </button>

        {/* Bottom icon (option 1) */}
        <button
          onClick={() => onToggle(1)}
          className="absolute rounded-full flex items-center justify-center z-10"
          style={{
            top: '66px',
            left: '50%',
            marginLeft: '-30px',
            width: '60px',
            height: '60px'
          }}
        >
          <div className={`
            transition-all duration-300 flex items-center justify-center
            ${selectedIndex === 1 
              ? '' 
              : 'opacity-70 brightness-0 invert'
            }
          `}>
            {icons[1]}
          </div>
        </button>
      </div>
    </div>
  );
}; 