import React, { useState, useMemo } from 'react';
import avatarIcon from '../../assets/images/avatar.svg';

/**
 * MiniDrawButton
 *
 * A self-contained mini expanding drawer button for profile/user selection.
 * - Collapsed: 48x48px rounded rectangle (borderRadius: 50)
 * - Expanded: 260px wide, auto height, 16px padding, borderRadius: 16
 * - Avatar icon always top left
 * - Three selectable rows below (only selected row has background/ring)
 * - Smooth animation between states using Framer Motion
 */
interface MiniDrawButtonProps {
  rowLabels?: string[];
  title?: string;
  iconSrc?: string; // optional custom icon source
}

export const MiniDrawButton: React.FC<MiniDrawButtonProps> = ({ rowLabels, title, iconSrc }) => {
  // Controls open/close state of the mini drawer
  const [open, setOpen] = useState(false);
  // Tracks which row is selected (1-based index)
  const [selectedRow, setSelectedRow] = useState(1);

  // Use provided rowLabels or default
  const labels = rowLabels || ['New customer', 'Returning customer', 'Cash Local customer'];

  // Animate between collapsed and expanded states
  return (
    <button
      className={open
        ? "bg-[#181818] border border-white/10 flex flex-col items-start overflow-hidden focus:outline-none relative z-[10001] w-[226px] rounded-[16px] shadow-lg pt-3 pr-4 pb-4 pl-4"
        : "bg-[#181818] border border-white/10 flex flex-col items-center justify-center overflow-hidden focus:outline-none relative z-[10001] w-[48px] h-[48px] rounded-full shadow-md p-3"}
      onClick={e => {
        e.stopPropagation();
        setOpen((v) => !v);
      }}
      aria-label="Open mini drawer"
    >
      {/* Content container: flex column, fills width */}
      <div className={`flex flex-col w-full ${open ? 'items-start' : 'items-center justify-center'}`}>
        {/* Avatar icon: always in a fixed 24x24px container, no extra margin or padding, wrapped in a padded div */}
        <div className="p-3">
          <div className="w-6 h-6">
            <img
              src={iconSrc || avatarIcon}
              alt={title ? `${title} icon` : 'Drawer icon'}
              className=""
              style={{ display: 'block' }}
            />
          </div>
        </div>
        {/* Title below avatar in expanded state */}
        {open && title && (
          <div className="mb-3 text-[24px] font-cash font-semibold text-white/90 text-left whitespace-nowrap pl-3 pt-0 pb-2">{title}</div>
        )}
        {/* Instantly remove rows on collapse to prevent warping */}
        {open && (
          <div className="flex flex-col w-full">
            {labels.map((label, i) => (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); setSelectedRow(i + 1); }}
                className={`h-11 flex items-center px-3 min-w-[160px] text-left transition-all duration-150 text-[16px] font-cash font-medium
                  ${selectedRow === i + 1 ? 'bg-white text-black rounded-[10px]' : 'text-white/80 hover:text-white rounded'}
                `}
                style={{ background: selectedRow === i + 1 ? undefined : 'transparent' }}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}; 