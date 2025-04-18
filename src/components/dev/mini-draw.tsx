import React, { useState, useEffect } from 'react';
import avatarIcon from '../../assets/images/avatar.svg';

/**
 * MiniDrawButton
 *
 * A self-contained mini expanding drawer button for profile/user selection.
 * - Collapsed: Default 48x48px rounded rectangle (borderRadius: 50)
 * - Expanded: Default 260px wide, auto height, 16px padding, borderRadius: 16
 * - Icon always in fixed position
 * - Selectable rows with customizable appearance
 * - Configurable theme and animations
 * - Callback for row selection
 * - Optional backdrop blur effect
 */
interface MiniDrawButtonProps {
  rowLabels?: string[];                    // Labels for each row
  title?: string;                          // Title displayed in expanded state
  iconSrc?: string;                        // Custom icon source
  initialSelectedRow?: number;             // Initial selected row (1-based index)
  onRowSelect?: (rowIndex: number) => void;// Callback when row is selected
  theme?: {                                // Theme customization
    background?: string;                   // Background color
    border?: string;                       // Border color/style
    textColor?: string;                    // Default text color
    selectedBackground?: string;           // Selected row background
    selectedTextColor?: string;            // Selected row text color
    hoverTextColor?: string;               // Text color on hover
    backdropBlur?: boolean;                // Enable backdrop blur effect
    fillOpacity?: number;                  // Background fill opacity (0-100)
  };
  collapsedSize?: number;                  // Size of button when collapsed
  expandedWidth?: number;                  // Width of button when expanded
  initialState?: 'open' | 'closed';        // Initial state
  iconPosition?: 'left' | 'center';        // Icon position in collapsed state
  ariaLabel?: string;                      // Custom aria label
}

export const MiniDrawButton: React.FC<MiniDrawButtonProps> = ({
  rowLabels,
  title,
  iconSrc,
  initialSelectedRow = 1,
  onRowSelect,
  theme = {},
  collapsedSize = 48,
  expandedWidth = 226,
  initialState = 'closed',
  iconPosition = 'center',
  ariaLabel = 'Open mini drawer'
}) => {
  // Controls open/close state of the mini drawer
  const [open, setOpen] = useState(initialState === 'open');
  // Tracks which row is selected (1-based index)
  const [selectedRow, setSelectedRow] = useState(initialSelectedRow);

  // Apply theme with defaults
  const themeStyles = {
    background: theme.background || '#181818',
    border: theme.border || 'border border-white/10',
    textColor: theme.textColor || 'text-white/80',
    selectedBackground: theme.selectedBackground || 'bg-white',
    selectedTextColor: theme.selectedTextColor || 'text-black',
    hoverTextColor: theme.hoverTextColor || 'text-white',
    backdropBlur: theme.backdropBlur !== undefined ? theme.backdropBlur : true,
    fillOpacity: theme.fillOpacity !== undefined ? theme.fillOpacity : 100,
  };

  // Generate background style based on theme
  const getBackgroundClasses = () => {
    const classes = [];
    
    // Add fill color with opacity
    classes.push(`bg-[${themeStyles.background}]`);
    
    // Add backdrop blur if enabled
    if (themeStyles.backdropBlur) {
      classes.push('backdrop-blur-md');
    }
    
    // Add border
    classes.push(themeStyles.border);
    
    return classes.join(' ');
  };

  // Generate background style with opacity
  const getBackgroundStyle = () => {
    return {
      backgroundColor: themeStyles.background,
      backgroundOpacity: themeStyles.fillOpacity / 100,
    };
  };

  // Use provided rowLabels or default
  const labels = rowLabels || ['New customer', 'Returning customer', 'Cash Local customer'];

  // Call onRowSelect when selectedRow changes
  useEffect(() => {
    if (onRowSelect) {
      onRowSelect(selectedRow);
    }
  }, [selectedRow, onRowSelect]);

  // Handle row selection
  const handleRowSelect = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRow(index);
  };

  // Toggle open/close state
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen((v) => !v);
  };

  // Animate between collapsed and expanded states
  return (
    <button
      className={open
        ? `${getBackgroundClasses()} flex flex-col items-start overflow-hidden focus:outline-none relative z-[10001] w-[${expandedWidth}px] rounded-[16px] shadow-lg pt-3 pr-4 pb-4 pl-4`
        : `${getBackgroundClasses()} flex flex-col items-${iconPosition} justify-center overflow-hidden focus:outline-none relative z-[10001] w-[${collapsedSize}px] h-[${collapsedSize}px] rounded-full shadow-md p-3`}
      onClick={handleToggle}
      aria-label={ariaLabel}
      aria-expanded={open}
      style={{
        backgroundColor: `${themeStyles.background}${Math.round(themeStyles.fillOpacity).toString(16).padStart(2, '0')}`,
      }}
    >
      {/* Content container: flex column, fills width */}
      <div className={`flex flex-col w-full ${open ? 'items-start' : `items-${iconPosition} justify-center`}`}>
        {/* Icon: always in a fixed container, no extra margin or padding, wrapped in a padded div */}
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
        {/* Title below icon in expanded state */}
        {open && title && (
          <div className="mb-3 text-[24px] font-cash font-semibold text-white/90 text-left whitespace-nowrap pl-3 pt-0 pb-2">{title}</div>
        )}
        {/* Instantly remove rows on collapse to prevent warping */}
        {open && (
          <div className="flex flex-col w-full">
            {labels.map((label, i) => (
              <button
                key={i}
                onClick={(e) => handleRowSelect(i + 1, e)}
                className={`h-11 flex items-center px-3 min-w-[160px] text-left transition-all duration-150 text-[16px] font-cash font-medium
                  ${selectedRow === i + 1 
                    ? `${themeStyles.selectedBackground} ${themeStyles.selectedTextColor} rounded-[10px]` 
                    : `${themeStyles.textColor} hover:${themeStyles.hoverTextColor} rounded`
                  }`}
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