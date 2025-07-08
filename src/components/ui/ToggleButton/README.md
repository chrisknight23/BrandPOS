# ToggleButton Component

A reusable toggle button component with selection states and smooth animations.

## Features

- **Selection States**: Visual feedback for selected/unselected states
- **Smooth Animations**: Framer Motion animations for interactions
- **Customizable**: Multiple sizes and custom styling support
- **Accessible**: Proper button semantics and hover states

## Props

- `isSelected`: boolean — Whether this option is currently selected
- `onClick`: () => void — Click handler function
- `icon`: React.ReactNode — Icon to display inside the button
- `className?`: string — Optional additional CSS classes
- `size?`: 'sm' | 'md' | 'lg' — Size of the button (default: 'md')

## Usage

```tsx
import { ToggleButton } from '../components/ui/ToggleButton';

// Basic usage
<ToggleButton
  isSelected={selectedMode === 'qr'}
  onClick={() => setSelectedMode('qr')}
  icon={<QRCodeIcon />}
/>

// With custom size
<ToggleButton
  isSelected={isActive}
  onClick={handleToggle}
  icon={<ChatIcon />}
  size="lg"
/>

// Example toggle group
const [activeMode, setActiveMode] = useState('qr');

<div className="flex flex-col gap-4">
  <ToggleButton
    isSelected={activeMode === 'qr'}
    onClick={() => setActiveMode('qr')}
    icon={<QRCodeIcon />}
  />
  <ToggleButton
    isSelected={activeMode === 'chat'}
    onClick={() => setActiveMode('chat')}
    icon={<ChatIcon />}
  />
</div>
```

## States

- **Selected**: White background, black icon, white border with shadow
- **Unselected**: Transparent background, white icon, subtle border
- **Hover**: Enhanced border opacity for better feedback
- **Active**: Scale down animation on tap

## Sizes

- `sm`: 48px × 48px (w-12 h-12)
- `md`: 64px × 64px (w-16 h-16) - default
- `lg`: 80px × 80px (w-20 h-20)

## Styling

The component uses Tailwind CSS classes and supports:
- Custom className prop for additional styling
- Smooth transitions for all state changes
- Consistent spacing and proportions
- Responsive design patterns 