import { MainView } from './components/MainView';
import { UserTypeProvider } from './context/UserTypeContext';
import { EnvironmentProvider } from './environment/EnvironmentContext';
import { TextContentProvider } from './context/TextContentContext';

// Google Sheet ID for text content
const SHEET_ID = '1kiAX73XSDmlACPPlwFsYnEUuSLC2g9B9VlBDBmTRGKE';

export function App() {
  return (
    <EnvironmentProvider>
      <UserTypeProvider>
        <TextContentProvider sheetId={SHEET_ID}>
          <MainView />
        </TextContentProvider>
      </UserTypeProvider>
    </EnvironmentProvider>
  );
} 