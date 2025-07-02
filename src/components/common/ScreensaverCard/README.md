# ScreensaverCard

A specialized card component designed for screensaver animations with multi-phase motion sequences.

## Description

The ScreensaverCard component provides a smooth, coordinated animation sequence specifically designed for screensaver modes. It features a blank card that goes through drop, rotate, and expand phases with customizable timing and appearance.

## Usage

```tsx
import { ScreensaverCard } from '../components/common/ScreensaverCard';

// Basic usage with defaults
<ScreensaverCard />

// Customized screensaver card
<ScreensaverCard 
  backgroundColor="bg-[#5D5D3F]"
  backfaceColor="bg-[#4A4A32]"
  brandName="$yourbrand"
  subtitle="Custom Mode"
  startDelay={1500}
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

### Overlay Content
- Fades in at 1.0s after drop starts
- Shows brand name and subtitle
- Appears over the blank card

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

## Implementation Notes

- Uses Framer Motion for smooth animations
- Maintains 3D perspective and backface culling
- Optimized spring settings prevent animation conflicts
- Self-contained with no external dependencies
- Designed specifically for screensaver use cases

## Changelog

- **Initial Release**: Multi-phase screensaver animation with blank card design
- Extracted from BrandPass component for better separation of concerns 