import { MainView } from './components/MainView';
import { UserTypeProvider } from './context/UserTypeContext';

export function App() {
  return (
    <UserTypeProvider>
      <MainView />
    </UserTypeProvider>
  );
} 