import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import avatarIcon from "../../../assets/images/avatar.svg";

/**
 * DropMenu
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
interface DropMenuProps {
  rowLabels: string[];                     // Labels for each row (required)
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

// Add constants for fixed heights
const ROW_HEIGHT = 44; // h-11
const ICON_HEIGHT = 48; // px (p-3 + w-6 h-6)
const TITLE_HEIGHT = 52; // px (set title height to 52)
const PADDING_VERTICAL = 28; // pt-3 (12) + pb-4 (16)

export const DropMenu: React.FC<DropMenuProps> = ({
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
  ariaLabel = 'Open drop menu'
}) => {
  // Controls open/close state of the mini drawer
  const [open, setOpen] = useState(initialState === 'open');
  // Use 0-based indexing for selectedRow
  const [selectedRow, setSelectedRow] = useState(() => {
    // Convert initialSelectedRow (1-based) to 0-based, clamp to valid range
    const idx = Math.max(0, Math.min((initialSelectedRow ?? 1) - 1, rowLabels.length - 1));
    return idx;
  });
  const [height, setHeight] = useState<number | 'auto'>(collapsedSize);
  const prevOpen = useRef(open);
  const [iconOpacity, setIconOpacity] = useState(1);
  const collapseTimeout = useRef<NodeJS.Timeout | null>(null);

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
  const labels = rowLabels;

  // Auto-correct selectedRow if rowLabels changes
  useEffect(() => {
    if (selectedRow >= rowLabels.length) {
      setSelectedRow(rowLabels.length - 1);
    }
  }, [rowLabels.length]);

  useEffect(() => {
    if (onRowSelect) {
      onRowSelect(selectedRow); // Pass 0-based index (or selectedRow + 1 for 1-based)
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
    if (!open) {
      setTimeout(() => setOpen(true), 50); // 50ms delay before opening
    } else {
      setOpen(false);
    }
  };

  // Calculate expanded height
  const getExpandedHeight = () => {
    let h = 0;
    h += ICON_HEIGHT;
    if (title) {
      h += TITLE_HEIGHT;
    }
    h += rowLabels.length * ROW_HEIGHT;
    h += PADDING_VERTICAL;
    return h;
  };

  // Animate open/close with calculated height
  useEffect(() => {
    if (open !== prevOpen.current) {
      if (open) {
        setHeight(getExpandedHeight());
      } else {
        setHeight(collapsedSize);
      }
      prevOpen.current = open;
    }
  }, [open, rowLabels.length, title, collapsedSize]);

  useEffect(() => {
    if (!open) {
      // Instantly fade out
      setIconOpacity(0);
      // Fade back in after a short delay
      collapseTimeout.current = setTimeout(() => setIconOpacity(1), 150);
    } else {
      // Instantly show on expand
      setIconOpacity(1);
      if (collapseTimeout.current) {
        clearTimeout(collapseTimeout.current);
      }
    }
    return () => {
      if (collapseTimeout.current) {
        clearTimeout(collapseTimeout.current);
      }
    };
  }, [open]);

  // Animate between collapsed and expanded states
  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={handleToggle}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleToggle(e as any); }}
      aria-label={ariaLabel}
      aria-expanded={open}
      className={
        `${getBackgroundClasses()} flex overflow-hidden focus:outline-none relative z-[10001] shadow-lg` +
        (open
          ? ' flex-col items-start'
          : ' items-center justify-center')
      }
      initial={false}
      animate={{
        width: open ? expandedWidth : collapsedSize,
        height: height,
        borderRadius: open ? 16 : collapsedSize / 2,
        opacity: 1,
        paddingTop: open ? 24 : 12,
        paddingRight: open ? 16 : 12,
        paddingBottom: open ? 16 : 12,
        paddingLeft: open ? 16 : 12
      }}
      layout={false}
      transition={{
        width: { type: 'spring', stiffness: 400, damping: 32 },
        height: { type: 'spring', stiffness: 400, damping: 32 },
        borderRadius: { type: 'spring', stiffness: 400, damping: 32 },
        opacity: { duration: 0.18 },
        paddingTop: { duration: 0.22 },
        paddingRight: { duration: 0.22 },
        paddingBottom: { duration: 0.22 },
        paddingLeft: { duration: 0.22 }
      }}
      style={{
        backgroundColor: `${themeStyles.background}${Math.round(themeStyles.fillOpacity).toString(16).padStart(2, '0')}`,
        minWidth: collapsedSize,
        minHeight: collapsedSize
      }}
    >
      {/* Icon: always visible, opacity animated */}
      <motion.div
        animate={{ opacity: iconOpacity }}
        transition={{ opacity: iconOpacity === 1 ? { duration: 0.15, delay: 0.15 } : { duration: 0 } }}
        className={`flex items-center ${open ? 'justify-start pl-3 pb-2' : 'justify-center'}`}
        style={{ width: '100%' }}
      >
        <div className="w-6 h-6">
          <img
            src={iconSrc || avatarIcon}
            alt={title ? `${title} icon` : 'Drawer icon'}
            style={{ display: 'block', width: 24, height: 24 }}
          />
        </div>
      </motion.div>
      {/* Animated content: title + rows */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="dropmenu-content"
            className="flex flex-col w-full items-start"
            layout={false}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0 } }}
            transition={{ opacity: { duration: 0.15, delay: 0.15 } }}
            style={{ overflow: 'hidden' }}
          >
            {/* Title and rows in same wrapper */}
            {title && (
              <motion.div
                animate={{
                  paddingLeft: open ? 12 : 0,
                  paddingTop: 0
                }}
                transition={{
                  paddingLeft: { duration: 0.22 }
                }}
                className="text-[24px] font-cash font-semibold text-white/90 text-left whitespace-nowrap"
                style={{ height: TITLE_HEIGHT }}
              >
                {title}
              </motion.div>
            )}
            <div className="flex flex-col w-full">
              {labels.map((label, i) => (
                <button
                  key={`${label}-${i}`}
                  onClick={(e) => handleRowSelect(i, e)}
                  className={`h-11 w-full flex items-center min-w-[160px] text-left transition-all duration-150 text-[16px] font-cash font-medium
                    ${selectedRow === i 
                      ? `${themeStyles.selectedBackground} ${themeStyles.selectedTextColor} rounded-[10px]` 
                      : `${themeStyles.textColor} hover:${themeStyles.hoverTextColor} rounded`
                    }`}
                  style={{
                    background: selectedRow === i ? undefined : 'transparent',
                    paddingLeft: open ? 12 : 0,
                    paddingRight: open ? 12 : 0
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}; 