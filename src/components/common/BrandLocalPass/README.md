# BrandLocalPass Component

A brand-themed card component that displays rewards amounts with interactive animations for Cash App brand partnerships. This component is based on LocalPass but includes brand-specific customizations and theming options.

## Features

- **Brand Customization**: Supports brand colors, logos, and custom text
- **Interactive Card States**: Supports expanded, initial, and dropped states
- **Smooth Animations**: Uses Framer Motion for fluid transitions between states
- **Lottie Integration**: Displays custom animations based on card state
- **Number Animations**: Animated dollar amounts with proper formatting
- **QR Code Integration**: Back side displays a brand-specific QR code
- **3D Card Flipping**: Interactive card flip animation with front/back faces

## Props

All LocalPass props are supported, plus the following brand-specific props:

- `brandName`: string — Name of the brand to display (default: 'Brand')
- `brandLogo`: string | ReactNode — URL to the brand's logo or a React component
- `brandColor`: string — Main brand color (CSS or Tailwind) (default: 'bg-[#FF5722]')
- `brandAccentColor`: string — Secondary brand color for the card back
- `brandSubtext`: string — Description text below the amount (default: 'Rewards earned on purchases')

### Standard Props

- `initialState`: `'initial' | 'expanded' | 'dropped'` — Starting state of the card
- `backgroundColor`: string — Card's background color (overridden by brandColor if provided)
- `backfaceColor`: string — Background color for the back of the card
- `lottieAnimation`: any — Lottie animation data (JSON)
- `initialValue`: number — Initial numeric value to display
- `useRandomValues`: boolean — Generate random values after animations
- `randomMin`: number — Minimum value for random generation
- `randomMax`: number — Maximum value for random generation
- `buttonText`: string — Custom button text (default: 'Redeem')
- `onButtonClick`: (e) => void — Handler for button clicks
- `onStateChange`: (newState) => void — Handler when card state changes
- `onFlip`: (isFlipped) => void — Handler when card is flipped
- `onAnimationComplete`: () => void — Handler when animation completes
- `frontContent`: ReactNode — Custom content for the front of the card
- `backContent`: ReactNode — Custom content for the back of the card
- `autoPlay`: boolean — Play animations automatically on mount
- `className`: string — Custom class name for the card container
- `animationDelay`: number — Delay (ms) before starting animations
- `showButton`: boolean — Show or hide the button in the card footer (default: true)
- `showHeader`: boolean — Show or hide the header with brand info (default: true)
- `sessionId`: string — Session ID for QR code generation

## Usage

**Basic Usage:**
```tsx
<BrandLocalPass
  brandName="Nike"
  brandColor="bg-[#FF5722]"
  amount="25.50"
  isExpanded={false}
  onClick={() => handleClick()}
/>
```

**Enhanced Usage:**
```tsx
<BrandLocalPass
  initialState="expanded"
  brandName="Starbucks"
  brandColor="bg-[#006241]"
  brandAccentColor="bg-[#1E3932]"
  brandSubtext="Rewards on every purchase"
  buttonText="Redeem"
  initialValue={25.75}
  lottieAnimation={myLottieData}
  onButtonClick={() => console.log('Button clicked')}
  onStateChange={(state) => console.log('State changed:', state)}
  sessionId="user-session-123"
/>
```

**With Custom Brand Logo:**
```tsx
<BrandLocalPass
  brandName="Apple"
  brandColor="bg-[#000000]"
  brandLogo={<AppleIcon className="h-6 w-6 text-white" />}
  initialValue={50}
  buttonText="Use Rewards"
/>
```

## Card States

- **Initial**: Default compact card showing brand name and amount
- **Expanded**: Full-size card with additional details and button
- **Dropped**: Smaller minimized version for UI transitions

## QR Code Integration

The back of the card features a QR code that can be used to:
1. Link to the brand's Cash App profile
2. Redeem rewards from the specific brand
3. Track sessions when used with the sessionId prop

When flipped, the QR code is animated in using the same animation patterns available in AnimatedQRCode. 