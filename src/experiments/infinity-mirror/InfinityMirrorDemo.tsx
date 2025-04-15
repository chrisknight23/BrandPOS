import React, { useState } from 'react';
import InfinityMirror from './InfinityMirror';

const InfinityMirrorDemo = () => {
  const [settings, setSettings] = useState({
    color: '#00D849',
    layers: 15,
    speed: 0.08,
    spacing: 1.4,
    borderWidth: 1.5,
    animate: true
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Infinity Mirror Experiment</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mirror container */}
        <div className="flex-1 bg-black rounded-lg overflow-hidden">
          <InfinityMirror 
            width={800}
            height={500}
            color={settings.color}
            layers={settings.layers}
            speed={settings.speed}
            spacing={settings.spacing}
            borderWidth={settings.borderWidth}
            animate={settings.animate}
          />
        </div>
        
        {/* Controls */}
        <div className="w-full lg:w-80 bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Controls</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Color</label>
              <input 
                type="color" 
                name="color" 
                value={settings.color}
                onChange={handleChange}
                className="w-full h-10"
              />
            </div>
            
            <div>
              <label className="block text-sm mb-1">
                Layers: {settings.layers}
              </label>
              <input 
                type="range" 
                name="layers"
                min="5" 
                max="30" 
                step="1"
                value={settings.layers}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm mb-1">
                Speed: {settings.speed.toFixed(2)}
              </label>
              <input 
                type="range" 
                name="speed"
                min="0.01" 
                max="0.5" 
                step="0.01"
                value={settings.speed}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm mb-1">
                Spacing: {settings.spacing.toFixed(1)}
              </label>
              <input 
                type="range" 
                name="spacing"
                min="1" 
                max="3" 
                step="0.1"
                value={settings.spacing}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm mb-1">
                Border Width: {settings.borderWidth.toFixed(1)}px
              </label>
              <input 
                type="range" 
                name="borderWidth"
                min="0.5" 
                max="3" 
                step="0.1"
                value={settings.borderWidth}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            
            <div className="flex items-center">
              <input 
                type="checkbox" 
                name="animate"
                checked={settings.animate}
                onChange={handleChange}
                className="mr-2 h-4 w-4"
              />
              <label className="text-sm">Animate</label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Current Settings</h2>
        <pre className="bg-gray-800 p-4 rounded-lg text-sm overflow-auto">
          {JSON.stringify(settings, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default InfinityMirrorDemo; 