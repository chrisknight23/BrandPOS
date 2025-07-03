# ScreensaverMessaging

A text animation component designed to display messaging content inside the full-screen ScreensaverCard during screensaver mode.

## Description

This component handles all text animations that appear when the screensaver card is in its expanded (full-screen) state. It provides smooth fade-in animations for welcome messages and payment instructions.

## Usage

```tsx
import { ScreensaverMessaging } from '../ScreensaverMessaging';

<ScreensaverMessaging 
  isVisible={screensaverPhase === 'expand'}
  startDelay={500}
  brandName="$mileendbagel"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isVisible` | `boolean` | `false` | Whether the messaging should be visible |
| `startDelay` | `number` | `500` | Delay before starting animations (in milliseconds) |
| `brandName` | `string` | `'$mileendbagel'` | Brand name to display in messaging |
| `className` | `string` | `''` | Custom class name for the container |

## Animation Sequence

1. **Ready**: Component is hidden
2. **Fade In**: Main message fades in from bottom (0.8s duration)
3. **Secondary**: Secondary message fades in with 0.4s delay
4. **Visible**: All animations complete, content fully visible

## Styling

- Uses absolute positioning to fill the entire card
- Centers content both horizontally and vertically
- White text with opacity variations for hierarchy
- Responsive text sizes (text-4xl, text-xl, text-lg)

## Integration

Designed to work seamlessly with ScreensaverCard:
- Triggered when card reaches 'expand' phase
- Positioned within the card's coordinate system
- Respects the card's background and styling

## Customization

- Modify text content by editing the component directly
- Adjust animation timing via `startDelay` prop
- Change brand name via `brandName` prop
- Add custom styling via `className` prop

---

_Keep this README up to date with all changes!_ 