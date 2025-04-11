# LocalPass Component

An enhanced card component that displays amounts with interactive animations for Cash App. This component wraps the PhysicsCard component while maintaining backward compatibility with the original LocalPass interface.

## Features

- **Interactive Card States**: Supports expanded, initial, and dropped states
- **Smooth Animations**: Uses Framer Motion for fluid transitions between states
- **Lottie Integration**: Displays custom animations based on card state
- **Number Animations**: Animated dollar amounts with proper formatting
- **Customizable**: Can be customized with different colors, text, and content

## Props

- `layoutId`: string - Unique ID for Framer Motion layout animations
- `amount`: string - The dollar amount to display
- `isExpanded`: boolean - Whether the card is in expanded state
- `onClick`: () => void - Click handler for the card
- `children`: ReactNode - Optional content to display in the card
- `noAnimation`: boolean - Option to disable animations
- `lottieAnimation`: any - Custom Lottie animation data

## Usage

```tsx
<LocalPass
  layoutId="amount-1"
  amount="25.50"
  isExpanded={false}
  onClick={() => handleClick()}
/>
```

## Enhanced Features

This version of LocalPass extends the original with:

- Fluid state transitions with physics-based animations
- Interactive elements that respond to state changes
- Custom button text and header options
- Support for card flipping and 3D transforms 