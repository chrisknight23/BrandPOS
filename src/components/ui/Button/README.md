# Button Component

A comprehensive, scalable button component following design system principles. Built with extensibility in mind to support future variants, sizes, and states.

## Overview

The Button component provides a consistent interface for all button interactions in the application. It supports multiple visual variants, sizes, and states while maintaining accessibility and animation capabilities.

## Usage

```tsx
import { Button } from '@/components/ui/Button';

// Basic usage (uses default green color)
<Button>Click me</Button>

// Primary button with custom color
<Button variant="primary" size="large" color="#1189D6">
  Continue
</Button>

// Secondary button (color doesn't affect secondary)
<Button variant="secondary" size="medium">
  Cancel
</Button>

// Tertiary button with colored border
<Button variant="tertiary" size="medium" color="#FF6B35">
  Learn More
</Button>

// Animated button
<Button variant="primary" color="#00B843" animated>
  Tap me
</Button>

// Full width button
<Button variant="primary" color="#9B59B6" fullWidth>
  Full Width Button
</Button>

// Disabled button
<Button variant="primary" color="#00B843" disabled>
  Disabled
</Button>

// Dynamic colors
<Button variant="primary" color="#00B843">Cash App Green</Button>
<Button variant="primary" color="#1189D6">Cash App Blue</Button>
<Button variant="primary" color="#FF6B35">Custom Orange</Button>
```

## Variants

### Primary
- **Use case**: Main call-to-action buttons
- **Style**: Solid colored background (dynamic), white text
- **Color**: Uses `color` prop or defaults to Cash App Green (`#00B843`)
- **States**: Hover (10% darker), Active (20% darker), Disabled (50% opacity)

### Secondary  
- **Use case**: Secondary actions, cancel buttons
- **Style**: Semi-transparent white background, white text
- **Color**: Always uses white/transparent (not affected by `color` prop)
- **States**: Hover (10% opacity), Active (15% opacity), Disabled (reduced opacity)

### Tertiary
- **Use case**: Subtle actions, "Learn More" links
- **Style**: Transparent background with colored border, white text
- **Color**: Uses `color` prop for border color or defaults to Cash App Green
- **States**: Hover (5% background), Active (10% background), Disabled (reduced opacity)

## Sizes

### Large
- **Height**: 56px (h-14)
- **Padding**: 32px horizontal, 16px vertical
- **Text**: 18px (text-lg)
- **Min Width**: 160px
- **Use case**: Primary actions, prominent buttons

### Medium (Default)
- **Height**: 48px (h-12)
- **Padding**: 24px horizontal, 12px vertical
- **Text**: 16px (text-base)
- **Min Width**: 120px
- **Use case**: Standard interactions, most common size

### Small (Coming Soon)
- **Height**: 32px (h-8)
- **Padding**: 16px horizontal, 8px vertical
- **Text**: 14px (text-sm)
- **Min Width**: 80px
- **Use case**: Inline actions, compact interfaces

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'tertiary'` | `'primary'` | Visual style variant |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Button size |
| `state` | `'default' \| 'loading' \| 'disabled'` | `'default'` | Button state (for future expansion) |
| `animated` | `boolean` | `false` | Enable framer-motion animations |
| `loading` | `boolean` | `false` | Show loading state (displays "Loading...") |
| `fullWidth` | `boolean` | `false` | Make button full width |
| `disabled` | `boolean` | `false` | Disable button interactions |
| `icon` | `React.ReactNode` | - | Icon to display before text (future) |
| `iconRight` | `React.ReactNode` | - | Icon to display after text (future) |
| `className` | `string` | `''` | Additional CSS classes |
| `children` | `React.ReactNode` | - | Button content (required) |
| `color` | `string` | `'#00B843'` | Primary color (hex format) for primary/tertiary variants |
| `colors` | `object` | - | Advanced color overrides for all states |

## Design System Tokens

### Colors
- **Primary**: `#00B843` (Cash App Green)
- **Primary Hover**: `#00A33C`
- **Primary Active**: `#008F35`
- **Secondary**: `white/5` (5% white opacity)
- **Tertiary Border**: `white/20` (20% white opacity)

### Typography
- **Font Family**: Cash Sans
- **Font Weight**: Medium (500)
- **Anti-aliasing**: Enabled

### Spacing
- **Border Radius**: Full rounded (`rounded-full`)
- **Focus Ring**: 2px with appropriate colors
- **Transition**: 200ms ease-out

## Animation

When `animated={true}` is passed, the button uses framer-motion for smooth interactions:

- **Hover**: Scale to 1.02
- **Tap**: Scale to 0.95
- **Rest**: Scale to 1.0
- **Transition**: Spring animation (stiffness: 300, damping: 20)

## Accessibility

- **Focus Management**: Proper focus rings with high contrast
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA attributes and semantic HTML
- **Disabled States**: Proper disabled styling and cursor changes

## Best Practices

### Do's
- Use `primary` for main call-to-action buttons
- Use `secondary` for cancel or alternative actions
- Use `tertiary` for subtle actions or links
- Use `large` size for prominent actions
- Use `animated` for interactive feedback in key flows

### Don'ts
- Don't use multiple primary buttons in the same view
- Don't use `large` size for secondary actions
- Don't override core design tokens without design approval
- Don't use custom colors outside the design system

## Future Enhancements

### Planned Features
- **Small Size**: Compact button for inline actions
- **Loading States**: Spinner animation during async operations
- **Icon Support**: Built-in icon positioning and spacing
- **Additional Variants**: Success, warning, danger variants
- **Custom Animations**: More animation options

### Extensibility
The component is built with extensibility in mind:
- Easy to add new variants in `BUTTON_VARIANTS`
- Simple to add new sizes in `BUTTON_SIZES`
- State management ready for loading/error states
- Icon slots prepared for future implementation

## Migration from Old Button

If migrating from the old button component:

```tsx
// Old
<Button variant="primary" className="flex-1">Continue</Button>

// New
<Button variant="primary" fullWidth>Continue</Button>
```

## Examples

### Common Patterns

```tsx
// Dialog buttons
<div className="flex gap-3">
  <Button variant="secondary" size="medium">
    Cancel
  </Button>
  <Button variant="primary" size="medium">
    Confirm
  </Button>
</div>

// Loading state
<Button variant="primary" loading>
  Processing...
</Button>

// Animated interaction
<Button variant="primary" animated size="large">
  Tap to Pay
</Button>
```

---

_Keep this README up to date with all changes!_ 