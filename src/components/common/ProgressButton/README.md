# ProgressButton

A reusable, animated button component with a draining progress bar. Useful for actions that require a visual countdown or progress indicator, such as receipts, confirmations, or timed actions.

## Usage
```tsx
import ProgressButton from './ProgressButton';

<ProgressButton
  label="Get receipt"
  progress={progress} // 0 to 1
  onClick={handleClick}
  show={true} // fades in when true
  paused={isPaused} // freezes progress bar when true
/>
```

## Props
- `label` (string | ReactNode, required): The button text or content.
- `progress` (number, required): Progress value from 0 (full) to 1 (empty).
- `onClick` (function, optional): Click handler for the button.
- `show` (boolean, default: true): If true, the button fades in; if false, it fades out.
- `paused` (boolean, optional): If true, the progress bar freezes at its current value (no animation).
- `className` (string, optional): Additional Tailwind classes for the button container.
- `onFadeInComplete` (function, optional): Called after the fade-in animation completes. Useful for sequencing logic (e.g., starting a progress timer only after the button is fully visible).

## Features
- Fades in/out with Framer Motion when `show` changes.
- Progress bar drains from left to right as `progress` increases, unless `paused` is true.
- Large, bold, Cash App-inspired typography for the label.
- Fully accessible (role, tabIndex, aria-label).
- Animation Sequencing

You can use the `onFadeInComplete` prop to trigger logic (such as starting a timer or progress bar) only after the button has fully faded in. For example:

```tsx
<ProgressButton
  label="Get receipt"
  progress={progress}
  onClick={handleClick}
  show={show}
  paused={isPaused}
  onFadeInComplete={handleFadeInComplete} // Start progress after fade-in
/>
```

---

_Keep this README up to date with all changes!_ 