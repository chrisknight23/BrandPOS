import { useEffect, useState } from 'react';
import { BaseScreen } from '../../components/common/BaseScreen/index';
import { motion, AnimatePresence } from 'framer-motion';

interface NotchProps {
  position: 'top' | 'bottom';
  text: string;
}

const AuthNotch = ({ position, text }: NotchProps) => {
  const isTop = position === 'top';
  
  return (
    <div
      className={`
        absolute 
        ${isTop ? 'top-0' : 'bottom-0'}
        left-[346px]
        flex items-center justify-center
        overflow-visible
        w-[140px]
      `}
      style={{
        left: 'calc(50% - 70px)',
        transformOrigin: isTop ? 'top' : 'bottom'
      }}
    >
      {/* Main notch body */}
      <svg
        width="140"
        height="40"
        viewBox="0 0 140 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={isTop ? 
            "M0 0H140V24C140 32.8366 132.837 40 124 40H16C7.16344 40 0 32.8366 0 24V0Z" :
            "M0 0V16C0 7.16344 7.16344 0 16 0H124C132.837 0 140 7.16344 140 16V40H0V0Z"
          }
          fill="black"
        />
      </svg>

      {/* Left corner piece with quarter-circle cutout */}
      <svg
        width="8"
        height="8"
        viewBox="0 0 8 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`absolute -left-[8px] ${isTop ? 'top-0' : 'bottom-0'}`}
      >
        <path
          d={isTop ?
            "M0 0H8V8C8 3.58172 4.41828 0 0 0Z" :
            "M0 8H8V0C8 4.41828 4.41828 8 0 8Z"
          }
          fill="black"
        />
      </svg>

      {/* Right corner piece with quarter-circle cutout */}
      <svg
        width="8"
        height="8"
        viewBox="0 0 8 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`absolute -right-[8px] ${isTop ? 'top-0' : 'bottom-0'}`}
      >
        <path
          d={isTop ?
            "M8 0H0V8C0 3.58172 3.58172 0 8 0Z" :
            "M8 8H0V0C0 4.41828 3.58172 8 8 8Z"
          }
          fill="black"
        />
      </svg>

      <span className="absolute text-white font-medium font-cash px-4">
        {text}
      </span>
    </div>
  );
};

interface AuthProps {
  onNext: (amount?: string) => void;
  amount?: string;
}

export const Auth = ({ onNext, amount = "10.80" }: AuthProps) => {
  return (
    <BaseScreen onNext={() => onNext(amount)}>
      <div className="w-[800px] h-[500px] bg-[#1189D6] relative overflow-hidden flex items-center justify-center rounded-[4px]">
        {/* Pulsing dollar sign */}
        <motion.div
          className="text-white text-[110px] leading-none font-medium origin-center"
          initial={{ opacity: 0.7, scale: 0.97 }}
          animate={{ 
            opacity: [0.7, 1, 0.7], 
            scale: [0.97, 1, 0.97] 
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut"
          }}
        >
          $
        </motion.div>

        {/* Auth Notch - without animation */}
        <AuthNotch position="top" text="Authorizing" />
      </div>
    </BaseScreen>
  );
};
