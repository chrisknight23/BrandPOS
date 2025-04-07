import { Variants } from 'framer-motion';

export const screenVariants: Variants = {
  enter: {
    x: '100%',
    opacity: 0
  },
  center: {
    x: 0,
    opacity: 1
  },
  exit: {
    x: '-100%',
    opacity: 0
  }
};

export const screenTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
  mass: 1,
  restSpeed: 0.001,
  restDelta: 0.001
}; 