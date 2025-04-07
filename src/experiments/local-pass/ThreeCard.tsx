import { Canvas } from '@react-three/fiber';
import { Physics, usePlane, useBox } from '@react-three/cannon';
import { OrbitControls, RoundedBox, Center } from '@react-three/drei';
import { useState } from 'react';
import { Mesh } from 'three';

function Card({ position = [0, 5, 0] }: { position?: [number, number, number] }) {
  const [ref] = useBox<Mesh>(() => ({
    mass: 0.05,
    position,
    rotation: [-Math.PI / 6, Math.PI / 4, Math.PI / 6],
    args: [1.76, 2.22, 0.05],
    restitution: 0.98,
    friction: 0.02,
    angularDamping: 0.05,
    linearDamping: 0.01
  }));

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <Center>
        <RoundedBox args={[1.76, 2.22, 0.05]} radius={0.08} smoothness={6}>
          <meshPhysicalMaterial 
            color="#00B843"
            metalness={0.2}
            roughness={0.3}
            clearcoat={0.5}
            clearcoatRoughness={0.4}
            reflectivity={0.8}
            specularIntensity={0.8}
            toneMapped={false}
            transparent={false}
            opacity={1}
          />
        </RoundedBox>
      </Center>
    </mesh>
  );
}

function Ground() {
  const [ref] = usePlane<Mesh>(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -2, 0],
    restitution: 0.8,
    friction: 0.02
  }));

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#001707" />
    </mesh>
  );
}

export const ThreeCard = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <div className="w-screen h-screen">
      <div className="fixed top-4 left-4 flex gap-4 z-50">
        <button
          className="px-6 py-3 rounded-full text-white transition-colors bg-[#00D64F] hover:bg-[#00C048]"
          onClick={() => setIsAnimating(!isAnimating)}
        >
          {isAnimating ? 'Reset' : 'Drop'}
        </button>
      </div>
      <Canvas shadows camera={{ position: [4, 6, 6], fov: 45 }}>
        <color attach="background" args={['#001707']} />
        
        {/* Dramatic lighting setup */}
        <ambientLight intensity={0.2} />
        
        {/* Key light */}
        <directionalLight
          position={[5, 10, 5]}
          intensity={2}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        
        {/* Fill lights for green tint */}
        <pointLight
          position={[-5, 8, -5]}
          intensity={1.5}
          color="#a0ffc0"
        />
        <pointLight
          position={[0, 3, -8]}
          intensity={1}
          color="#80ff90"
        />

        <Physics gravity={[0, -8, 0]}>
          {isAnimating && <Card />}
          <Ground />
        </Physics>
        <OrbitControls />
      </Canvas>
    </div>
  );
}; 