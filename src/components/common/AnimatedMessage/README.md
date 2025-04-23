# AnimatedMessage

A reusable, animated message component for displaying prominent messages with optional animation. Supports both animated and static display, and can render rich content via children.

## Usage
```tsx
import AnimatedMessage from './AnimatedMessage';

// Animated (default)
<AnimatedMessage show>
  Thanks for<br />shopping local
</AnimatedMessage>

// Static (no animation)
<AnimatedMessage show animated={false}>
  Thanks for<br />shopping local
</AnimatedMessage>
```

## Props
- `show` (boolean, required): Whether the message is visible.
- `animated` (boolean, default: true): If false, renders as static text.
- `message` (string, optional): Simple message string (use `children` for rich content).
- `children` (ReactNode, optional): Rich content to display as the message.
- `className` (string, optional): Additional Tailwind classes for the wrapper.
- `duration` (number, optional): Reserved for future auto-hide support.

## Styling
- Uses large, bold, Cash App-inspired typography by default.
- Animates in/out with fade and slide when `animated` is true.

---

_Keep this README up to date with all changes!_ 