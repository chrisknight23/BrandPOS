# AnimatedQRCode

A customizable, animated QR code component for React. Supports various animation patterns, color customization, and optional logo overlays. Designed for use in payment, authentication, and interactive UI flows.

## Features
- Animated QR code reveal with multiple patterns
- Customizable colors, size, and animation speed
- Optional logo overlay in the center
- Supports error correction levels
- Callback for animation completion

## Usage
```tsx
import { AnimatedQRCode } from './AnimatedQRCode';

<AnimatedQRCode
  value="https://cash.app/your-link"
  size={260}
  autoAnimate={true}
  pattern="outside-in"
  speed={1}
  darkColor="#00B843"
  lightColor="transparent"
  placeholderOpacity={0.3}
  logo="cash-icon"
  errorCorrection="M"
  className="max-h-[260px] overflow-hidden"
  onAnimationComplete={() => console.log('QR animation complete')}
/>
```

## Props
| Prop                | Type                                      | Default         | Description                                                      |
|---------------------|-------------------------------------------|-----------------|------------------------------------------------------------------|
| `value`             | `string`                                  | **(required)**  | The value to encode in the QR code (URL, text, etc.)             |
| `size`              | `number`                                  | `300`           | Size of the QR code container (pixels, square)                   |
| `autoAnimate`       | `boolean`                                 | `true`          | Whether to play the animation automatically                      |
| `pattern`           | `'random' \| 'inside-out' \| 'outside-in' \| 'wave' \| 'sequential'` | `'outside-in'`   | Animation pattern for QR dots                                    |
| `speed`             | `number`                                  | `1`             | Animation speed (1 = normal, 2 = twice as fast, etc.)            |
| `darkColor`         | `string`                                  | `#00B843`       | Color for the QR code dots                                       |
| `lightColor`        | `string`                                  | `'transparent'` | Background color for the QR code                                 |
| `placeholderOpacity`| `number`                                  | `0.3`           | Opacity for placeholder dots before animation                    |
| `onAnimationComplete`| `() => void`                             |                 | Callback when the QR animation completes                         |
| `logo`              | `string \| React.ReactNode`               |                 | Optional logo to display in the center of the QR code            |
| `errorCorrection`   | `'L' \| 'M' \| 'Q' \| 'H'`                | `'M'`           | QR code error correction level                                   |
| `className`         | `string`                                  |                 | Optional class name for the container                            |

## Customization
- **Animation Patterns:** Choose from `random`, `inside-out`, `outside-in`, `wave`, or `sequential` for different reveal effects.
- **Colors:** Use `darkColor` and `lightColor` to match your brand or UI theme.
- **Logo:** Pass a string (for a built-in logo) or a React node for a custom center logo.
- **Animation Control:** Set `autoAnimate` to `false` to require user interaction to start the animation.

## Changelog
- 2024-06-10: Initial documentation

---
_Keep this README up to date with all changes!_ 