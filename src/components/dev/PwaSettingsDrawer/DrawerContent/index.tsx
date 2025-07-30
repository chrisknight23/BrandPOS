import { useCallback } from 'react';
import { useTextContent } from '../../../../context/TextContentContext';
import { Button } from '../../../ui/Button';

interface DrawerContentProps {
  isVisible: boolean;
  onClose: () => void;
}

export const DrawerContent: React.FC<DrawerContentProps> = ({ isVisible, onClose }) => {
  const { version, setVersion, versions } = useTextContent();
  
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity ${
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleBackdropClick}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[400px] bg-[#181818] shadow-lg transform transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-modal="true"
        role="dialog"
        aria-label="Settings drawer"
      >
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[24px] text-white font-cash font-semibold">Global Settings</h2>
            <button
              onClick={onClose}
              className="p-2 text-white/60 hover:text-white"
              aria-label="Close settings"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="text-white/60 text-sm mb-6">
            Manage your app preferences, enable or disable experimental features, and customize your experience. Changes here affect how the app behaves and looks for your current session.
          </div>

          <div className="w-full h-px bg-white/10 mb-6" />

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
            <p className="text-white/40 text-xs">
              Use <a href="https://docs.google.com/spreadsheets/d/1kiAX73XSDmlACPPlwFsYnEUuSLC2g9B9VlBDBmTRGKE/edit?pli=1&gid=0#gid=0" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">this Google Sheet</a> to manage the content for each screen. Any edits you make will dynamically update the site, making it easy to test copy directly within the design.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};