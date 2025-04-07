import { useState, useEffect } from 'react';
import { PhysicsCard } from './PhysicsCard';
import { ThreeCard } from './ThreeCard';
import { MatterCard } from './MatterCard';

type PhysicsMode = 'framer' | 'three' | 'matter';

interface LocalPassExperimentProps {
  initialMode: PhysicsMode;
}

export const LocalPassExperiment = ({ initialMode }: LocalPassExperimentProps) => {
  const [mode, setMode] = useState<PhysicsMode>(initialMode);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  return (
    <div className="w-screen h-screen">
      {/* Physics implementations */}
      {mode === 'framer' && <PhysicsCard />}
      {mode === 'three' && <ThreeCard />}
      {mode === 'matter' && <MatterCard />}
    </div>
  );
}; 