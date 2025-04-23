# MainView

The MainView component is the root container for the POS buyer display application. It manages the overall screen flow, navigation, environment switching, and state for the checkout experience. MainView coordinates all major UI regions, including the device frame, settings panel, navigation, and contextual menus.

## Description
- Handles screen transitions and state for the entire app
- Integrates with environment and user type contexts
- Renders the main content area, settings panel, device/environment/user menus, and bottom navigation
- Supports dynamic navigation and environment-based UI changes

## Usage
```tsx
import MainView from './MainView';

<MainView />
```

## Structure
- **Device/Environment Menus:** Top-left, for device and environment selection
- **Settings Panel:** Right side, collapsible, for developer and app settings
- **User Profile Menu:** Top-right, for user/customer type selection
- **Main Content Area:** Centered, displays the current screen (e.g., Home, Cart, Payment, etc.)
- **Bottom Navigation:** Pills for screen navigation, using ScreenNavigation and PillButton

## State & Context
- `currentScreen`: The active screen (e.g., 'Home', 'Cart', ...)
- `cartItems`, `baseAmount`, `tipAmount`: Checkout state
- `isPanelOpen`, `isPaused`: UI state for settings panel and timers
- **Contexts:**
  - `useUserType`: For user/customer type
  - `useEnvironment`: For environment (POS, Cash App, Cash Web)

## Navigation
- Uses `ScreenNavigation` for bottom nav pills
- Navigation pills are dynamically generated based on user type and environment
- Handles direct, next, and back navigation between screens

## Environment Integration
- Device and environment can be switched via DropMenus
- MainView responds to environment changes and can update navigation/screens accordingly

## Changelog
- 2024-07-XX: Refactored to use ScreenNavigation and PillButton
- 2024-07-XX: Environment context and dynamic nav support added
- 2024-07-XX: Initial version

---

_Keep this README up to date with all changes!_ 