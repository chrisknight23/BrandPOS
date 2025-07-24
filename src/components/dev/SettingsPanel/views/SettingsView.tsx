import React from 'react';
import { useTextContent } from '../../../../context/TextContentContext';
import { Button } from '../../../ui/Button';

const SettingsView: React.FC = () => {
  const { version, setVersion } = useTextContent();

  return (
    <div className="w-full h-full text-white flex flex-col">
      {/* Header title and sub copy */}
      <div className="pb-6">
        <h2 className="text-white text-[24px] font-cash font-semibold mb-2">
          Global Settings
        </h2>
        <div className="relative">
          <p className="text-white/60 text-sm line-clamp-3">
            Manage your app preferences, enable or disable experimental features, and customize your experience. Changes here affect how the app behaves and looks for your current session.
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-white/10 mb-6" />

      {/* Settings sections */}
      <div className="space-y-6">
        {/* Text Content Version */}
        <div className="space-y-2">
          <h3 className="text-white/80 text-sm font-medium">Content versioning</h3>
          <div className="relative">
            <Button
              variant="secondary"
              className="w-full justify-between"
              iconRight={
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 8 8"
                  fill="none"
                >
                  <path
                    d="M2 3L4 5L6 3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            >
              Version {version}
            </Button>
            <select
              value={version}
              onChange={(e) => setVersion(Number(e.target.value) as 1 | 2 | 3)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full"
            >
              <option value={1}>Version 1</option>
              <option value={2}>Version 2</option>
              <option value={3}>Version 3</option>
            </select>
          </div>
          <p className="text-white/40 text-xs">
            Use <a href="https://docs.google.com/spreadsheets/d/1kiAX73XSDmlACPPlwFsYnEUuSLC2g9B9VlBDBmTRGKE/edit?pli=1&gid=0#gid=0" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">this Google Sheet</a> to manage the content for each screen. Any edits you make will dynamically update the site, making it easy to test copy directly within the design.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsView; 