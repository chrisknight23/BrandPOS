import React from 'react';

const ResearchView: React.FC = () => (
  <div className="flex flex-col h-full w-full">
    <div className="flex-1" />
    <button
      className="w-full rounded-full py-4 flex items-center justify-center bg-white/5 hover:bg-white/10 active:bg-white/15 transition-colors text-white font-medium mt-auto"
    >
      Upload
    </button>
  </div>
);

export default ResearchView; 