# useEdgeGesture Hook

A custom React hook for detecting edge swipe gestures in PWA mode. This hook is specifically designed to enable a native-feeling edge swipe interaction for revealing the settings panel in PWA mode.

## Purpose

Provides a way to detect right-edge swipe gestures in PWA mode only, enabling a native-feeling interaction pattern for revealing panels. This hook is a no-op in browser mode, maintaining clear separation between PWA and browser interactions.

## Usage

```tsx
import { useEdgeGesture } from '../hooks/useEdgeGesture';

const { isGestureActive } = useEdgeGesture({
  onGestureComplete: () => {
    // Handle gesture completion
    setSettingsPanelOpen(true);
  },
  threshold: 100 // pixels from edge to trigger
});
```

## Features

- **PWA-Only**: Only activates in PWA mode, no-op in browser
- **Edge Detection**: Accurately detects touches starting from right edge
- **Haptic Feedback**: Provides vibration feedback when gesture completes
- **Configurable**: Adjustable threshold for gesture activation
- **Type-Safe**: Full TypeScript support
- **Cleanup**: Proper event listener management

## Options

### `onGestureComplete` (function, optional)
Callback fired when swipe gesture meets threshold criteria.

### `threshold` (number, default: 100)
Distance in pixels that must be swiped to trigger the gesture.

## Return Values

### `isGestureActive` (boolean)
Whether a gesture is currently in progress.

## Implementation Details

- Uses touch events for gesture detection
- Only activates for touches starting within 20px of right edge
- Provides haptic feedback via vibration API
- Cleans up event listeners on unmount
- Maintains PWA-only functionality

## Integration with SettingsPanel

The hook is designed to work with the SettingsPanel component to:
1. Enable edge swipe to reveal in PWA mode
2. Maintain standard button interaction in browser mode
3. Provide a native-feeling interaction pattern

## Best Practices

1. Only use for edge-based interactions
2. Maintain clear PWA vs browser separation
3. Provide visual feedback during gesture
4. Consider device orientation changes
5. Handle cleanup properly 