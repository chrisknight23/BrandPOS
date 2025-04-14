import { LocalPass, CardState } from '../../components/common/LocalPass';
import { useEffect, useState, useCallback, useRef } from 'react';
import { BaseScreen } from '../../components/common/BaseScreen/index';
import cashBackAnimation from '../../assets/CashBackLogo.json';
import CashAppLogo from '../../assets/images/CashApplogo.svg';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

// Lighting effects component for Three.js
const EnvironmentalLighting: React.FC<{ isFlipped: boolean }> = ({ isFlipped }) => {
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const secondaryLightRef = useRef<THREE.DirectionalLight>(null);
  
  // Update lighting based on flip state
  useFrame(() => {
    if (lightRef.current && secondaryLightRef.current) {
      // Moving primary light based on card flip state
      // When card flips, move light to simulate environment changing
      if (isFlipped) {
        // Light positions for back side of card
        lightRef.current.position.x = THREE.MathUtils.lerp(lightRef.current.position.x, -3, 0.05);
        lightRef.current.position.y = THREE.MathUtils.lerp(lightRef.current.position.y, 2, 0.05);
        lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, 1.2, 0.05);
        
        secondaryLightRef.current.position.x = THREE.MathUtils.lerp(secondaryLightRef.current.position.x, 4, 0.05);
        secondaryLightRef.current.intensity = THREE.MathUtils.lerp(secondaryLightRef.current.intensity, 0.8, 0.05);
      } else {
        // Light positions for front side of card
        lightRef.current.position.x = THREE.MathUtils.lerp(lightRef.current.position.x, 3, 0.05);
        lightRef.current.position.y = THREE.MathUtils.lerp(lightRef.current.position.y, 3, 0.05);
        lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, 1.5, 0.05);
        
        secondaryLightRef.current.position.x = THREE.MathUtils.lerp(secondaryLightRef.current.position.x, -3, 0.05);
        secondaryLightRef.current.intensity = THREE.MathUtils.lerp(secondaryLightRef.current.intensity, 0.6, 0.05);
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        ref={lightRef}
        position={[3, 3, 5]}
        intensity={1.5}
        color="#ffffff"
      />
      <directionalLight
        ref={secondaryLightRef}
        position={[-3, -2, 5]}
        intensity={0.6}
        color="#d0d0ff" // Slightly blue tint for secondary light
      />
      {/* Environment for realistic reflections */}
      <Environment preset="sunset" />
    </>
  );
};

interface CashbackProps {
  onNext: (amount?: string) => void;
  amount?: string;
}

export const Cashback = ({ onNext, amount = "1" }: CashbackProps) => {
  const [cardState, setCardState] = useState<CardState>('expanded');
  // Track whether we're currently transitioning states
  const [isTransitioning, setIsTransitioning] = useState(false);
  // State to control logo visibility
  const [showLogo, setShowLogo] = useState(false);
  // Track if card is flipped for lighting effects
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  
  // Force an explicit reset when entering the screen
  useEffect(() => {
    console.log(`Cashback: Component mounted with tip amount ${amount}`);
    
    // Reset to expanded state on mount
    setCardState('expanded');
    setIsTransitioning(false);
    setShowLogo(false);
    setIsCardFlipped(false);
    
    return () => {
      console.log('Cashback: Component unmounting');
    };
  }, [amount]);

  const handleNextClick = () => {
    console.log('Cashback: Next clicked, navigating to next screen');
    onNext();
  };
  
  // Handle state changes from the card animation
  const handleStateChange = (newState: CardState) => {
    console.log(`Cashback: Card state changed to ${newState}`);
    
    if (newState !== cardState) {
      setIsTransitioning(true);
    }
    
    // Show the logo when the card reaches the initial state
    if (newState === 'initial') {
      // Wait a moment after the card reaches initial state to show logo
      setTimeout(() => {
        setShowLogo(true);
      }, 500);
    }
  };
  
  // Handle flip state changes
  const handleFlip = (isFlipped: boolean) => {
    console.log(`Cashback: Card flip state changed to ${isFlipped}`);
    setIsCardFlipped(isFlipped);
  };
  
  // Handle animation completion and state changes
  const handleAnimationComplete = useCallback(() => {
    console.log('Cashback: Animation completed, transitioning to initial state');
    
    // Allow a short delay to ensure animations complete properly
    setTimeout(() => {
      // Set to initial state
      setCardState('initial');
      // Mark transition as complete
      setIsTransitioning(false);
    }, 50);
  }, []);
  
  // For debugging
  useEffect(() => {
    console.log(`Current card state: ${cardState}, transitioning: ${isTransitioning}, logo: ${showLogo}`);
  }, [cardState, isTransitioning, showLogo]);

  return (
    <BaseScreen onNext={onNext}>
      {/* Main container for the device frame - everything must stay within this boundary */}
      <motion.div 
        className="w-[800px] h-[500px] relative overflow-hidden rounded-[4px] border border-white/20"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 1 }}
      >
        <motion.div 
          className="w-full h-full bg-black relative overflow-hidden flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
        >
          {/* Three.js canvas for environmental lighting */}
          <div className="absolute inset-0 pointer-events-none">
            <Canvas 
              camera={{ position: [0, 0, 10], fov: 45 }}
              gl={{ alpha: true }}
              style={{ background: 'transparent' }}
            >
              <EnvironmentalLighting isFlipped={isCardFlipped} />
              {/* No meshes needed - we're just using the lighting effects */}
            </Canvas>
          </div>
          
          <LocalPass
            amount={amount}
            initialState={cardState}
            isExpanded={cardState === 'expanded'}
            onClick={handleNextClick}
            onStateChange={handleStateChange}
            onFlip={handleFlip}
            lottieAnimation={cashBackAnimation}
            noAnimation={false}
            useRandomValues={false}
            headerText="Local Cash"
            subheaderText=""
            buttonText="Cash Out"
            onAnimationComplete={handleAnimationComplete}
            autoPlay={true}
            animationDelay={500}
          />
          
          {/* Cash App Logo in bottom left corner - only shown after card animation completes */}
          <AnimatePresence>
            {showLogo && (
              <motion.div 
                className="absolute bottom-8 left-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <img src={CashAppLogo} alt="Cash App" width={100} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </BaseScreen>
  );
}; 