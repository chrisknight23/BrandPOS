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

### Message Content
- Displays "Follow us and earn rewards" split across two lines
- Uses `dangerouslySetInnerHTML` with `<br/>` for consistent line breaks
- Counter-scaling applied to maintain original text size during card expansion
- Positioned absolutely within device frame (800x500px) for proper centering

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
- **NEW**: Appears on back face while logo remains visible on front
- Counter-scales to maintain readable text size during card expansion
- Displays "Follow us and earn rewards" message with proper line breaks

## Customization

- Modify text content by editing the component directly
- Adjust animation timing via `startDelay` prop
- Change brand name via `brandName` prop
- Add custom styling via `className` prop

## Changelog

- **v1.1**: Enhanced message display and positioning
  - Added proper line break handling with `dangerouslySetInnerHTML`
  - Improved counter-scaling for consistent text size
  - Better positioning within device frame coordinates
  - Coordinated with ScreensaverCard v2.1 front/back content separation
- **v1.0**: Initial messaging component for screensaver mode
  - Basic fade-in animations for promotional messages
  - Integration with ScreensaverCard expand phase

---

_Keep this README up to date with all changes!_ 