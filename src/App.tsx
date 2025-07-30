import { MainView } from './components/MainView';
import { PwaSettingsDrawer } from './components/pwa/PwaSettingsDrawer';
import { UserTypeProvider } from './context/UserTypeContext';
import { EnvironmentProvider } from './environment/EnvironmentContext';
import { TextContentProvider } from './context/TextContentContext';
import { type ReactNode } from 'react';

// Google Sheet ID for text content
const SHEET_ID = '1kiAX73XSDmlACPPlwFsYnEUuSLC2g9B9VlBDBmTRGKE';

export function App() {
  return (
    <EnvironmentProvider>
      <UserTypeProvider>
        <TextContentProvider sheetId={SHEET_ID}>
          <PwaSettingsDrawer>
            <MainView />
          </PwaSettingsDrawer>
        </TextContentProvider>
      </UserTypeProvider>
    </EnvironmentProvider>
  );
} 