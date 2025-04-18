# AnimatedLocalCashButton

A reusable, animated button for displaying cycling or static text with an icon, styled for the Local Cash experience. Supports user type-based color, text cycling, and click handling.

## Props

- `texts: string[]` — The text(s) to display. If more than one and `staticText` is false, cycles through them with animation.
- `iconSrc: string` — The icon to display on the right.
- `userType: UserType` — The current user type (affects color).
- `onClick?: () => void` — Optional click handler.
- `animationTiming?: { interval?: number; fade?: number }` — Optional timing for cycling (ms).
- `staticText?: boolean` — If true, only shows the first text (no animation/cycling).

## Usage

```tsx
import AnimatedLocalCashButton from './AnimatedLocalCashButton';
import LocalCashIcon from '../../assets/images/Local-Cash-32px.svg';
import { useUserType } from '../../context/UserTypeContext';

const { userType } = useUserType();

<AnimatedLocalCashButton
  texts={["Give a Tip", "Earn Local Cash"]}
  iconSrc={LocalCashIcon}
  userType={userType}
  onClick={() => {/* handle click */}}
  animationTiming={{ interval: 3000, fade: 300 }}
  staticText={false}
/>
```

## Features
- Cycles through multiple texts with animation, or shows a static text
- Changes text color based on user type (e.g., green for Cash Local customer)
- Customizable icon and click handler
- Fully accessible and keyboard navigable 