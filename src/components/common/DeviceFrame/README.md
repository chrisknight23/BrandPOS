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

- Maintains consistent 800x500 viewport dimensions
- Centers content in the browser window
- Provides standard rounded corners (rounded-2xl)
- Handles overflow containment
- Uses Cash App dark green background (#001707)
- Follows Cash App device frame specifications

## Common Use Cases

- Experiment previews
- Component development
- Screen prototypes
- Animation testing 