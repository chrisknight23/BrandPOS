import React from 'react';
import { motion } from 'framer-motion';
import { useTextContent } from '../../../context/TextContentContext';
import { Button } from '../../ui/Button';

interface PWASettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWASettingsDrawer: React.FC<PWASettingsDrawerProps> = ({
  isOpen,
  onClose
}) => {
  const { version, setVersion, versions } = useTextContent();

  return (
    <motion.div
      className={`fixed top-0 right-0 h-full bg-[#181818]/95 backdrop-blur-lg border-l border-white/10 z-[10003] flex flex-col`}
      initial={{ width: 0, opacity: 0 }}
      animate={{
        width: isOpen ? 320 : 0,
        opacity: isOpen ? 1 : 0
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30
      }}
    >
      {isOpen && (
        <motion.div
          className="flex flex-col h-full p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-[24px] font-cash font-semibold">
              Content Version
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/15 transition-colors"
              aria-label="Close settings"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Version Selector */}
          <div className="space-y-4">
            <div className="relative">
              <Button
                variant="secondary"
                className="w-full justify-between"
                iconRight={
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M2 3L4 5L6 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                }
              >
                {versions.find(v => v.id === version)?.name || `Version ${version}`}
              </Button>
              <select
                value={version}
                onChange={(e) => setVersion(Number(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-pointer w-full"
              >
                {versions.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
            <p className="text-white/40 text-sm">
              Select the content version to use for this display.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}; 