# BaseScreen Component

A foundational layout component that provides a consistent structure for screens with optional navigation controls and title.

## Props

- `children`: ReactNode - Content to be rendered within the screen
- `onBack?`: () => void - Optional callback for back button action
- `onNext?`: () => void - Optional callback for next button action
- `title?`: string - Optional title to display at the top of the screen
- `hideBackButton?`: boolean - Option to hide the back button
- `hideNextButton?`: boolean - Option to hide the next button

## Usage

```tsx
<BaseScreen
  title="Payment Details"
  onBack={() => handleBack()}
  onNext={() => handleNext()}
>
  <YourContent />
</BaseScreen>
```

## Features

- Consistent header layout
- Optional navigation controls (back/next)
- Flexible content area
- Title support
- Responsive design
- Follows Cash App design patterns 