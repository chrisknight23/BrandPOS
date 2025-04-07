# LocalPass Component

A component that renders an animated card with a dollar amount. Used for displaying cash back and tip amounts.

## Props

- `layoutId`: string - Unique ID for Framer Motion layout animations
- `amount`: string - The dollar amount to display
- `isExpanded`: boolean - Whether the card is in expanded state
- `onClick`: () => void - Click handler for the card

## Usage

```tsx
<LocalPass
  layoutId="amount-1"
  amount="1"
  isExpanded={false}
  onClick={() => handleClick()}
/>
```

## Features

- Smooth animations using Framer Motion
- Expandable card layout
- Dollar amount display
- Interactive hover and click states 