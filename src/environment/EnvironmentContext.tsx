import React, { createContext, useContext, useState, ReactNode } from 'react';

export type EnvironmentType = 'POS' | 'iOS' | 'Web';

interface EnvironmentContextValue {
  environment: EnvironmentType;
  setEnvironment: (env: EnvironmentType) => void;
}

const EnvironmentContext = createContext<EnvironmentContextValue | undefined>(undefined);

export const EnvironmentProvider = ({ children }: { children: ReactNode }) => {
  const [environment, setEnvironment] = useState<EnvironmentType>('POS');
  return (
    <EnvironmentContext.Provider value={{ environment, setEnvironment }}>
      {children}
    </EnvironmentContext.Provider>
  );
};

export const useEnvironment = () => {
  const context = useContext(EnvironmentContext);
  if (!context) {
    throw new Error('useEnvironment must be used within an EnvironmentProvider');
  }
  return context;
}; 