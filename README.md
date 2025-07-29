# Cash App POS (BrandPOS)

A modern, animated point-of-sale (POS) system built with React and TypeScript, designed for seamless, touch-friendly checkout experiences. Features a modular architecture, advanced UI animations, QR code-based flows, and a polished, Cash App-inspired interface.

---

## Features

- **Complete Checkout Flow**: From cart to payment, tipping, rewards, and completion screens
- **Animated QR Code Flow**: Unique session-based QR codes for customer interaction, with real-time scan detection and automatic navigation
- **Reward System**: Animated cashback screen with "$1 earned" display and branded card integration
- **Tipping Interface**: Customizable tip amounts with smooth transitions and custom tip input
- **Tap to Pay**: Animated, interactive payment screen with progress indicators
- **Authentication Flow**: Modular screens for user sign-in and access
- **Screensaver System**: Multiple screensaver modes with exit detection
- **Environment Switching**: Easily switch between POS, Cash App, and Web environments
- **Developer Tools**: SettingsPanel, DropMenu, and interaction controls for rapid testing and configuration
- **Framer Motion Animations**: Smooth transitions, card expansions, slide transitions, and interactive feedback
- **Reusable Components**: Device frame, animated numbers, QR codes, brand passes, and more
- **Custom Hooks**: For QR polling, feature flags, screen transitions, and slide animations
- **Responsive, Touch-Optimized Design**
- **Cash Sans Font System**: Consistent, branded typography with proper weight management

---

## Tech Stack

- **React** + **TypeScript**
- **Vite** (build tool and dev server)
- **Tailwind CSS** (utility-first styling)
- **Framer Motion** (animations and transitions)
- **Cash Sans Font System** (custom typography)
- **Express.js** (QR code backend server)

---

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/chrisknight23/BrandPOS.git
cd BrandPOS
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

5. For experiments and prototypes:
```bash
npm run dev:experiments
```

---

## Project Structure

```
src/
├── assets/         # Images, icons, and Lottie files
│   └── images/     # SVGs, logos, and raster images (16px, 24px, 32px variants)
├── components/
│   ├── common/     # Shared components
│   │   ├── AnimatedLocalCashButton/  # Expanding local cash button
│   │   ├── AnimatedMessage/         # Animated text with transitions
│   │   ├── AnimatedNumber/          # Number animations for currency
│   │   ├── AnimatedQRCode/          # QR codes with session management
│   │   ├── BaseScreen/              # Screen wrapper component
│   │   ├── BrandPass/               # Branded card component
│   │   ├── DeviceFrame/             # Consistent viewport container
│   │   ├── LocalPass/               # Expanding card with QR and Lottie
│   │   ├── ProgressButton/          # Button with animated progress
│   │   ├── ScreenNavigation/        # Bottom navigation bar
│   │   ├── ScreensaverCard/         # Screensaver card component
│   │   ├── ScreensaverMessaging/    # Screensaver messaging system
│   │   └── TipButton/               # Customizable tip buttons
│   ├── ui/         # UI primitives (PillButton, ToggleButton, etc.)
│   ├── dev/        # Developer tools
│   │   ├── SettingsPanel/           # Configuration and testing panel
│   │   └── dropMenu/                # Environment and device selector
│   └── MainView.tsx # Main app controller and screen orchestration
├── constants/      # Animation constants, colors, feature flags, screen definitions
├── context/        # React context providers (UserType, etc.)
├── environment/    # Environment-specific logic (CashApp, CashWeb, etc.)
├── experiments/    # Prototypes and animation experiments
├── hooks/          # Custom React hooks
│   ├── useQRCodeScanStatus.ts      # QR code polling and status management
│   ├── useFeatureFlag.ts           # Feature flag management
│   ├── useScreenTransition.ts      # Animated screen transitions
│   └── useSlideTransition.ts       # Slide-based transitions
├── screens/        # Application screens
│   ├── Auth.tsx                    # Authentication screen
│   ├── Cart.tsx                    # Shopping cart with items

│   ├── End.tsx                     # Completion screen
│   ├── Follow.tsx                  # Follow/connect screen
│   ├── Home.tsx                    # Welcome/start screen
│   ├── Payment.tsx                 # Tap to pay screen
│   ├── Reward.tsx                  # Cashback reward screen
│   ├── Screensaver.tsx             # Main screensaver
│   ├── ScreensaverExit.tsx         # Screensaver exit flow
│   ├── ScreensaverFollow.tsx       # Screensaver with follow prompt
│   └── tipping/
│       ├── Tipping.tsx             # Main tipping interface
│       └── CustomTip.tsx           # Custom tip amount input
├── types/          # TypeScript type definitions
├── utils/          # Utility functions (currency, debug, etc.)
├── App.tsx         # Main app entry
└── main.tsx        # App bootstrap
```

---

## Screen Flow

The application follows a complete checkout experience:

1. **Home** → Welcome screen with start button
2. **Cart** → Shopping cart with items and totals
3. **Payment** → Tap to pay animation and processing
4. **Tipping** → Tip selection (percentage or custom amounts)
5. **Reward** → Cashback animation ("$1 earned") with card slide-in
6. **End** → Completion message and return to home

Additional flows:
- **Screensaver** modes with exit detection
- **Auth** for user authentication
- **Follow** for social connection prompts

---

## QR Code Flow

- **Session ID Generation**: Each app load generates a unique sessionId
- **QR Code Value**: QR code encodes `https://<ngrok-url>/scan/{sessionId}`
- **Polling**: App polls `https://<ngrok-url>/status/{sessionId}` every 2 seconds
- **Navigation**: When scan is detected, app auto-navigates to the End screen
- **Server**: Express backend tracks scan status (see `README_QR_SERVER_SETUP.md`)
- **ngrok**: Used to expose the backend for QR code and polling

---

## Key Components & Hooks

### Core Components
- **DeviceFrame**: Consistent 800x500px viewport container for all screens
- **AnimatedQRCode**: Session-based QR codes with polling integration
- **BrandPass**: Branded card component with animated number display
- **AnimatedNumber**: Smooth number transitions for currency amounts
- **ProgressButton**: Interactive buttons with animated progress states
- **TipButton**: Customizable tip buttons with various amounts and styles
- **BaseScreen**: Standard screen wrapper with consistent styling

### Developer Tools
- **SettingsPanel**: Comprehensive development panel with tabs for:
  - Settings: Feature flags and configuration
  - Interaction: Screen navigation and testing
  - Analytics: Usage tracking and metrics
  - APIs: Backend integration testing
  - Research: User testing and feedback tools
- **DropMenu**: Environment switching and device selection

### Custom Hooks
- **useQRCodeScanStatus**: QR code polling and scan detection
- **useFeatureFlag**: Feature flag management and toggling
- **useScreenTransition**: Smooth screen transition animations
- **useSlideTransition**: Slide-based navigation transitions

---

## Animations & Motion

- **Timing Constants**: Standardized animation durations (0.3s fade, 0.2s transitions)
- **Spring Animations**: Natural movement with consistent spring configs
- **Screen Transitions**: Horizontal slides with spring physics
- **Card Expansions**: Smooth scaling and positioning animations
- **Number Animations**: Smooth currency value transitions
- **Opacity Transitions**: Coordinated fade-in/fade-out sequences

### Animation Guidelines
- Use `AnimatePresence` for exit animations
- Coordinate related animations with consistent timing
- Prefer spring animations for natural movement
- Maintain device frame dimensions (800x500px)
- Use consistent z-index layering for proper stacking

---

## Customization & Theming

- **Styling**: All UI uses Tailwind CSS utility classes
- **Typography**: Cash Sans font system with proper weight variants (regular, medium)
- **Colors**: Consistent color palette defined in constants
- **Animations**: Framer Motion powers all transitions with centralized timing constants
- **Component Architecture**: Modular, reusable components with clear props interfaces

---

## Font System

The project uses a custom Cash Sans font system:
- **Regular (400)** and **Medium (500)** weights
- Proper font-face declarations in `public/fonts/stylesheet.css`
- Tailwind integration with `font-cash` utility class
- Consistent typography across all components

---

## Development Features

- **Hot Module Replacement**: Instant updates during development
- **TypeScript**: Full type safety and IntelliSense
- **ESLint**: Code quality and consistency enforcement
- **Component Documentation**: README files for major components
- **Feature Flags**: Runtime feature toggling for testing
- **Environment Switching**: Easy testing across different contexts

---

## Deployment

The project is deployment-ready for platforms like Vercel:
- Static build output via Vite
- Environment variable support
- Optimized production builds
- Font and asset optimization

---

## Contributing

1. Create a feature branch from `main`
2. Make your changes following the established patterns
3. Update component READMEs if adding new components
4. Test across different screen flows
5. Submit a pull request

## Critical Development Rules

### Screen Transitions

⚠️ **IMPORTANT**: All new screens MUST be added to the `INSTANT_SCREENS` array in `MainView.tsx`:

```typescript
const INSTANT_SCREENS = [
  'Home',
  'Follow',
  // ... other screens ...
  'YourNewScreen'  // Add your screen here
];
```

Failure to do this will cause:
- Undesired full interface animations
- Duplicated navigation bars
- Multiple screen instances
- Broken grouped screen navigation

When adding new screens, always:
1. Add to `types/screen.ts`
2. Add to `INSTANT_SCREENS` in `MainView.tsx`
3. Add to `SCREEN_ORDER` in `constants/screens.ts`
4. If part of a group, add to the appropriate group constant

See `PROJECT_NOTES.md` for detailed screen transition guidelines.

---

## Recent Updates

- **Reward Screen**: Complete cashback flow with animated "$1 earned" display
- **Font System**: Unified Cash Sans typography with proper weight management
- **Slide Transitions**: New useSlideTransition hook for smooth navigation
- **Component Architecture**: Improved reusability and documentation
- **Animation Timing**: Standardized animation constants and coordinated sequences
- **Developer Tools**: Enhanced SettingsPanel with comprehensive testing features

---

## License

[MIT License](LICENSE) 