import React from 'react';
import { useTab } from './TabContext';

const tabList = [
  { key: 'interaction', label: 'Interaction' },
  { key: 'analytics', label: 'Analytics' },
  { key: 'changelog', label: 'Changelog' },
  { key: 'settings', label: 'Settings' },
];

const Tabs: React.FC = () => {
  const { activeTab, setActiveTab } = useTab();
  return (
    <div className="flex border-b border-gray-700 bg-gray-900 rounded-t-xl">
      {tabList.map(tab => (
        <button
          key={tab.key}
          className={`px-4 py-2 font-medium focus:outline-none transition-colors ${
            activeTab === tab.key
              ? 'border-b-2 border-blue-500 text-blue-500 bg-gray-800'
              : 'text-white/60 hover:text-white'
          }`}
          onClick={() => setActiveTab(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs; 