import React from 'react';

interface PillButtonProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

/**
 * PillButton
 *
 * A reusable pill-shaped button for navigation and actions.
 * - Normal: dark background, white text
 * - Hover: lighter background
 * - Active: white background, black text, bold
 * - Fully accessible
 */
const PillButton: React.FC<PillButtonProps> = ({
  children,
  active = false,
  onClick,
  className = '',
  ariaLabel
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`px-3 py-1.5 rounded-full text-xs font-medium border focus:outline-none antialiased
        ${active
          ? 'bg-white text-black font-semibold border-white/10 active:border-white/10'
          : 'border-white/10 bg-[#141414] hover:bg-[#232323] text-white/80 active:border-white/10'}
        ${className}`}
      tabIndex={0}
    >
      {children}
    </button>
  );
};

export default PillButton; 