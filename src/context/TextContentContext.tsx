import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useSheetContent } from '../hooks/useSheetContent';
import { TextContentVersion } from '../types/textContent';
import { useIsPWA } from '../hooks/useIsPWA';

interface TextContentContextType {
  version: number;
  setVersion: (version: number) => void;
  getText: (messageKey: string) => string;
  versions: TextContentVersion[];
}

const TextContentContext = createContext<TextContentContextType | undefined>(undefined);

interface TextContentProviderProps {
  children: ReactNode;
  sheetId?: string;
  sheetName?: string;
}

// Storage keys for different contexts
const STORAGE_KEYS = {
  PWA: 'pwa_text_content_version',
  BROWSER: 'browser_text_content_version'
};

export const TextContentProvider: React.FC<TextContentProviderProps> = ({
  children,
  sheetId = '1kiAX73XSDmlACPPlwFsYnEUuSLC2g9B9VlBDBmTRGKE', // Default sheet ID
  sheetName
}) => {
  const isPWA = useIsPWA();
  const storageKey = isPWA ? STORAGE_KEYS.PWA : STORAGE_KEYS.BROWSER;

  // Initialize version from localStorage or default to 1
  const [version, setVersionState] = useState<number>(() => {
    const savedVersion = localStorage.getItem(storageKey);
    console.log(`TextContent: Initializing with ${isPWA ? 'PWA' : 'browser'} storage key: ${storageKey}, saved version: ${savedVersion}`);
    return savedVersion ? Number(savedVersion) : 1;
  });

  const { getText, getVersions, loading, error } = useSheetContent({ sheetId, sheetName });
  const versions = getVersions();

  // Update localStorage when version changes
  const setVersion = (newVersion: number) => {
    console.log(`TextContent: Setting version to ${newVersion} with ${isPWA ? 'PWA' : 'browser'} storage key: ${storageKey}`);
    setVersionState(newVersion);
    localStorage.setItem(storageKey, newVersion.toString());
  };

  // Effect to handle PWA mode changes
  useEffect(() => {
    const currentVersion = localStorage.getItem(storageKey);
    console.log(`TextContent: PWA mode changed, current version: ${currentVersion}, storage key: ${storageKey}`);
    if (currentVersion) {
      setVersionState(Number(currentVersion));
    }
  }, [isPWA, storageKey]);

  const getTextForCurrentVersion = (messageKey: string): string => {
    return getText(messageKey, version);
  };

  const value = {
    version,
    setVersion,
    getText: getTextForCurrentVersion,
    versions
  };

  return (
    <TextContentContext.Provider value={value}>
      {children}
    </TextContentContext.Provider>
  );
};

export const useTextContent = () => {
  const context = useContext(TextContentContext);
  if (context === undefined) {
    throw new Error('useTextContent must be used within a TextContentProvider');
  }
  return context;
}; 