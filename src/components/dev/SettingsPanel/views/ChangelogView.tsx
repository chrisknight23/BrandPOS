import React from 'react';

const ChangelogView: React.FC = () => (
  <div className="w-full h-full text-white flex flex-col">
    {/* Header title and sub copy */}
    <div className="pb-1">
      <h2 className="text-white text-[24px] font-cash font-semibold mb-2">
        Changelog
      </h2>
      <div className="relative">
        <p className="text-white/60 text-sm line-clamp-3">
          Review recent changes, updates, and release notes for this app. Use this tab to stay up to date with the latest features, bug fixes, and improvements.
        </p>
      </div>
    </div>
  </div>
);

export default ChangelogView; 