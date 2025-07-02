import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Test component for 3D card movement with dynamic lighting
 * 
 * This recreates the effect from react-animated-3d-card but with:
 * - Automatic movement (no cursor interaction)
 * - Dynamic gradient lighting that follows the card movement
 * - Continuous gentle 3D rotation
 */
export const Test3DCard: React.FC = () => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [lightX, setLightX] = useState(50);
  const [lightY, setLightY] = useState(50);

  useEffect(() => {
    let animationFrame: number;
    let startTime = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000; // seconds
      
      // Create smooth, continuous movement using sine waves - reduced movement
      const newRotateX = Math.sin(elapsed * 0.5) * 8; // ±8 degrees on X axis (reduced from 15)
      const newRotateY = Math.cos(elapsed * 0.4) * 10; // ±10 degrees on Y axis (reduced from 20)
      
      // Calculate light position based on rotation - reduced range
      // Map rotation to light position (0-100%)
      const newLightX = 50 + (newRotateY / 10) * 15; // 35-65% (reduced from 20-80%)
      const newLightY = 50 + (newRotateX / 8) * 15; // 35-65% (reduced from 20-80%)
      
      setRotateX(newRotateX);
      setRotateY(newRotateY);
      setLightX(newLightX);
      setLightY(newLightY);
      
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="relative">
        {/* 3D Card Container */}
        <motion.div
          className="relative w-[300px] h-[400px] rounded-2xl overflow-hidden"
          style={{
            perspective: '1000px',
            transformStyle: 'preserve-3d',
          }}
          animate={{
            rotateX: rotateX,
            rotateY: rotateY,
          }}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 25,
            mass: 0.8
          }}
        >
          {/* Card Background with Dynamic Gradient */}
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: `
                radial-gradient(
                  circle at ${lightX}% ${lightY}%, 
                  rgba(255, 255, 255, 0.15) 0%, 
                  rgba(255, 255, 255, 0.05) 40%, 
                  transparent 70%
                ),
                linear-gradient(135deg, #5D5D3F 0%, #4A4A32 100%)
              `,
              boxShadow: `
                0 ${rotateX * 0.3}px ${Math.abs(rotateX) * 1.5 + 15}px rgba(0, 0, 0, 0.2),
                0 0 30px rgba(255, 255, 255, 0.05)
              `,
              borderTop: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          />
          
          {/* Card Content */}
          <div className="absolute inset-0 p-8 flex flex-col items-center justify-center text-white">
            <h1 className="text-4xl font-bold mb-4">$mileendbagel</h1>
            <p className="text-lg opacity-80">3D Test Card</p>
            
            {/* Debug Info */}
            <div className="absolute bottom-4 left-4 text-xs opacity-60">
              <div>X: {rotateX.toFixed(1)}°</div>
              <div>Y: {rotateY.toFixed(1)}°</div>
              <div>Light: {lightX.toFixed(0)}%, {lightY.toFixed(0)}%</div>
            </div>
          </div>
          
          {/* Highlight Effect */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: `
                linear-gradient(
                  ${Math.atan2(rotateX, rotateY) * 180 / Math.PI + 45}deg,
                  transparent 0%,
                  rgba(255, 255, 255, 0.06) 50%,
                  transparent 100%
                )
              `,
              opacity: Math.abs(rotateX) + Math.abs(rotateY) > 3 ? 0.3 : 0.1
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}; 