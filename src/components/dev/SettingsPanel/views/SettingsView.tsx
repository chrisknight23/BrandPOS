import React from 'react';

const SettingsView: React.FC = () => (
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
  </div>
);

export default SettingsView; 