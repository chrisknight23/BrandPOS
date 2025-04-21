import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'default';
}

export const Button: React.FC<ButtonProps> = ({ 
  className = '', 
  children, 
  variant = 'secondary',
  ...props 
}) => {
  let variantClasses = '';
  if (variant === 'primary') {
    variantClasses = 'bg-[#00B843] hover:bg-[#00A33C] active:bg-[#008F35] text-white';
  } else if (variant === 'secondary') {
    variantClasses = 'bg-white/5 text-white hover:bg-white/10 active:bg-white/15';
  }
  return (
    <button 
      className={`rounded-full py-4 flex-1 text-base transition-colors shadow ${variantClasses} ${className}`} 
      {...props}
    >
      <span className="antialiased font-medium">{children}</span>
    </button>
  );
}; 