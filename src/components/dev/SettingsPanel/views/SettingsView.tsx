import React from 'react';
import { useTextContent } from '../../../../context/TextContentContext';

const SettingsView: React.FC = () => {
  const { version, setVersion } = useTextContent();

  return (
    <div className="w-full h-full text-white flex flex-col">
      {/* Header title and sub copy */}
      <div className="pb-1">
        <h2 className="text-white text-[24px] font-cash font-semibold mb-2">
          Settings
        </h2>
        <div className="relative">
          <p className="text-white/60 text-sm line-clamp-3">
            Manage your app preferences, enable or disable experimental features, and customize your experience. Changes here affect how the app behaves and looks for your current session.
          </p>
        </div>
      </div>

      {/* Settings sections */}
      <div className="mt-6 space-y-6">
        {/* Text Content Version */}
        <div className="space-y-2">
          <h3 className="text-white/80 text-sm font-medium">Text Content Version</h3>
          <select
            value={version}
            onChange={(e) => setVersion(Number(e.target.value) as 1 | 2 | 3)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white/40"
          >
            <option value={1}>Version 1</option>
            <option value={2}>Version 2</option>
            <option value={3}>Version 3</option>
          </select>
          <p className="text-white/40 text-xs">
            Switch between different text content versions from the Google Sheet.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsView; 