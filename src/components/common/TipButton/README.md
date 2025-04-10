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
- **Background Color**: Transitions from blue (#1189D6) to green (#00B843) when selected with a tween duration of 0.3s
- **Scale Effect**: Applies a spring-based scale reduction (0.9) on tap for tactile feedback (only in non-selected state) using spring configuration: stiffness: 200, damping: 25
- **Text Sizing**: Text size increases from 70px to 120px when selected, with coordinated layout animation using a separate `layoutId` for text
- **Expansion**: Button expands to fill the available space when selected (800px × 500px) with absolute positioning
- **Z-Index Management**: Selected button gets z-index: 50 to appear above other elements
- **Parent Control**: All animation properties can be overridden by parent components via the `animate`, `initial`, and `transition` props
- **Nested Animations**: Uses separate layout IDs for container and content to ensure smooth text transitions during state changes

## Default Transitions

- **Layout**: Enabled by default (`layout: true`) for smoother layout transitions
- **Background Color**: Tween animation with duration: 0.3s
- **Tap Scale**: Spring animation with stiffness: 200, damping: 25
- **Overall Duration**: Default duration of 0.3s to ensure consistent timing

## Animation Nesting Structure

```
<motion.div> (Main container with layoutId)
  └─ <motion.div> (Content wrapper with layout and separate layoutId)
     └─ <motion.span> (Text with layout and separate layoutId)
```

## Implementation Notes

- The component uses separate layout animation IDs for the container, content wrapper, and text to ensure smooth transitions
- Button styling changes completely when in selected state, becoming absolutely positioned in the center
- The tap animation is conditionally applied only when the button is not in selected state
- Text animations are coordinated with container animations through matching transition timing
- The component follows the project's animation standards with standard fade durations of 0.3s 