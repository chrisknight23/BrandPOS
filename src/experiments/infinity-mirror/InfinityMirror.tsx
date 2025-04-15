import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface InfinityMirrorProps {
  /** Width of the container */
  width?: number;
  /** Height of the container */
  height?: number;
  /** Base color for the effect */
  color?: string;
  /** Number of frames to show at once */
  layers?: number;
  /** Maximum number of frames to generate in the sequence */
  maxLayers?: number;
  /** Whether animation is active */
  animate?: boolean;
  /** Animation speed (1 is default) */
  speed?: number;
  /** Line spacing (1 is default, higher means more space between lines) */
  spacing?: number;
  /** Border width in pixels */
  borderWidth?: number;
  /** Callback when animation completes */
  onAnimationComplete?: () => void;
}

export const InfinityMirror: React.FC<InfinityMirrorProps> = ({
  width = 800,
  height = 500,
  color = '#00D849',
  layers = 15,
  maxLayers = 100,
  animate = true,
  speed = 0.08,
  spacing = 1.4,
  borderWidth = 1.5,
  onAnimationComplete
}) => {
  // Use animation tick approach for smoother motion
  const [time, setTime] = useState(0);
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  
  // Calculate base scales for each layer
  const layerCount = layers + 1; // Add one extra to ensure smooth transitions
  
  // Animation loop using requestAnimationFrame for smooth continuous motion
  const animationLoop = (currentTime: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = currentTime - previousTimeRef.current;
      // Further reduce the speed multiplier for gentler animation
      setTime(prevTime => (prevTime + deltaTime * 0.0001 * speed) % maxLayers);
    }
    previousTimeRef.current = currentTime;
    requestRef.current = requestAnimationFrame(animationLoop);
  };
  
  // Start/stop animation loop based on animate prop
  useEffect(() => {
    if (animate) {
      requestRef.current = requestAnimationFrame(animationLoop);
      return () => {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
      };
    }
  }, [animate, speed]);
  
  // Render the frames
  const renderFrames = () => {
    // Create an array of frame positions
    return Array.from({ length: layerCount }, (_, i) => {
      // Calculate a position value from 0 to 1 that repeats
      // Add offset based on current time to create continuous motion
      const position = ((i / layerCount) + (time % 1)) % 1;
      
      // Scale decreases as position increases (0=largest, 1=smallest)
      // Apply spacing factor to create non-linear scaling
      const adjustedPosition = Math.pow(position, 1 / spacing);
      
      // Make the scaling more gentle - reduce the scale range
      const scale = 0.95 - (adjustedPosition * 0.75); // Scale from 0.95 to 0.2
      
      // Make opacity change more subtle too
      const opacity = 0.85 - (adjustedPosition * 0.55); // 0.85 to 0.3
      
      return {
        id: `frame-${i}-${Math.floor(time * 10)}`,
        position,
        adjustedPosition,
        scale,
        opacity,
        // Z-index ensures proper stacking (higher = in front)
        zIndex: layerCount - i
      };
    });
  };
  
  // Sort frames by position for proper rendering order
  const sortedFrames = renderFrames().sort((a, b) => a.position - b.position);
  
  return (
    <div 
      className="relative overflow-hidden"
      style={{
        width,
        height,
        perspective: '1200px',
      }}
    >
      {/* Background - black with subtle gradient */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: `radial-gradient(circle, rgba(0,0,0,0.8) 0%, rgba(0,0,0,1) 100%)`,
          boxShadow: 'inset 0 0 50px rgba(0,0,0,0.8)',
        }}
      />
      
      {/* Container for animated frames */}
      <div className="relative w-full h-full">
        {sortedFrames.map(frame => {
          // Z position follows a curve from 0 (front) to -600 (back)
          const zPos = -600 * frame.adjustedPosition;
          
          return (
            <motion.div
              key={frame.id}
              className="absolute"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                border: `${borderWidth}px solid ${color}`,
                // Enhanced glow effect to make the green more vibrant
                boxShadow: `0 0 10px ${color}, inset 0 0 5px ${color}`,
                top: '50%',
                left: '50%',
                x: '-50%',
                y: '-50%',
                scale: frame.scale,
                opacity: frame.opacity,
                translateZ: zPos,
                zIndex: frame.zIndex,
                transformOrigin: 'center center',
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default InfinityMirror; 