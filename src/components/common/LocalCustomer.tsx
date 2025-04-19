import React from 'react';

interface LocalCustomerProps {
  cashValue: string | number;
  profileImage: string | React.ReactNode;
  onClick?: () => void;
  className?: string;
}

/**
 * LocalCustomer component
 * Displays a cash value on the left and a profile image on the right.
 * Layout and style inspired by AnimatedLocalCashButton.
 */
export const LocalCustomer: React.FC<LocalCustomerProps> = ({
  cashValue,
  profileImage,
  onClick,
  className = '',
}) => {
  return (
    <button
      type="button"
      className={`flex items-center bg-transparent border border-white/20 rounded-full overflow-hidden focus:outline-none pr-2 gap-1 h-14 min-w-0 ${className}`}
      style={{ height: 56, minWidth: 0 }}
      onClick={onClick}
      tabIndex={0}
      aria-label={`Customer with $${cashValue}`}
    >
      {/* Left: Cash Value */}
      <div className="flex items-center h-full pl-6 min-w-0 overflow-hidden flex-1 gap-2">
        {/* Local Cash Icon */}
        <span className="flex items-center">
          <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g>
              <path fillRule="evenodd" clipRule="evenodd" d="M16.7045 9.62793L15.5257 10.5917C15.4186 10.6793 15.2726 10.6598 15.1947 10.5527C14.5911 9.81289 13.6557 9.3943 12.6335 9.3943C11.4936 9.3943 10.783 9.89077 10.783 10.5917C10.7635 11.1757 11.3184 11.4872 13.0229 11.8572C15.1752 12.3147 16.1584 13.2103 16.1584 14.7191C16.1584 16.6076 14.6194 17.9997 12.214 18.1554L11.9803 19.2749C11.9609 19.382 11.8635 19.4599 11.7467 19.4599H9.89615C9.7404 19.4599 9.63332 19.3138 9.66252 19.1678L9.95456 17.9218C8.76597 17.5811 7.80224 16.9191 7.24737 16.1112C7.17923 16.0041 7.1987 15.8678 7.29605 15.7899L8.58198 14.7873C8.68906 14.6997 8.84482 14.7289 8.92269 14.8359C9.60412 15.7899 10.6564 16.3545 11.9229 16.3545C13.0628 16.3545 13.9195 15.7997 13.9195 15.0014C13.9195 14.3881 13.4911 14.1058 12.0397 13.8041C9.56615 13.2687 8.58198 12.3536 8.58198 10.8448C8.58198 9.09253 10.0529 7.77836 12.2733 7.60314L12.5167 6.44472C12.5362 6.33764 12.6335 6.25977 12.7503 6.25977H14.5717C14.7177 6.25977 14.8345 6.39605 14.8053 6.54207L14.523 7.83677C15.477 8.12881 16.2567 8.65447 16.7435 9.30669C16.8213 9.40404 16.8019 9.55006 16.7045 9.62793Z" fill="white"/>
              <circle cx="12" cy="12.8594" r="11" stroke="white" strokeWidth="2"/>
            </g>
          </svg>
        </span>
        <span className="text-[18px] font-medium font-cash whitespace-nowrap text-white">
          {typeof cashValue === 'number' ? cashValue.toFixed(2) : cashValue}
        </span>
      </div>
      {/* Right: Profile Image */}
      <div className="w-10 h-10 flex items-center justify-center">
        {typeof profileImage === 'string' ? (
          <img
            src={profileImage}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border border-white/20"
            draggable={false}
          />
        ) : (
          profileImage
        )}
      </div>
    </button>
  );
};

export default LocalCustomer; 