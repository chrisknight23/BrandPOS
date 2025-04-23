# ScreenNavigation

A reusable, accessible bottom navigation bar for switching between screens. Uses the PillButton component for each navigation item. Designed for POS and multi-screen flows.

## Usage
```tsx
import ScreenNavigation, { ScreenNavItem } from './ScreenNavigation';

const screens: ScreenNavItem[] = [
  { label: 'Home', value: 'Home' },
  { label: 'Cart', value: 'Cart' },
  { label: 'Payment', value: 'Payment' },
  // ...
];

<ScreenNavigation
  screens={screens}
  currentScreen={currentScreen}
  onScreenSelect={setCurrentScreen}
/>
```

## Props
- `screens` (`ScreenNavItem[]`, required): Array of `{ label, value }` for each screen.
- `currentScreen` (`string`, required): The currently active screen value.
- `onScreenSelect` (`(screen: string) => void`, required): Callback when a screen is selected.
- `className` (`string`, optional): Additional Tailwind classes for the nav container.

## Features
- Uses PillButton for consistent, accessible pill navigation.
- Keyboard and screen reader accessible.
- Easily composable for any screen flow.

---

_Keep this README up to date with all changes!_ 