# Cash App POS

A modern, animated point-of-sale (POS) system built with React and TypeScript, designed for seamless, touch-friendly checkout experiences. Features a modular architecture, advanced UI animations, QR code-based flows, and a polished, Cash App-inspired interface.

---

## Features

- **Animated QR Code Flow**: Unique session-based QR codes for customer interaction, with real-time scan detection and automatic navigation.
- **Tap to Pay**: Animated, interactive payment screen.
- **Tipping Interface**: Customizable tip amounts and smooth transitions.
- **Authentication Flow**: Modular screens for user sign-in and access.
- **Environment Switching**: Easily switch between POS, Cash App, and Web environments.
- **Developer Tools**: SettingsPanel, DropMenu, and productSelector for rapid testing and configuration.
- **Framer Motion Animations**: Smooth transitions, card expansions, and interactive feedback.
- **Reusable Components**: Device frame, animated numbers, QR codes, and more.
- **Custom Hooks**: For QR polling, feature flags, and screen transitions.
- **Responsive, Touch-Optimized Design**
- **Cash Sans Font**: Consistent, branded typography

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

4. Start the QR code backend server and expose it with ngrok (see `README_QR_SERVER_SETUP.md` for details).

---

## Project Structure

```
src/
├── assets/         # Images, icons, and Lottie files
│   └── images/     # SVGs and raster images
├── components/
│   ├── common/     # Shared components (DeviceFrame, AnimatedQRCode, LocalPass, etc.)
│   ├── ui/         # UI primitives (PillButton, button)
│   ├── dev/        # Developer tools (SettingsPanel, dropMenu, productSelector)
│   └── designTokens/ # Design system tokens
│   ├── MainView.tsx # Main app controller
├── constants/      # Animation and feature flag constants
├── context/        # React context providers
├── environment/    # Environment-specific logic (CashApp, CashWeb, etc.)
├── experiments/    # Prototypes and animation experiments
├── hooks/          # Custom React hooks (useQRCodeScanStatus, etc.)
├── screens/
│   ├── checkout/   # Checkout flow screens (Cart, Payment, Tipping, Cashback, Cashout, End, etc.)
│   └── auth/       # Authentication screens
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
├── App.tsx         # Main app entry
└── main.tsx        # App bootstrap
```

---

## QR Code Flow

- **Session ID Generation**: Each app load generates a unique sessionId.
- **QR Code Value**: QR code encodes `https://<ngrok-url>/scan/{sessionId}`.
- **Polling**: App polls `https://<ngrok-url>/status/{sessionId}` every 2 seconds.
- **Navigation**: When scan is detected, app auto-navigates to the Cashout screen.
- **Server**: Express backend tracks scan status (see `README_QR_SERVER_SETUP.md`).
- **ngrok**: Used to expose the backend for QR code and polling.

---

## Key Components & Hooks

- **DeviceFrame**: Consistent viewport container for previews and experiments.
- **AnimatedQRCode**: Animated, customizable QR code with session-based value.
- **LocalPass**: Expanding card with animated number, QR code, and Lottie integration.
- **ProgressButton**: Button with animated progress bar.
- **ScreenNavigation**: Bottom navigation bar for switching screens.
- **SettingsPanel**: Developer panel for configuration and testing.
- **DropMenu**: Environment and device selector.
- **useQRCodeScanStatus**: Custom hook for polling scan status.
- **useFeatureFlag**: Feature flag management.
- **useScreenTransition**: Animated screen transitions.

---

## Customization & Theming

- **Styling**: All UI uses Tailwind CSS utility classes.
- **Typography**: Cash Sans font is integrated for a consistent look.
- **Animations**: Framer Motion powers all transitions and interactive effects. Animation constants are defined in `src/constants/animations.ts`.
- **Component Docs**: Each major component has its own README for usage and props.

---

## Development & Troubleshooting

- Touch-optimized, responsive layouts
- Modular, reusable component architecture
- Modern React best practices (hooks, context, etc.)
- See `PROJECT_NOTES.md` and `README_QR_SERVER_SETUP.md` for QR code and server setup, troubleshooting, and removal/upgrade instructions.
- Update ngrok URLs in `LocalPass` and `useQRCodeScanStatus` as needed.

---

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

---

## Changelog

- 2024-06-XX: Updated QR code flow, added environment switching, expanded dev tools, improved documentation
- 2024-06-XX: Improved animation constants and device frame usage

---

## License

[MIT License](LICENSE) 