import React from 'react';

interface CashLogoProps {
  size?: number;
  color?: string;
  backgroundColor?: string;
}

const CashLogo: React.FC<CashLogoProps> = ({
  size = 40,
  color = '#00B843',
  backgroundColor = '#FFFFFF'
}) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor,
        borderRadius: Math.max(8, size * 0.2), // Responsive border radius
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Simple $ Dollar Sign */}
      <span 
        style={{
          color,
          fontSize: size * 0.6,
          fontWeight: 'bold',
          fontFamily: 'sans-serif'
        }}
      >
        $
      </span>
    </div>
  );
};

export default CashLogo; 