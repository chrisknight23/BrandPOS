import { Variants } from 'framer-motion';

export const screenVariants: Variants = {
  enter: {
    x: 1000,
    opacity: 0,
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: {
    zIndex: 0,
    x: -1000,
    opacity: 0,
  },
};

export const screenTransition = {
  x: { type: "spring", stiffness: 300, damping: 30 },
  opacity: { duration: 0.2 }
}; 