import React, { createContext, useContext, useState, ReactNode } from 'react';
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

export const TextContentProvider: React.FC<TextContentProviderProps> = ({
  children,
  sheetId,
  sheetName
}) => {
  const [version, setVersion] = useState<1 | 2 | 3>(1);
  const { getText, loading, error } = useSheetContent({ sheetId, sheetName });

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