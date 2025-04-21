# LocalPass Component

An enhanced card component that displays amounts with interactive animations for Cash App. This component supports advanced physics-based animations, Lottie integration, and extensive customization options, while maintaining backward compatibility with the original LocalPass interface.

## Features

- **Interactive Card States**: Supports expanded, initial, and dropped states
- **Smooth Animations**: Uses Framer Motion for fluid transitions between states
- **Lottie Integration**: Displays custom animations based on card state
- **Number Animations**: Animated dollar amounts with proper formatting
- **Customizable**: Colors, text, content, and more
- **Backward Compatible**: Works with legacy props and usage

## Props

- `initialState`: `'initial' | 'expanded' | 'dropped'` — Starting state of the card
- `backgroundColor`: string — Card's background color (CSS or Tailwind)
- `backfaceColor`: string — Background color for the back of the card
- `lottieAnimation`: any — Lottie animation data (JSON)
- `initialValue`: number — Initial numeric value to display
- `useRandomValues`: boolean — Generate random values after animations
- `randomMin`: number — Minimum value for random generation
- `randomMax`: number — Maximum value for random generation
- `headerText`: string — Custom header text
- `subheaderText`: string — Custom subheader text
- `buttonText`: string — Custom button text
- `onButtonClick`: (e) => void — Handler for button clicks
- `onStateChange`: (newState) => void — Handler when card state changes
- `onFlip`: (isFlipped) => void — Handler when card is flipped
- `onAnimationComplete`: () => void — Handler when animation completes
- `frontContent`: ReactNode — Custom content for the front of the card
- `backContent`: ReactNode — Custom content for the back of the card
- `autoPlay`: boolean — Play animations automatically on mount
- `className`: string — Custom class name for the card container
- `animationDelay`: number — Delay (ms) before starting animations
- `layoutId`: string — Unique ID for Framer Motion layout animations
- `amount`: string — Amount to display (legacy/compatibility)
- `isExpanded`: boolean — Whether the card is expanded (legacy/compatibility)
- `onClick`: () => void — Handler for card click (legacy/compatibility)
- `children`: ReactNode — Optional content in expanded state (legacy/compatibility)
- `noAnimation`: boolean — Disable all animations
- `textAmount`: string — Text to display instead of a numeric amount
- `suffixText`: string — Text to display after the numeric amount
- `showButton`: boolean — Show or hide the button in the card footer (default: true)

## Usage

**Basic (Legacy) Usage:**
```tsx
<LocalPass
  layoutId="amount-1"
  amount="25.50"
  isExpanded={false}
  onClick={() => handleClick()}
/>
```

**Enhanced Usage:**
```tsx
<LocalPass
  initialState="expanded"
  backgroundColor="bg-[#00B843]"
  headerText="Local Cash"
  subheaderText="Earned on tips"
  buttonText="Collect"
  lottieAnimation={myLottieData}
  initialValue={25.75}
  useRandomValues={true}
  randomMin={10}
  randomMax={50}
  onButtonClick={() => console.log('Button clicked')}
  onStateChange={(state) => console.log('State changed:', state)}
  onAnimationComplete={() => console.log('Animation complete')}
  suffixText="Back"
  showButton={false}
/>
```

## Enhanced Features

- Fluid state transitions with physics-based animations
- Interactive elements that respond to state changes
- Custom button text, header, and subheader options
- Support for card flipping and 3D transforms
- Lottie animation support for rich visual feedback 