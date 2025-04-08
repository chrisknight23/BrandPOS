import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { LocalPassExperiment } from './local-pass/LocalPassExperiment';
import { AnimatingNumberExperiment } from './animating-number/AnimatingNumberExperiment';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';

type ExperimentType = 'local-pass' | 'animating-number';
type PhysicsMode = 'framer' | 'three' | 'matter';

const EXPERIMENTS: Record<ExperimentType, string> = {
  'local-pass': 'Local Pass',
  'animating-number': 'Animating Number'
};

const MODES: Record<PhysicsMode, string> = {
  'framer': 'Framer Motion',
  'three': 'Three.js',
  'matter': 'Matter.js'
};

const ExperimentsRoot = () => {
  const [currentExperiment, setCurrentExperiment] = useState<ExperimentType>('local-pass');
  const [isExperimentOpen, setIsExperimentOpen] = useState(false);
  const [physicsMode, setPhysicsMode] = useState<PhysicsMode>('framer');
  const [isPhysicsOpen, setIsPhysicsOpen] = useState(false);

  return (
    <div className="relative w-screen h-screen bg-[#001707]">
      {/* Top bar with simple structure */}
      <div className="fixed top-4 right-4 flex gap-4 z-50">
        {/* Physics Mode selector only shown for LocalPass */}
        {currentExperiment === 'local-pass' && (
          <div className="relative">
            <button
              className="px-6 py-3 rounded-full text-[#00D64F] transition-colors bg-white/10 hover:bg-white/15 flex items-center gap-2 cursor-pointer"
              onClick={() => {
                setIsPhysicsOpen(!isPhysicsOpen);
                // Close experiment dropdown if physics is opening
                if (!isPhysicsOpen) setIsExperimentOpen(false);
              }}
            >
              {MODES[physicsMode]}
              <svg 
                width="10" 
                height="6" 
                viewBox="0 0 10 6" 
                fill="none"
                className={`transition-transform ${isPhysicsOpen ? 'rotate-180' : ''}`}
              >
                <path d="M1 1L5 5L9 1" stroke="#00D64F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <AnimatePresence>
              {isPhysicsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-2 bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden min-w-full"
                >
                  {Object.entries(MODES).map(([key, label]) => (
                    <button
                      key={key}
                      className={`w-full px-6 py-3 text-left transition-colors hover:bg-white/5 cursor-pointer ${
                        physicsMode === key ? 'text-[#00D64F]' : 'text-white'
                      }`}
                      onClick={() => {
                        setPhysicsMode(key as PhysicsMode);
                        setIsPhysicsOpen(false);
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Experiment selector */}
        <div className="relative">
          <button
            className="px-6 py-3 rounded-full text-[#00D64F] transition-colors bg-white/10 hover:bg-white/15 flex items-center gap-2 cursor-pointer"
            onClick={() => {
              setIsExperimentOpen(!isExperimentOpen);
              // Close physics dropdown if experiment is opening
              if (!isExperimentOpen) setIsPhysicsOpen(false);
            }}
          >
            {EXPERIMENTS[currentExperiment]}
            <svg 
              width="10" 
              height="6" 
              viewBox="0 0 10 6" 
              fill="none"
              className={`transition-transform ${isExperimentOpen ? 'rotate-180' : ''}`}
            >
              <path d="M1 1L5 5L9 1" stroke="#00D64F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <AnimatePresence>
            {isExperimentOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full right-0 mt-2 bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden min-w-full"
              >
                {Object.entries(EXPERIMENTS).map(([key, label]) => (
                  <button
                    key={key}
                    className={`w-full px-6 py-3 text-left transition-colors hover:bg-white/5 cursor-pointer ${
                      currentExperiment === key ? 'text-[#00D64F]' : 'text-white'
                    }`}
                    onClick={() => {
                      setCurrentExperiment(key as ExperimentType);
                      setIsExperimentOpen(false);
                    }}
                  >
                    {label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Current experiment */}
      {currentExperiment === 'local-pass' && <LocalPassExperiment initialMode={physicsMode} />}
      {currentExperiment === 'animating-number' && <AnimatingNumberExperiment />}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ExperimentsRoot />
  </React.StrictMode>
); 