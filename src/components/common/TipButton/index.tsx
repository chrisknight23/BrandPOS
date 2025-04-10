import { motion } from 'framer-motion';

interface TipButtonProps {
  amount: string;
  layoutId: string;
  onClick?: () => void;
  isSelected?: boolean;
  // Animation props can be passed from parent
  animate?: any;
  initial?: any;
  transition?: any;
}

export const TipButton = ({ 
  amount, 
  layoutId, 
  onClick, 
  isSelected,
  // Allow parent to control animations
  animate,
  initial,
  transition: customTransition,
}: TipButtonProps) => {
  // Button tap animation only applies to non-selected state
  const buttonTapAnimation = !isSelected ? {
    whileTap: { scale: 0.90 },
    // Use a faster transition for tap interactions
    transition: {
      scale: {
        type: "spring",
        stiffness: 200,
        damping: 25
      }
    }
  } : {};

  // Default transition settings if not provided by parent
  const defaultTransition = {
    // Use layout: true for smoother layout transitions
    layout: true,
    backgroundColor: {
      type: "tween",
      duration: 0.3
    },
    // Add default duration to ensure consistent timing
    duration: 0.3
  };

  // Merge default transitions with any custom ones from parent
  const transition = customTransition || defaultTransition;

  return (
    <motion.div
      // Entry and expansion animation configuration
      // The layoutId enables continuous transitions between normal and selected states
      layoutId={layoutId}
      onClick={onClick}
      // Background color animation between normal blue and selected green
      animate={{
        backgroundColor: isSelected ? '#00B843' : '#1189D6',
        ...(animate || {}) // Allow parent to provide additional animations
      }}
      // Allow parent to provide initial state
      initial={initial || { backgroundColor: '#1189D6' }}
      className={`
        flex items-center justify-center cursor-pointer rounded-2xl
        ${isSelected ? 'z-50' : 'relative h-full w-full'}
      `}
      // Style changes when selected to fill the device frame
      style={isSelected ? {
        width: '800px',
        height: '500px',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 'auto',
        padding: 0
      } : undefined}
      // Transition configurations
      transition={transition}
      // Apply tap animation for non-selected state
      {...buttonTapAnimation}
    >
      {/* Content wrapper to stabilize position */}
      <motion.div
        className="flex items-center justify-center"
        // This ensures the position stays consistent during animations
        layout
        layoutId={`${layoutId}-content-wrapper`}
        // Match parent transition timing
        transition={transition}
      >
        {/* Text content with its own animation configuration */}
        <motion.span 
          className="text-white font-medium font-cash"
          // Use consistent text sizing with the same font metrics
          style={{
            fontSize: isSelected ? '120px' : '70px',
            lineHeight: 1,
            // Prevent text from shifting during animation
            display: 'block',
            transform: 'translateZ(0)'
          }}
          // This ensures text size and position animates smoothly with parent
          layoutId={`${layoutId}-text`}
          // Coordinated layout transition for text size changes
          transition={transition}
        >
          ${amount}
        </motion.span>
      </motion.div>
    </motion.div>
  );
};

export default TipButton;