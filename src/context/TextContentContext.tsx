import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useSheetContent } from '../hooks/useSheetContent';
import { TextContentVersion } from '../types/textContent';

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

const STORAGE_KEY = 'textContentVersion';

export const TextContentProvider: React.FC<TextContentProviderProps> = ({
  children,
  sheetId = '1kiAX73XSDmlACPPlwFsYnEUuSLC2g9B9VlBDBmTRGKE', // Default sheet ID
  sheetName
}) => {
  // Initialize version from localStorage or default to 1
  const [version, setVersionState] = useState<number>(() => {
    const savedVersion = localStorage.getItem(STORAGE_KEY);
    return savedVersion ? Number(savedVersion) : 1;
  });

  const { getText, getVersions, loading, error } = useSheetContent({ sheetId, sheetName });
  const versions = getVersions();

  // Update localStorage when version changes
  const setVersion = (newVersion: number) => {
    setVersionState(newVersion);
    localStorage.setItem(STORAGE_KEY, newVersion.toString());
  };

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