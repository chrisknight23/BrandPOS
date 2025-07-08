import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

// Base button variants
type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

// Button sizes
type ButtonSize = 'small' | 'medium' | 'large';

// Button states (for future expansion)
type ButtonState = 'default' | 'loading' | 'disabled';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  /**
   * Visual style variant of the button
   * - primary: Solid colored background, white text
   * - secondary: Semi-transparent white background, white text
   * - tertiary: Transparent background with colored border, white text
   */
  variant?: ButtonVariant;
  
  /**
   * Size of the button
   * - small: Compact size for inline actions (coming soon)
   * - medium: Standard size for most interactions
   * - large: Prominent size for primary actions
   */
  size?: ButtonSize;
  
  /**
   * Current state of the button (for future expansion)
   * - default: Normal interactive state
   * - loading: Shows loading indicator (coming soon)
   * - disabled: Non-interactive state
   */
  state?: ButtonState;
  
  /**
   * Enable motion animations (uses framer-motion)
   */
  animated?: boolean;
  
  /**
   * Custom className for additional styling
   */
  className?: string;
  
  /**
   * Button content
   */
  children: React.ReactNode;
  
  /**
   * Loading state (will show spinner when implemented)
   */
  loading?: boolean;
  
  /**
   * Full width button
   */
  fullWidth?: boolean;
  
  /**
   * Icon to display before text (for future expansion)
   */
  icon?: React.ReactNode;
  
  /**
   * Icon to display after text (for future expansion)
   */
  iconRight?: React.ReactNode;
  
  /**
   * Primary color for the button (hex format)
   * Used for primary variant background and tertiary variant border
   * @example "#00B843" | "#1189D6" | "#FF6B35"
   */
  color?: string;
  
  /**
   * Override colors for advanced customization
   */
  colors?: {
    background?: string;
    backgroundHover?: string;
    backgroundActive?: string;
    border?: string;
    borderHover?: string;
    borderActive?: string;
    text?: string;
    textHover?: string;
    textActive?: string;
  };
}

// Design system tokens - base classes without colors
const BUTTON_VARIANTS = {
  primary: {
    base: 'text-white border-transparent',
    hover: '', // No hover states for touch interface
    active: '', // Will be set dynamically
    focus: '', // No focus ring for touch interface
    disabled: 'disabled:cursor-not-allowed'
  },
  secondary: {
    base: 'bg-white/5 text-white border-transparent',
    hover: '', // No hover states for touch interface
    active: 'active:bg-white/15',
    focus: '', // No focus ring for touch interface
    disabled: 'disabled:bg-white/3 disabled:text-white/50 disabled:cursor-not-allowed'
  },
  tertiary: {
    base: 'bg-transparent text-white border',
    hover: '', // No hover states for touch interface
    active: 'active:bg-white/10', // Will add dynamic border active
    focus: '', // No focus ring for touch interface
    disabled: 'disabled:text-white/50 disabled:cursor-not-allowed'
  }
} as const;

// Default colors (Cash App green)
const DEFAULT_COLOR = '#00B843';

// Helper function to generate hover/active colors
const generateColorVariants = (baseColor: string) => {
  // Simple color darkening for hover/active states
  // In a real app, you might want to use a proper color manipulation library
  const hex = baseColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Darken by 10% for hover, 20% for active
  const darken = (value: number, percent: number) => 
    Math.max(0, Math.floor(value * (1 - percent / 100)));
  
  const hoverColor = `#${darken(r, 10).toString(16).padStart(2, '0')}${darken(g, 10).toString(16).padStart(2, '0')}${darken(b, 10).toString(16).padStart(2, '0')}`;
  const activeColor = `#${darken(r, 20).toString(16).padStart(2, '0')}${darken(g, 20).toString(16).padStart(2, '0')}${darken(b, 20).toString(16).padStart(2, '0')}`;
  
  return { hoverColor, activeColor };
};

const BUTTON_SIZES = {
  small: {
    padding: 'px-4 py-2',
    text: 'text-sm',
    height: 'h-8',
    minWidth: 'min-w-[80px]'
  },
  medium: {
    padding: 'px-6 py-3',
    text: 'text-lg',
    height: 'h-14',
    minWidth: 'min-w-[120px]'
  },
  large: {
    padding: 'px-8 py-4',
    text: 'text-2xl',
    height: 'h-14',
    minWidth: 'min-w-[160px]'
  }
} as const;

// Animation variants for framer-motion
const buttonAnimationVariants = {
  tap: { scale: 0.95 },
  rest: { scale: 1 }
};

/**
 * Button Component
 * 
 * A comprehensive button component following design system principles.
 * Supports multiple variants, sizes, and states with consistent styling.
 * 
 * @example
 * ```tsx
 * // Primary button (most common)
 * <Button variant="primary" size="large">
 *   Continue
 * </Button>
 * 
 * // Secondary button
 * <Button variant="secondary" size="medium">
 *   Cancel
 * </Button>
 * 
 * // Tertiary button with stroke
 * <Button variant="tertiary" size="medium">
 *   Learn More
 * </Button>
 * 
 * // Animated button
 * <Button variant="primary" animated>
 *   Tap me
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      state = 'default',
      animated = false,
      className = '',
      children,
      loading = false,
      fullWidth = false,
      icon,
      iconRight,
      disabled,
      color = DEFAULT_COLOR,
      colors,
      ...props
    },
    ref
  ) => {
    // Determine if button should be disabled
    const isDisabled = disabled || loading || state === 'disabled';
    
    // Build dynamic styles based on variant and color
    const dynamicStyles: React.CSSProperties = {};
    
    if (variant === 'primary') {
      dynamicStyles.backgroundColor = colors?.background || color;
    } else if (variant === 'tertiary') {
      dynamicStyles.borderColor = colors?.border || color;
    }
    
    // Build className string
    const variantStyles = BUTTON_VARIANTS[variant];
    const sizeStyles = BUTTON_SIZES[size];
    
    const buttonClassName = [
      // Base styles
      'inline-flex items-center justify-center',
      'rounded-full',
      'font-medium font-cash antialiased',
      'transition-all duration-200 ease-out',
      'focus:outline-none',
      'select-none',
      
      // Variant styles
      variantStyles.base,
      variantStyles.hover,
      variantStyles.active,
      variantStyles.focus,
      variantStyles.disabled,
      
      // Size styles
      sizeStyles.padding,
      sizeStyles.text,
      sizeStyles.height,
      sizeStyles.minWidth,
      
      // Width
      fullWidth ? 'w-full' : 'w-auto',
      
      // Custom className
      className
    ].filter(Boolean).join(' ');

    // Button content with icon support
    const buttonContent = (
      <>
        {icon && (
          <span className="mr-2 flex-shrink-0">
            {icon}
          </span>
        )}
        <span className="flex-1 text-center">
          {loading ? 'Loading...' : children}
        </span>
        {iconRight && (
          <span className="ml-2 flex-shrink-0">
            {iconRight}
          </span>
        )}
      </>
    );

    // Separate the motion-specific props from HTML button props
    const {
      // Remove motion-specific props that conflict with HTML button
      onDrag,
      onDragEnd,
      onDragStart,
      onAnimationStart,
      onAnimationEnd,
      onAnimationIteration,
      ...htmlButtonProps
    } = props;

    // Animated button using framer-motion
    if (animated) {
      return (
        <motion.button
          ref={ref}
          className={buttonClassName}
          style={dynamicStyles}
          disabled={isDisabled}
          variants={buttonAnimationVariants}
          initial="rest"
          whileTap={!isDisabled ? "tap" : "rest"}
          animate="rest"
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20
          }}
          {...htmlButtonProps}
        >
          {buttonContent}
        </motion.button>
      );
    }

    // Standard button
    return (
      <button
        ref={ref}
        className={buttonClassName}
        style={dynamicStyles}
        disabled={isDisabled}
        {...htmlButtonProps}
      >
        {buttonContent}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Export types for external use
export type { ButtonProps, ButtonVariant, ButtonSize, ButtonState }; 