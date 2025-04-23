# Project Notes

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
  - The `useEffect` that listens for `scanned` and navigates to `'Cashout'`.
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