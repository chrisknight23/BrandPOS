import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  className = '', 
  children, 
  ...props 
}) => {
  return (
    <button 
      className={`${className}`} 
      {...props}
    >
      {children}
    </button>
  );
}; 