# DropMenu Component

A reusable, animated dropdown menu for user/profile selection or similar use cases. Supports smooth expand/collapse, click-outside-to-close, keyboard accessibility, and full theming.

## Description
- Collapsed: 48x48px round button (customizable)
- Expanded: Card with selectable rows, icon, and title
- Customizable via props (labels, theme, icon, etc.)
- Animates width, height, border radius, and content fade
- Click outside to close
- Keyboard accessible (Enter/Space to open/close, Tab navigation)

## Usage Example
```tsx
import { DropMenu } from './dropMenu';

<DropMenu
  title="Customer"
  rowLabels={["New customer", "Returning customer", "Cash Local customer"]}
  onRowSelect={(rowIndex) => {
    if (rowIndex === 0) setUserType('new');
    else if (rowIndex === 1) setUserType('returning');
    else if (rowIndex === 2) setUserType('cash-local');
  }}
  theme={{
    background: '#181818',
    border: 'border border-white/10',
    textColor: 'text-white/80',
    selectedBackground: 'bg-white',
    selectedTextColor: 'text-black',
    hoverTextColor: 'text-white',
    backdropBlur: true,
    fillOpacity: 100,
  }}
  expandedWidth={226}
  collapsedSize={48}
  initialState="closed"
  ariaLabel="Open customer menu"
/>
```

## Props
| Prop                | Type                       | Description |
|---------------------|----------------------------|-------------|
| `rowLabels`         | `string[]`                 | Labels for each row (required) |
| `title`             | `string`                   | Title displayed in expanded state |
| `iconSrc`           | `string`                   | Custom icon source (SVG or image) |
| `initialSelectedRow`| `number`                   | Initial selected row (1-based index, default: 1) |
| `onRowSelect`       | `(rowIndex: number) => void`| Callback when row is selected (0-based index) |
| `theme`             | `object`                   | Theme customization (see below) |
| `collapsedSize`     | `number`                   | Size of button when collapsed (default: 48) |
| `expandedWidth`     | `number`                   | Width of button when expanded (default: 226) |
| `initialState`      | `'open' | 'closed'`        | Initial state (default: 'closed') |
| `iconPosition`      | `'left' | 'center'`        | Icon position in collapsed state (default: 'center') |
| `ariaLabel`         | `string`                   | Custom aria label for accessibility |

### Theme Object
| Key                  | Type      | Description |
|----------------------|-----------|-------------|
| `background`         | `string`  | Background color |
| `border`             | `string`  | Border color/style (Tailwind or CSS) |
| `textColor`          | `string`  | Default text color |
| `selectedBackground` | `string`  | Selected row background |
| `selectedTextColor`  | `string`  | Selected row text color |
| `hoverTextColor`     | `string`  | Text color on hover |
| `backdropBlur`       | `boolean` | Enable backdrop blur effect |
| `fillOpacity`        | `number`  | Background fill opacity (0-100) |

## Features
- **Smooth animation**: Expands/collapses with spring animation, content fades in/out with delay.
- **Click outside to close**: Menu collapses when clicking anywhere outside.
- **Keyboard accessible**: Tab navigation, Enter/Space to open/close.
- **Customizable**: Theme, icon, width, collapsed size, etc.
- **Single icon, always aligned**: Icon is left-aligned in expanded state, centered in collapsed state, with customizable padding.
- **Row selection**: Callback with 0-based index for integration with app logic.

## Best Practices
- Use 0-based indexing for `onRowSelect` callback.
- Pass a unique `ariaLabel` for accessibility.
- Adjust `expandedWidth` and `collapsedSize` to fit your design.
- Use fixed row heights for best animation results.
- Keep icon assets at 24x24px for best alignment.

## Troubleshooting
- **Menu doesn't close on outside click**: Ensure DropMenu is not inside a container that stops event propagation.
- **Rows not filling width**: Make sure row buttons use `w-full` and parent uses `flex flex-col w-full`.
- **Icon not centered/correct size**: Use a 24x24px SVG or image, or set `style={{ width: 24, height: 24 }}` on the `<img>`.
- **Animation jump/flicker**: Use only fixed heights and paddings in the height calculation.

## Changelog
- **2024-07-XX**: Major update—UI/animation finalized, click-outside-to-close added, icon alignment improved, row selection logic restored, README updated.
- **2024-06-XX**: Initial version.

---
_Keep this README up to date with all changes!_ 