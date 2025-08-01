# Project Notes

## Screen Transitions and Animations

### Important: All New Screens Must Be Added to INSTANT_SCREENS

When creating new screens, ALWAYS add them to the `INSTANT_SCREENS` array in `MainView.tsx`:

```typescript
// In src/components/MainView.tsx
const INSTANT_SCREENS = [
  'Home',
  'Follow',
  'Screensaver',
  // ... other screens ...
  'YourNewScreen'  // <-- Add your new screen here
];
```

**Why This Is Critical:**
- Screens NOT in this array will trigger a full interface animation
- This causes undesired effects like duplicated navigation and UI elements
- All screens should default to instant transitions unless explicitly needed otherwise

### Screen Transition Rules:
1. **Default Behavior**: All screens should use instant transitions by default
2. **Grouped Screens**: Screens that are part of a group (like Payment/Auth, Tipping/CustomTip) must ALWAYS be instant
3. **Navigation Groups**: When adding screens to navigation groups (dropdowns), ensure all screens in the group are in INSTANT_SCREENS
4. **Custom Transitions**: If a screen needs custom transitions, this should be handled within the screen component itself, not through the main navigation system

### Common Issues This Prevents:
- Duplicated navigation bars
- Full interface sliding animations
- Multiple instances of the same screen
- Broken navigation between grouped screens

### When Adding New Screens:
1. Add the screen to `types/screen.ts`
2. Add it to `INSTANT_SCREENS` in `MainView.tsx`
3. Add it to `SCREEN_ORDER` in `constants/screens.ts`
4. If it's part of a group, add it to the appropriate group constant (e.g., `PAYMENT_SCREENS`, `TIPPING_SCREENS`)

## Removing QR Scan Polling & Session ID Changes (for future reference)

If you need to remove the QR scan polling and sessionId logic (or want to upgrade to WebSockets later), follow this plan:

### 1. Remove the Polling Hook Usage in MainView
- **File:** `src/components/MainView.tsx`
- **What to remove:**
  - The import:
    ```tsx
    import { useQRCodeScanStatus } from '../hooks/useQRCodeScanStatus';
    ```
  - The `sessionId` generation with `useMemo`.
  - The line:
    ```tsx
    const scanned = useQRCodeScanStatus(sessionId);
    ```
  - The `useEffect` that listens for `scanned` and navigates to `'End'`.
  - The `sessionId` prop passed to `getScreenProps` (for `Cashback`).

### 2. Remove the Polling Hook File
- **File:** `src/hooks/useQRCodeScanStatus.ts`
- **What to do:**
  - Delete this file entirely.

### 3. Remove the `sessionId` Prop from Any Child Components
- **File(s):**
  - `src/screens/checkout/Cashback.tsx` (or wherever you pass `sessionId` to the QR code)
  - `src/components/common/LocalPass/index.tsx` (if you added logic to use `sessionId` for the QR code value)
- **What to do:**
  - Remove the `sessionId` prop and any logic that uses it for the QR code value.
  - Restore the QR code value to its previous logic (e.g., just using `amount`).

### 4. (Optional) Remove the Express Server for Scan Status
- **File:** `server.js` (if you only used it for this feature)
- **What to do:**
  - Delete or comment out this file if not needed for other features.

---

### Summary Table

| File/Location                                 | What to Remove/Restore                                  |
|-----------------------------------------------|---------------------------------------------------------|
| `src/components/MainView.tsx`                 | All sessionId and polling hook logic                    |
| `src/hooks/useQRCodeScanStatus.ts`            | Delete the file                                         |
| `src/screens/checkout/Cashback.tsx`           | Remove sessionId prop/logic for QR code                 |
| `src/components/common/LocalPass/index.tsx`   | Remove sessionId logic for QR code value                |
| `server.js` (optional)                        | Delete if only used for scan status                     |

---

**Paste this plan into the chat if you want to revert these changes or when you're ready to upgrade to WebSockets.** 