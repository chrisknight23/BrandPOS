# DeviceFrame Component

A consistent viewport container that maintains Cash App's standard 800x500 device dimensions for previews and experiments.

## Props

- `children`: ReactNode - Content to be rendered within the device frame
- `className?`: string - Optional additional classes for the frame container

## Usage

```tsx
<DeviceFrame>
  <YourComponent />
</DeviceFrame>
```

## Features

- **Safari Mode**: Fixed 800x500 dimensions (original behavior)
- **PWA Mode**: Responsive sizing with 8:5 aspect ratio that scales to fit screen
- Automatic detection of PWA vs browser mode
- Centers content in the viewport with proper padding
- Provides standard rounded corners (rounded-2xl)
- Handles overflow containment
- Optimized for iPad PWA display while preserving desktop/Safari experience
- Follows Cash App device frame specifications

## Common Use Cases

- Experiment previews
- Component development
- Screen prototypes
- Animation testing 