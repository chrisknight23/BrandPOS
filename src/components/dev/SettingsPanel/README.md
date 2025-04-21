# SettingsPanel Component

A developer and debugging drawer for the POS app, providing quick access to app state, analytics, feature flags, and test actions. The SettingsPanel is designed for rapid prototyping, QA, and developer workflows.

---

## Features

- **Screen Navigation**: Jump between app screens for testing
- **Cart Management**: Add, remove, or clear items in the cart
- **Analytics**: View current amounts, tip, and navigation state
- **Feature Flags**: Toggle experimental features and UI options
- **Simulate Actions**: Trigger flows like QR scan, cash out, etc.
- **Profile Switching**: Change user type for scenario testing
- **Responsive Drawer**: Collapsible, with tabbed navigation

---

## Usage

```tsx
import SettingsPanel from './SettingsPanel';

<SettingsPanel
  isOpen={isPanelOpen}
  onPanelToggle={setIsPanelOpen}
  currentScreen={currentScreen}
  baseAmount={baseAmount}
  tipAmount={tipAmount}
  cartItems={cartItems}
  onAddItem={handleAddItem}
  onClearCart={handleClearCart}
  onRemoveCartItem={handleRemoveCartItem}
  onBack={handleBack}
  onNext={handleNext}
  onRefresh={handleRefresh}
  onReset={handleReset}
/>
```

---

## Main Props

- `isOpen`: boolean — Whether the panel is open
- `onPanelToggle`: (open: boolean) => void — Open/close handler
- `currentScreen`: string — The current app screen
- `baseAmount`: string | null — Main transaction amount
- `tipAmount`: string | null — Tip amount
- `cartItems`: array — Cart items for the current session
- `onAddItem`, `onClearCart`, `onRemoveCartItem`: Cart management handlers
- `onBack`, `onNext`, `onRefresh`, `onReset`: Navigation and utility handlers
- `simulateScan`: () => void — Triggers a scan simulation (e.g., flips the LocalPass card in Cashout)

---

## Tabs & Views

- **Interaction**: Cart, add/clear items, simulate flows
- **Analytics**: View amounts, debug info
- **APIs**: API integration and test hooks
- **Research**: AI/Neuronet and experimental features
- **Settings**: Feature flags and toggles

---

## Best Practices

- Use in development and QA environments
- Keep the panel open for rapid state changes
- Use feature flags to test new UI/UX
- Simulate user flows for end-to-end testing

---

_Keep this README up to date with new tabs, features, or major changes!_ 