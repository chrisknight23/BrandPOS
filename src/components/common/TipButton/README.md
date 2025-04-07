# TipButton Component

A button component specifically designed for tip amount selection. Used in the tipping flow to display and select tip amounts.

## Props

- `layoutId`: string - Unique ID for Framer Motion layout animations
- `amount`: string - The tip amount to display
- `onClick`: () => void - Click handler for tip selection

## Usage

```tsx
<TipButton
  layoutId="tip-1"
  amount="1"
  onClick={() => handleTipSelection()}
/>
```

## Features

- Consistent styling with Cash App design
- Animated transitions
- Dollar amount display
- Interactive states for user feedback 