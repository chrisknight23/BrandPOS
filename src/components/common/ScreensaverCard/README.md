# ScreensaverCard

A specialized card component designed for screensaver animations with multi-phase motion sequences and flexible flip controls.

## Description

The ScreensaverCard component provides a smooth, coordinated animation sequence specifically designed for screensaver modes. It features a card that goes through drop, rotate, and expand phases with customizable timing, appearance, and flip behavior. The component supports both automatic animation sequences and manual flip controls.

## Usage

```tsx
import { ScreensaverCard } from '../components/common/ScreensaverCard';
import { BRAND_COLORS } from '../constants/colors';

// Basic usage - automatic animation sequence
<ScreensaverCard />

// Customized screensaver card with centralized colors
<ScreensaverCard 
  backgroundColor={BRAND_COLORS.primary}
  backfaceColor={BRAND_COLORS.primaryDark}
  brandName="$yourbrand"
  startDelay={1500}
/>

// Controlled state usage
<ScreensaverCard 
  initialPhase="expand"    // Start in full-screen mode
  targetPhase="normal"     // Animate to small card
  autoStart={false}        // Don't use automatic sequence
  startDelay={200}         // Brief delay before animation
/>

// Manual flip control
<ScreensaverCard 
  fullFlip={true}          // Do 540° rotation instead of 180°
  flipped={true}           // Show back face
  flipToFront={false}      // Override to flip to front
/>

// Simple flip to front (overrides all other flip logic)
<ScreensaverCard 
  flipToFront={true}       // Force flip to front face
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `backgroundColor` | string | `BRAND_COLORS.primary` | Background color for the card front face (CSS color) |
| `backfaceColor` | string | `BRAND_COLORS.primaryDark` | Background color for the card back face (CSS color) |
| `brandName` | string | `'$mileendbagel'` | Brand name to display |
| `autoStart` | boolean | `true` | Whether to start animation automatically |
| `startDelay` | number | `2000` | Delay in ms before starting animation |
| `onExpandStart` | function | `undefined` | Callback when expand phase starts |
| `initialPhase` | ScreensaverPhase | `'normal'` | Initial state of the card |
| `targetPhase` | ScreensaverPhase | `undefined` | Target state to animate to |
| `showFrontContent` | boolean | `true` | Whether to show front content (header, logo, button) |
| `showBackContent` | boolean | `true` | Whether to show back face messaging content |
| `onButtonClick` | function | `undefined` | Callback when Follow button is clicked |
| `fullFlip` | boolean | `false` | Do a full 540° flip instead of 180° |
| `customBackContent` | ReactNode | `undefined` | Custom content for the back face |
| `goToScreen` | function | `undefined` | Navigation function to go to a specific screen |
| `flipped` | boolean | `false` | Whether the card should be flipped to show the back face |
| `flipToFront` | boolean | `false` | Force flip to front face (overrides other flip logic) |

### ScreensaverPhase Type
```typescript
type ScreensaverPhase = 'normal' | 'drop' | 'expand' | 'fullscreen';
```

- **`normal`**: Small card (361x480px) in center
- **`drop`**: Scaled down during rubber band effect
- **`expand`**: Transition state with flip animation to full screen
- **`fullscreen`**: Full screen state (361x578px) with content on back face

## Color System

The component uses centralized color management through `BRAND_COLORS`:

```typescript
// From constants/colors.ts
BRAND_COLORS = {
  primary: '#5D5D3F',           // Default front face color
  primaryDark: '#4A4A32',       // Default back face color
  primaryExpanded: '#3B3B28',   // Color when expanded/fullscreen
  borderLight: 'rgba(255, 255, 255, 0.2)',
  borderTransparent: 'rgba(255, 255, 255, 0)',
}
```

### Benefits:
- **Consistent**: All cards use the same color system
- **Maintainable**: Change `BRAND_COLORS.primary` to update all cards
- **Flexible**: Can still override per instance if needed

## Animation System

### 1. Phase-Based Animations
The card goes through different phases with specific behaviors:
- `normal` → `drop` → `expand` → `fullscreen`
- Each phase has specific rotateY, scale, and color values

### 2. Flip Control Hierarchy (in order of priority)
1. **`flipToFront={true}`**: Overrides everything, forces `rotateY: 0`
2. **Phase-based**: `expand`/`fullscreen` force 180° (back face)
3. **`fullFlip={true}`**: Uses 540° rotation instead of 180°
4. **`flipped` prop**: Simple 180° vs 0° control

### 3. Animation Logic
```typescript
rotateY: flipToFront ? 0 : (
  isExpanded ? 180 : 
  (fullFlip ? 540 : (flipped ? 180 : 0))
)
```

## Common Usage Patterns

### Entry Animation (ScreensaverFollow)
```tsx
<ScreensaverCard 
  backgroundColor={BRAND_COLORS.primary}
  initialPhase="fullscreen"     // Start showing back face
  targetPhase="normal"          // Animate to normal size
  autoStart={false}            
  fullFlip={true}              // 540° rotation to end on back
  customBackContent={<QRCode />}
/>
```

### Exit Animation (Flip to Front)
```tsx
const [flipToFront, setFlipToFront] = useState(false);

// On close button click:
setFlipToFront(true); // Simple override to flip to front

<ScreensaverCard 
  backgroundColor={BRAND_COLORS.primary}
  fullFlip={true}              // Preserve entry animation
  flipToFront={flipToFront}    // Simple exit flip
/>
```

### Static Display
```tsx
<ScreensaverCard 
  backgroundColor={BRAND_COLORS.primary}
  initialPhase="fullscreen"
  autoStart={false}            // No animation
  customBackContent={<Content />}
/>
```

## Best Practices

### ✅ Do:
- Use `BRAND_COLORS` constants for consistent colors
- Use `flipToFront` for simple exit animations
- Use `targetPhase` for controlled animations
- Specify `autoStart={false}` when controlling animations externally

### ❌ Don't:
- Mix Tailwind classes with CSS colors
- Use multiple flip props simultaneously (causes conflicts)
- Hardcode color values (use centralized constants)

## Front Content Animation

### Logo Positioning
- Logo positioned using exact BrandPass layout structure
- Uses `flex-1` middle section with proper header/footer spacers
- Logo remains visible throughout all animation phases

### Element Fade Animations
- **Header text** and **Follow button** fade out during drop phase
- **Logo** always remains visible on front
- Fade duration: 0.3s with easeOut timing

## Implementation Notes

- Uses Framer Motion for smooth animations
- Maintains 3D perspective and backface culling
- Integrates ScreensaverMessaging component for dynamic messaging
- **Warning**: Multiple flip props can conflict - use `flipToFront` for simple overrides
- Colors use centralized `BRAND_COLORS` system for consistency

## Dependencies

- **ScreensaverMessaging**: Handles dynamic message cycling
- **Framer Motion**: Animation library for smooth transitions
- **BRAND_COLORS**: Centralized color constants

## Changelog

- **v3.0**: Major cleanup and best practices implementation
  - Removed unused props: `subtitle`, `className`, `backfaceColor` (now customizable)
  - Removed unused phases: `rotate`, `screensaver`
  - Implemented centralized color system with `BRAND_COLORS`
  - Simplified animation logic and removed redundant code
  - Added `backfaceColor` prop for full customization
  - Updated all usages to use consistent CSS color format
- **v2.2**: Added flip control props (`flipped`, `flipToFront`)
- **v2.1**: Enhanced front content animations and positioning
- **v2.0**: Added state control with `initialPhase` and `targetPhase` props
- **v1.0**: Multi-phase screensaver animation with blank card design 