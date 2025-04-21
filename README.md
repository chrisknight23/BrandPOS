# Cash App POS

A modern, animated point-of-sale (POS) system built with React and TypeScript, designed for seamless, touch-friendly checkout experiences. Features a modular architecture, advanced UI animations, and a polished, Cash App-inspired interface.

---

## Features

- **Tap to Pay**: Animated, interactive payment screen
- **Tipping Interface**: Customizable tip amounts and smooth transitions
- **Authentication Flow**: Modular screens for user sign-in and access
- **Cash Sans Font**: Consistent, branded typography
- **Responsive, Touch-Optimized Design**
- **Framer Motion Animations**: Smooth transitions, card expansions, and interactive feedback
- **Settings Panel**: Developer tools and configuration screens
- **Experimentation**: Prototypes and animation experiments
- **Reusable Components**: Device frame, animated numbers, QR codes, and more

---

## Tech Stack

- **React** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** (utility-first styling)
- **Framer Motion** (animations)
- **Cash Sans Font System**

---

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/chrisknight23/POS.git
cd POS
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

---

## Project Structure

```
src/
├── assets/         # Images, icons, and Lottie files
├── components/
│   ├── common/     # Shared components (DeviceFrame, AnimatedQRCode, etc.)
│   ├── dev/        # Developer tools (SettingsPanel, etc.)
│   ├── ui/         # UI primitives (Button, etc.)
│   └── designTokens/ # Design system tokens (if any)
├── constants/      # Animation and feature flag constants
├── context/        # React context providers
├── experiments/    # Prototypes and animation experiments
├── hooks/          # Custom React hooks
├── screens/
│   ├── checkout/   # Checkout flow screens (Cart, Payment, Tipping, etc.)
│   └── auth/       # Authentication screens
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
├── App.tsx         # Main app entry
└── main.tsx        # App bootstrap
```

---

## Usage Example

```tsx
import { DeviceFrame } from './components/common/DeviceFrame';
import { Cart } from './screens/checkout/Cart';

const App = () => (
  <DeviceFrame>
    <Cart />
  </DeviceFrame>
);
```

---

## Key Components

### DeviceFrame

A consistent viewport container for previews and experiments.

**Props:**
- `children`: ReactNode — Content inside the frame
- `className?`: string — Optional extra classes

**Usage:**
```tsx
<DeviceFrame>
  <YourComponent />
</DeviceFrame>
```

---

## Customization & Theming

- **Styling**: All UI uses Tailwind CSS utility classes.
- **Typography**: Cash Sans font is integrated for a consistent look.
- **Animations**: Framer Motion powers all transitions and interactive effects. Animation constants are defined in `src/constants/animations.ts`.

---

## Development

- Touch-optimized, responsive layouts
- Modular, reusable component architecture
- Modern React best practices (hooks, context, etc.)

---

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

---

## Changelog

- 2024-06-XX: Updated README, added SettingsPanel, expanded experiments
- 2024-06-XX: Improved animation constants and device frame usage

---

## License

[MIT License](LICENSE) 