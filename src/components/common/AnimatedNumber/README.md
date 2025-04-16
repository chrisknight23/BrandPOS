# AnimatedNumber Component

A React component that provides smooth, animated transitions for numerical values. Supports single digits, full prices with decimals, and various animation patterns. Now also supports displaying text strings instead of numbers, or combining numbers with text.

## Features

- 🔄 Smooth rolling animation for digit transitions
- 💲 Optional dollar sign prefix
- 🔢 Configurable decimal places
- 📏 Automatic comma insertion for thousands
- 🎯 Special width handling for the number "1"
- ⚡️ Optimized animations using Framer Motion
- 🎨 Customizable styling via className prop
- 0️⃣ Configurable zero formatting with decimals
- 📝 Support for text strings instead of numbers
- 🔠 Support for combining numbers with text suffixes

## Common Use Cases

### 1. Single Digit Animation (e.g., for counters or scores)
```tsx
// Shows: $0 → $1 → $2 etc.
<AnimatedNumber 
  value={count} 
  showDecimals={false}
/>
```

### 2. Price Display with Decimals
```tsx
// Shows: $0.00 → $42.99
<AnimatedNumber 
  value={price} 
  showDecimals={true}
  showFormattedZero={true}
/>
```

### 3. Plain Number without Currency
```tsx
// Shows: 42 → 43 → 44
<AnimatedNumber 
  value={number}
  showDollarSign={false}
  showDecimals={false}
/>
```

### 4. Text Content Display
```tsx
// Shows: $FREE
<AnimatedNumber 
  value={0}
  textContent="FREE"
/>

// Shows: FREE (without dollar sign)
<AnimatedNumber 
  value={0}
  textContent="FREE"
  showDollarSign={false}
/>
```

### 5. Number with Text Suffix
```tsx
// Shows: $5 OFF
<AnimatedNumber 
  value={5}
  suffixText="OFF"
  showDecimals={false}
/>

// Shows: $10 CASH BACK
<AnimatedNumber 
  value={10}
  suffixText="CASH BACK"
  showDecimals={false}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | number | (required) | The numeric value to display and animate |
| textContent | string | undefined | Optional text string to display instead of the numeric value |
| suffixText | string | undefined | Optional text string to display after the numeric value (only used when textContent is not provided) |
| showDollarSign | boolean | true | Controls dollar sign visibility |
| showDecimals | boolean | true | Controls decimal places visibility |
| showFormattedZero | boolean | false | Controls whether zero shows with decimals (0.00) |
| showOnlyDollarSign | boolean | false | Shows only the dollar sign without any digits |
| className | string | '' | Additional CSS classes |

## Animation Patterns

### 1. Single Digit Animation
```tsx
// Best for:
// - Counters
// - Scores
// - Simple number displays
<AnimatedNumber value={5} showDecimals={false} />
```

### 2. Price Animation
```tsx
// Best for:
// - Product prices
// - Transaction amounts
// - Financial data
<AnimatedNumber 
  value={19.99} 
  showDecimals={true}
  showFormattedZero={true} 
/>
```

### 3. Dollar Sign Only
```tsx
// Best for:
// - Initial states before a value is determined
// - Placeholder for monetary values
// - Minimal currency indicators
<AnimatedNumber 
  value={0}
  showOnlyDollarSign={true}
/>
```

### 4. Text Display
```tsx
// Best for:
// - Special pricing states (e.g., "FREE", "SALE")
// - Non-numeric values in a price display
// - Status indicators
<AnimatedNumber 
  value={0}
  textContent="FREE"
/>
```

### 5. Mixed Number and Text
```tsx
// Best for:
// - Discounts (e.g., "$10 OFF")
// - Rewards (e.g., "$5 CASH BACK")
// - Special offers (e.g., "$25 BONUS")
<AnimatedNumber 
  value={10}
  suffixText="OFF"
  showDecimals={false}
/>
```

### 6. Custom Styling
```tsx
// Example with custom size and color
<AnimatedNumber 
  value={42}
  className="text-green-500 text-[64px]"
/>
```

## Behavior Details

### Decimal Places
- When `showDecimals={true}`:
  - Numbers animate with two decimal places
  - Zero displays as "$0" by default or "$0.00" with `showFormattedZero={true}`
  - Decimals animate smoothly
- When `showDecimals={false}`:
  - Numbers animate as whole integers
  - Zero displays as "$0"
  - No decimal animation

### Zero Formatting
- When `showFormattedZero={true}` and `showDecimals={true}`:
  - Zero displays as "$0.00" with decimal places
  - Ensures consistent width and layout when transitioning from zero to other values
  - Provides proper formatting for monetary values starting at zero
- When `showFormattedZero={false}`:
  - Zero displays as "$0" without decimal places
  - More compact display for non-monetary contexts

### Dollar Sign
- When `showDollarSign={true}`:
  - Dollar sign is fixed in position
  - Special spacing for number "1"
- When `showDollarSign={false}`:
  - No currency symbol
  - Numbers align naturally
- When `showOnlyDollarSign={true}`:
  - Only the dollar sign is shown, without any digits
  - Useful for indicating currency context before revealing the amount
  - Overrides other formatting options for digits

### Text Content
- When `textContent` is provided:
  - Displays the provided text string instead of numeric value
  - Can be combined with `showDollarSign` to show "$FREE" formatting
  - Animates with a fade and slide animation
  - Uses the same font styling as numeric values for consistency
  - Overrides all numeric formatting options

### Suffix Text
- When `suffixText` is provided:
  - Displays numeric value with the text string appended after it
  - Number portion uses digit rolling animation
  - Text portion uses fade and slide animation
  - Automatically adds spacing between number and text
  - Only applies when `textContent` is not provided

### Animation Sequence
1. Initial mount: Value appears with proper formatting
2. Value changes: Smooth rolling animation
3. New digits: Fade in and roll up from zero
4. Removed digits: Fade out
5. Text content: Fade in with slight upward motion
6. Suffix text: Fade in with slight rightward motion

## Technical Requirements

### Dependencies
```json
{
  "react": "^18.0.0",
  "framer-motion": "^11.0.0",
  "tailwindcss": "^3.0.0"
}
```

### CSS Classes
The component uses these Tailwind classes:
- Layout: flex, items-center, justify-center
- Sizing: h-[120px], w-[40px], w-[60px]
- Typography: font-cash, font-medium, text-[100px]

### Font Requirement
- Requires Cash Sans font (font-cash class)

## Best Practices

1. **Choose the Right Format**
   ```tsx
   // For simple numbers (counters, scores)
   showDecimals={false}

   // For prices and monetary values
   showDecimals={true}
   showFormattedZero={true} // For consistent decimal display with zero
   
   // For special pricing states
   textContent="FREE"
   
   // For discounts or special offers
   value={10}
   suffixText="OFF"
   showDecimals={false}
   ```

2. **Animation Timing**
   - Component handles all animation timing internally
   - No need to manage animation states externally
   - Animations are optimized for smooth transitions

3. **Layout Considerations**
   - Component maintains consistent width during animations
   - Dollar sign spacing adjusts automatically
   - Numbers "1" and "7" have special spacing rules
   - Using `showFormattedZero={true}` helps maintain consistent layout when displaying zero values

4. **Performance**
   - Uses Framer Motion's optimized animation system
   - Handles digit transitions efficiently
   - Automatically cleans up animations on unmount

## Browser Support

Works in all modern browsers that support:
- CSS Grid
- CSS Flexbox
- CSS Transforms
- Web Animations API 

## Changelog

### v1.3.0
- Added `suffixText` prop to support displaying text strings after numeric values
- Updated documentation with examples for combined number-text usage
- Optimized animations for suffix text 

### v1.2.0
- Added `textContent` prop to support displaying text strings instead of numbers
- Added text animation with smooth transitions
- Updated documentation with examples for text content usage

### v1.1.0
- Added `showFormattedZero` prop to control how zeros are displayed with decimal places
- Fixed issue where toggling `showDecimals` didn't update zero values properly
- Improved layout consistency when transitioning between zero and non-zero values 