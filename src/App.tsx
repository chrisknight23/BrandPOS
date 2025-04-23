import { MainView } from './components/MainView';
import { UserTypeProvider } from './context/UserTypeContext';
import { EnvironmentProvider } from './environment/EnvironmentContext';

export function App() {
  return (
    <EnvironmentProvider>
      <UserTypeProvider>
        <MainView />
      </UserTypeProvider>
    </EnvironmentProvider>
  );
} 