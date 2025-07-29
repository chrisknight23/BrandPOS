# PWASettingsDrawer

A minimal settings drawer specifically for PWA mode that provides access to content version selection.

## Purpose

Provides a focused, native-feeling way to change content versions in PWA mode without exposing development UI.

## Features

- Edge swipe gesture to reveal (swipe from right edge)
- Spring animations for native feel
- Focused UI with only content version controls
- Haptic feedback on gesture completion
- Backdrop blur for modern aesthetic

## Usage

```tsx
import { PWASettingsDrawer } from './common/PWASettingsDrawer';

// In PWA mode only
{isPWAMode() && (
  <PWASettingsDrawer
    isOpen={isPanelOpen}
    onClose={() => setIsPanelOpen(false)}
  />
)}
```

## Props

### `isOpen` (boolean)
Whether the drawer is currently open.

### `onClose` (function)
Callback to close the drawer.

## Gesture Details

- Activates within 20px of right edge
- Requires 80px swipe distance
- Provides haptic feedback
- Animates with spring physics

## Best Practices

1. Only use in PWA mode
2. Keep UI minimal and focused
3. Use with edge gesture for native feel
4. Maintain clear separation from dev UI 