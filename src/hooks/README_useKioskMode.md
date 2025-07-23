# useKioskMode Hook

A custom React hook for managing kiosk mode functionality with long press gesture detection.

## Purpose

Enables a "kiosk mode" or "presentation mode" that hides development UI elements (navigation, settings panels, etc.) to provide a clean, production-like experience on touch devices like iPads.

## Usage

```tsx
import { useKioskMode } from '../hooks/useKioskMode';

const { isKioskMode, toggleKioskMode, setKioskMode } = useKioskMode({
  longPressDuration: 3000, // 3 second long press
  excludeElements: [
    '.settings-panel',
    '.drop-menu', 
    '.pill-button',
    'button',
    '[role="button"]'
  ]
});

// Conditionally render UI elements
{!isKioskMode && (
  <SettingsPanel />
)}
```

## Features

- **Long Press Detection**: 3-second long press anywhere on screen toggles kiosk mode
- **Element Exclusion**: Specific elements can be excluded from triggering long press
- **Touch & Mouse Support**: Works with both touch devices and mouse interactions
- **Haptic Feedback**: Provides vibration on supported devices when toggled
- **Automatic Cleanup**: Properly manages event listeners and timers

## Options

### `longPressDuration` (number, default: 3000)
Duration in milliseconds for long press detection.

### `excludeElements` (string[], default: see below)
CSS selectors for elements that should NOT trigger kiosk mode toggle:
- `.settings-panel`
- `.drop-menu` 
- `.pill-button`
- `button`
- `[role="button"]`

## Return Values

### `isKioskMode` (boolean)
Current kiosk mode state.

### `toggleKioskMode` (function)
Manually toggle kiosk mode on/off.

### `setKioskMode` (function)
Directly set kiosk mode state (true/false).

## Implementation Details

- Uses `touchstart`/`mousedown` for long press detection
- Prevents default context menus on long press
- Cleans up timers and event listeners on unmount
- Supports both touch and mouse interactions

## Integration with MainView

The hook is integrated into `MainView.tsx` to hide:
- Settings panel (development tools)
- Top navigation dropdowns (Device/Customer)
- Bottom screen navigation
- Adjusts layout when panel would normally be open

## CSS Classes

Components should include appropriate CSS classes for exclusion:
- `.settings-panel` - Settings/development panel
- `.drop-menu` - Dropdown menus
- `.pill-button` - Navigation pills
- `.screen-navigation` - Bottom navigation

## Touch Device Optimization

- Designed primarily for iPad touch interactions
- Provides visual feedback (kiosk mode indicator)
- Uses backdrop blur and modern iOS-style UI elements
- Responsive to viewport changes and orientation

---

*Keep this README up to date with all changes!* 