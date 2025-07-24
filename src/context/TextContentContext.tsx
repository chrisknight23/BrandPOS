import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useSheetContent } from '../hooks/useSheetContent';

interface TextContentContextType {
  getText: (messageKey: string) => string;
  version: 1 | 2 | 3;
  setVersion: (version: 1 | 2 | 3) => void;
  loading: boolean;
  error: string | null;
}

const TextContentContext = createContext<TextContentContextType>({
  getText: () => '',
  version: 1,
  setVersion: () => {},
  loading: true,
  error: null
});

export const useTextContent = () => useContext(TextContentContext);

interface TextContentProviderProps {
  children: ReactNode;
  sheetId: string;
  sheetName?: string;
}

const STORAGE_KEY = 'textContentVersion';

export const TextContentProvider: React.FC<TextContentProviderProps> = ({
  children,
  sheetId,
  sheetName
}) => {
  // Initialize version from localStorage or default to 1
  const [version, setVersionState] = useState<1 | 2 | 3>(() => {
    const savedVersion = localStorage.getItem(STORAGE_KEY);
    return savedVersion ? (Number(savedVersion) as 1 | 2 | 3) : 1;
  });

  const { getText, loading, error } = useSheetContent({ sheetId, sheetName });

  // Update localStorage when version changes
  const setVersion = (newVersion: 1 | 2 | 3) => {
    setVersionState(newVersion);
    localStorage.setItem(STORAGE_KEY, newVersion.toString());
  };

  const getTextForCurrentVersion = (messageKey: string): string => {
    return getText(messageKey, version);
  };

  return (
    <TextContentContext.Provider
      value={{
        getText: getTextForCurrentVersion,
        version,
        setVersion,
        loading,
        error
      }}
    >
      {children}
    </TextContentContext.Provider>
  );
}; 