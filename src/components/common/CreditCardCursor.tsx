import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface CreditCardCursorProps {
  active?: boolean;
  onTapComplete?: () => void;
}

/**
 * A component that follows the mouse cursor and displays a Cash App card.
 * The card rotates naturally based on screen position - opposite rotation on left vs right side.
 * Hides when near navigation elements.
 * Only visible when the active prop is true.
 * Hides the default cursor when active.
 * Sized to match a real credit card.
 */
export const CreditCardCursor: React.FC<CreditCardCursorProps> = ({ 
  active = true,
  onTapComplete
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cardRotation, setCardRotation] = useState(0);
  const [isTapping, setIsTapping] = useState(false);
  const [isNearNavigation, setIsNearNavigation] = useState(false);
  const tapTimeoutRef = useRef<number | null>(null);
  
  // Standard credit card dimensions in pixels (at 96 DPI)
  const CARD_WIDTH = 212;
  const CARD_HEIGHT = 134;
  
  // Add a style element to hide cursor when component is active
  useEffect(() => {
    // Create a style element to hide the cursor
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      body {
        cursor: ${active && !isNearNavigation ? 'none' : 'auto'} !important;
      }
    `;
    document.head.appendChild(styleElement);
    
    // Clean up the style element when component unmounts
    return () => {
      document.head.removeChild(styleElement);
    };
  }, [active, isNearNavigation]);
  
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      // Update mouse position
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Calculate rotation based on screen position and target the "Tap" text
      const screenCenterX = window.innerWidth / 2;
      const screenCenterY = window.innerHeight / 2;
      
      // Define where "Tap" text should be (top center)
      const tapPosition = { x: screenCenterX, y: 40 };
      
      // Calculate normalized position (-1 to 1) relative to screen center
      const normalizedX = (e.clientX - screenCenterX) / (window.innerWidth / 2);
      
      let rotation;
      
      // More aggressive rotation on left side to point chip toward "Tap"
      if (normalizedX < 0) {
        // On the left side - calculate angle to point chip toward "Tap"
        // The EMV chip is on the left side of the card
        const dx = tapPosition.x - e.clientX;
        const dy = tapPosition.y - e.clientY;
        
        // Calculate angle in degrees, then adjust because chip is on left side
        const angleInDegrees = Math.atan2(dy, dx) * (180 / Math.PI) - 90;
        
        // Smooth transition as we approach center
        const centerTransition = Math.abs(normalizedX);
        rotation = angleInDegrees * centerTransition;
        
        // Limit maximum rotation on left side
        rotation = Math.max(-80, Math.min(0, rotation));
      } else {
        // On the right side - keep the current natural rotation
        const maxRotation = 30; // Maximum degrees of rotation
        rotation = -normalizedX * maxRotation;
      }
      
      setCardRotation(rotation);
      
      // Check if cursor is near top or bottom navigation areas
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      
      // Card dimensions require generous safe margins
      const safeMarginVertical = CARD_HEIGHT + 30;
      const safeMarginHorizontal = CARD_WIDTH / 2 + 30;
      
      const isNearTop = e.clientY < safeMarginVertical;
      const isNearBottom = e.clientY > (viewportHeight - safeMarginVertical);
      const isNearLeftEdge = e.clientX < safeMarginHorizontal;
      const isNearRightEdge = e.clientX > (viewportWidth - safeMarginHorizontal);
      
      // Update state if near any navigation zone or edge
      setIsNearNavigation(isNearTop || isNearBottom || isNearLeftEdge || isNearRightEdge);
    };
    
    const handleMouseClick = () => {
      if (active && !isTapping && !isNearNavigation) {
        setIsTapping(true);
        
        // Reset the tapping state after animation completes
        tapTimeoutRef.current = window.setTimeout(() => {
          setIsTapping(false);
          if (onTapComplete) onTapComplete();
        }, 1500); // Match the total animation duration
      }
    };
    
    if (active) {
      window.addEventListener('mousemove', updateMousePosition);
      window.addEventListener('click', handleMouseClick);
    }
    
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('click', handleMouseClick);
      if (tapTimeoutRef.current) window.clearTimeout(tapTimeoutRef.current);
    };
  }, [active, isTapping, isNearNavigation, onTapComplete, CARD_WIDTH, CARD_HEIGHT]);
  
  // Don't render if not active or if near navigation areas
  if (!active || isNearNavigation) return null;
  
  // Calculate a slight tilt effect based on distance from top of screen
  const distanceFromTop = mousePosition.y / window.innerHeight;
  const tiltX = -20 + (distanceFromTop * 40); // Tilt back when near top, forward when near bottom
  
  // Calculate a side-to-side tilt effect based on horizontal position
  const distanceFromCenter = (mousePosition.x - window.innerWidth / 2) / (window.innerWidth / 2);
  const tiltY = distanceFromCenter * 15; // Tilt left or right based on position
  
  return (
    <div
      className="fixed pointer-events-none z-[9999]"
      style={{
        position: 'fixed',
        left: mousePosition.x,
        top: mousePosition.y,
        transform: 'translate(-50%, -50%)',
        perspective: '800px',
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        transformOrigin: 'center center',
        willChange: 'transform'
      }}
    >
      {/* 3D Card Container */}
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: `rotateZ(${cardRotation}deg) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          borderRadius: '10px',
          backgroundColor: '#333333',
          border: '1px solid #444444',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          transition: 'transform 0.15s ease-out'
        }}
      >
        {/* EMV Chip */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '13px',
            width: '45px',
            height: '45px',
            backgroundColor: 'white',
            borderRadius: '6px',
            border: '1px solid #DDDDDD',
            transform: `translateZ(4px)`,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            overflow: 'hidden'
          }}
        >
          {/* EMV Chip Lines */}
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'relative'
            }}
          >
            <div style={{ 
              position: 'absolute', 
              width: '200%', 
              height: '1px', 
              backgroundColor: '#CCCCCC',
              top: '40%',
              left: '-50%'
            }} />
            <div style={{ 
              position: 'absolute', 
              width: '200%', 
              height: '1px', 
              backgroundColor: '#CCCCCC',
              top: '60%',
              left: '-50%'
            }} />
            <div style={{ 
              position: 'absolute', 
              width: '1px', 
              height: '200%', 
              backgroundColor: '#CCCCCC',
              left: '40%',
              top: '-50%'
            }} />
            <div style={{ 
              position: 'absolute', 
              width: '1px', 
              height: '200%', 
              backgroundColor: '#CCCCCC',
              left: '60%',
              top: '-50%'
            }} />
          </div>
        </div>

        {/* Signature */}
        <div
          style={{
            position: 'absolute',
            bottom: '15px',
            right: '15px',
            width: '60px',
            height: '20px',
            transform: `translateZ(2px)`,
          }}
        >
          <svg width="60" height="20" viewBox="0 0 60 20" fill="none">
            <path
              d="M5 10C8 7 11 8 13 9C15 10 16 11 20 9C24 7 25 8 27 10C29 12 31 11 32 10"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Card Surface Light Effect */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.15) 100%)',
            transform: `translateZ(1px)`,
            pointerEvents: 'none'
          }}
        />
      </div>
    </div>
  );
};

export default CreditCardCursor; 