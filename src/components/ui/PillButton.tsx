import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DropdownItem {
  label: string;
  value: string;
}

interface PillButtonProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
  // Dropdown props
  hasDropdown?: boolean;
  dropdownItems?: DropdownItem[];
  onDropdownSelect?: (value: string) => void;
  currentDropdownValue?: string;
}

/**
 * PillButton
 *
 * A reusable pill-shaped button for navigation and actions.
 * - Normal: dark background, white text
 * - Hover: lighter background
 * - Active: white background, black text, bold
 * - Dropdown: Shows chevron when active and hasDropdown=true
 * - Fully accessible
 */
const PillButton: React.FC<PillButtonProps> = ({
  children,
  active = false,
  onClick,
  className = '',
  ariaLabel,
  hasDropdown = false,
  dropdownItems = [],
  onDropdownSelect,
  currentDropdownValue
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleButtonClick = () => {
    if (hasDropdown && active) {
      // If it's a dropdown pill and it's active, only toggle dropdown (no navigation)
      setIsDropdownOpen(!isDropdownOpen);
    } else {
      // Normal button behavior (navigate when not active)
      onClick?.();
    }
  };

  const handleDropdownItemClick = (value: string) => {
    onDropdownSelect?.(value);
    // Don't close dropdown when navigating between screensaver screens
    // setIsDropdownOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={handleButtonClick}
        aria-label={ariaLabel}
        aria-expanded={hasDropdown ? isDropdownOpen : undefined}
        aria-haspopup={hasDropdown ? "menu" : undefined}
        className={`pill-button px-3 py-1.5 rounded-full text-xs font-medium border focus:outline-none antialiased flex items-center gap-1
          ${active
            ? 'bg-white text-black font-semibold border-white/10 active:border-white/10'
            : 'border-white/10 bg-[#141414] hover:bg-[#232323] text-white/80 active:border-white/10'}
          ${className}`}
        tabIndex={0}
      >
        <span>{children}</span>
        {hasDropdown && active && (
          <motion.svg
            width="8"
            height="8"
            viewBox="0 0 8 8"
            fill="none"
            className="ml-1"
            animate={{ rotate: isDropdownOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path
              d="M2 3L4 5L6 3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        )}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {hasDropdown && isDropdownOpen && dropdownItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ 
              type: 'spring', 
              stiffness: 400, 
              damping: 32,
              opacity: { duration: 0.15 }
            }}
            className="absolute bottom-full mb-4 -left-2 w-32 bg-[#181818]/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg z-50 p-3"
            role="menu"
          >
            {dropdownItems.map((item) => (
              <button
                key={item.value}
                onClick={() => handleDropdownItemClick(item.value)}
                className={`w-full text-left px-3 py-2 text-sm font-cash font-medium transition-all duration-150 whitespace-nowrap
                  ${currentDropdownValue === item.value 
                    ? 'bg-white text-black rounded-[10px]' 
                    : 'text-white/80 hover:text-white rounded'
                  }`}
                role="menuitem"
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PillButton; 