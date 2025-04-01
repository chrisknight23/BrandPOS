import { useEffect } from 'react';

export const useAutoProgress = (onNext: () => void, delay: number = 2000) => {
  useEffect(() => {
    const timer = setTimeout(onNext, delay);
    return () => clearTimeout(timer);
  }, [onNext, delay]);
}; 