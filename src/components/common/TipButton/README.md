# TipButton Component

A button component specifically designed for tip amount selection with rich animation features. Used in the tipping flow to display and select tip amounts, with smooth transitions between normal and selected states.

## Props

- `amount`: string - The tip amount to display
- `layoutId`: string - Unique ID for Framer Motion layout animations
- `onClick`: () => void - Click handler for tip selection
- `isSelected`: boolean - Whether this tip button is currently selected
- `animate`: object - Custom animation properties to override defaults
- `initial`: object - Initial animation state
- `transition`: object - Custom transition settings to override defaults

## Usage

```tsx
<TipButton
  layoutId="tip-1"
  amount="1"
  onClick={() => handleTipSelection()}
  isSelected={selectedTip === "1"}
/>
```

## Features

- Consistent styling with Cash App design
- Rich animated transitions powered by Framer Motion
- Smooth scaling when tapped (in non-selected state)
- Background color transitions between states
- Expansion animation when selected
- Dollar amount display with coordinated text size animation
- Interactive states for user feedback

## Animation Details

- **Layout Animations**: Uses `layoutId` for smooth transitions between normal and selected states
- **Background Color**: Transitions from blue (#1189D6) to green (#00B843) when selected
- **Scale Effect**: Applies a spring-based scale reduction (0.9) on tap for tactile feedback (only in non-selected state)
- **Text Sizing**: Text size increases from 70px to 120px when selected, with coordinated layout animation using a separate `layoutId` for text
- **Expansion**: Button expands to fill the available space when selected (800px × 500px) with absolute positioning
- **Z-Index Management**: Selected button gets z-index: 50 to appear above other elements
- **Customizable**: All animation properties can be overridden by parent components via the `animate`, `initial`, and `transition` props

## Default Transitions

- **Layout**: Spring animation with stiffness: 300, damping: 30
- **Background Color**: Tween animation with duration: 0.3s
- **Tap Scale**: Spring animation with stiffness: 200, damping: 25 

## Implementation Notes

- The component uses separate layout animation IDs for the container and text to ensure smooth transitions
- Button styling changes completely when in selected state, becoming absolutely positioned in the center
- The tap animation is conditionally applied only when the button is not in selected state
- Text animations are coordinated with container animations through matching transition timing 