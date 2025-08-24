import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import RouterContainer from './components/AppRouter/Router';
import { AuthProvider } from './contexts/AuthContext';
import { NavigationProvider } from './contexts/NavigationContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <NavigationProvider>
        <RouterContainer />
      </NavigationProvider>
    </AuthProvider>
  </StrictMode>
);
