# ScreensaverCard

A specialized card component designed for screensaver animations with multi-phase motion sequences.

## Description

The ScreensaverCard component provides a smooth, coordinated animation sequence specifically designed for screensaver modes. It features a blank card that goes through drop, rotate, and expand phases with customizable timing and appearance.

## Usage

```tsx
import { ScreensaverCard } from '../components/common/ScreensaverCard';

// Basic usage - automatic animation sequence
<ScreensaverCard />

// Customized screensaver card
<ScreensaverCard 
  backgroundColor="bg-[#5D5D3F]"
  backfaceColor="bg-[#4A4A32]"
  brandName="$yourbrand"
  subtitle="Custom Mode"
  startDelay={1500}
/>

// NEW: Controlled state usage
<ScreensaverCard 
  initialPhase="expand"    // Start in full-screen mode
  targetPhase="normal"     // Animate to small card
  autoStart={false}        // Don't use automatic sequence
  startDelay={200}         // Brief delay before animation
/>

// NEW: Static state (no animation)
<ScreensaverCard 
  initialPhase="expand"    // Show in full-screen mode
  autoStart={false}        // No animation
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `backgroundColor` | string | `'bg-[#5D5D3F]'` | Background color for the card front face |
| `backfaceColor` | string | `'bg-[#4A4A32]'` | Background color for the card back face |
| `brandName` | string | `'$mileendbagel'` | Brand name to display in overlay |
| `subtitle` | string | `'Screensaver Mode'` | Subtitle text in overlay |
| `className` | string | `''` | Additional CSS classes |
| `autoStart` | boolean | `true` | Whether to start animation automatically |
| `startDelay` | number | `2000` | Delay in ms before starting animation |
| `onExpandStart` | function | `undefined` | Callback when expand phase starts |
| `initialPhase` | ScreensaverPhase | `'normal'` | **NEW:** Initial state of the card |
| `targetPhase` | ScreensaverPhase | `undefined` | **NEW:** Target state to animate to |

### ScreensaverPhase Type
```typescript
type ScreensaverPhase = 'normal' | 'drop' | 'rotate' | 'expand' | 'fullscreen';
```

- **`normal`**: Small card (361x480px) in center
- **`drop`**: Scaled down to 0.6x size
- **`rotate`**: Rotated 90° (landscape orientation)  
- **`expand`**: Transition state with 360° flip animation to full screen
- **`fullscreen`**: Static full screen state with dynamic messaging (no animation)

## Animation Sequence

The component performs a coordinated 3-phase animation:

### Phase 1: Drop (0-1.8s)
- Card scales from 1.0 to 0.85
- Natural spring bounce effect
- 0.5s delay before starting

### Phase 2: Rotate (1.8s-3.3s)  
- Card rotates 90 degrees (landscape)
- Card flips to show back face
- Maintains 0.85 scale

### Phase 3: Expand (3.3s+)
- Card scales to 2.2x size
- Dimensions change to 800x500px
- Fills device frame in landscape

### Dynamic Messaging Content (ScreensaverMessaging Component)
- Fades in during the expand phase
- Displays rotating promotional messages (e.g., "Follow us and earn rewards")
- Uses ScreensaverMessaging component for dynamic text cycling
- Counter-scales to maintain readable text size
- Integrated within the expanded card area

## Card Specifications

- **Initial Size**: 361x480px (same as BrandPass)
- **Aspect Ratio**: Maintains BrandPass proportions
- **Expanded Size**: 800x500px (device frame)
- **Border**: White top border (20% opacity)
- **Corner Radius**: 32px rounded corners

## Animation Settings

The component uses unified spring animations for smooth motion:

- **Drop Phase**: Fast, bouncy (stiffness: 200, damping: 15)
- **Expand Phase**: Smooth, controlled (stiffness: 120, damping: 30)
- **All Properties**: Coordinated timing to prevent jitter

## Customization

### Colors
```tsx
<ScreensaverCard 
  backgroundColor="bg-blue-600"
  backfaceColor="bg-blue-800"
/>
```

### Content
```tsx
<ScreensaverCard 
  brandName="$customname"
  subtitle="Your Custom Text"
/>
```

### Timing
```tsx
<ScreensaverCard 
  startDelay={3000}  // 3 second delay
  autoStart={false}  // Manual control
/>
```

## NEW: State Control Examples

### Screensaver Screen (Forward Animation)
```tsx
<ScreensaverCard 
  autoStart={true}
  startDelay={0}
  onExpandStart={() => setIsExpanding(true)}
/>
```

### ScreensaverExit Screen (Reverse Animation)  
```tsx
<ScreensaverCard 
  initialPhase="fullscreen" // Start in static full-screen state
  targetPhase="normal"      // Shrink to small card
  autoStart={false}         // Don't use auto sequence
  startDelay={200}          // Brief delay
/>
```

### Static Display (No Animation)
```tsx
<ScreensaverCard 
  initialPhase="fullscreen" // Show static full-screen state
  autoStart={false}         // No animation
/>
```

## Implementation Notes

- Uses Framer Motion for smooth animations
- Maintains 3D perspective and backface culling
- Optimized spring settings prevent animation conflicts
- Integrates ScreensaverMessaging component for dynamic messaging in expand phase
- Self-contained with minimal external dependencies
- Designed specifically for screensaver use cases

## Dependencies

- **ScreensaverMessaging**: Handles dynamic message cycling during expand phase
- **Framer Motion**: Animation library for smooth transitions

## Changelog

- **v2.0**: Added state control with `initialPhase` and `targetPhase` props
  - Can now start in any phase (normal, drop, rotate, expand)
  - Can animate to specific target phases
  - Enables reverse animations (expand → normal)
  - Perfect for ScreensaverExit transitions
- **v1.0**: Multi-phase screensaver animation with blank card design
  - Extracted from BrandPass component for better separation of concerns 