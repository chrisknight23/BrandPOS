# DropMenu Component

A reusable, animated dropdown menu for user/profile selection or similar use cases.

## Description
- Collapsed: 48x48px round button
- Expanded: Card with selectable rows, icon, and title
- Customizable via props (labels, theme, icon, etc.)

## Usage Example
```tsx
import { DropMenu } from './dropMenu';

<DropMenu
  title="Profile"
  rowLabels={["Option 1", "Option 2", "Option 3"]}
  onRowSelect={(row) => console.log('Selected row:', row)}
/>
```

## Props
<!-- TODO: Document all props and customization options as the component evolves. -->

- `rowLabels`: string[] — Labels for each row
- `title`: string — Title displayed in expanded state
- `iconSrc`: string — Custom icon source
- ... (see code for full list)

---

_This README will be updated as the component evolves._ 