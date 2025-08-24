import React, { createContext, useContext, useState } from 'react';

type ViewName =
  | 'landing'
  | 'login'
  | 'register'
  | 'dashboard'
  | 'tasks'
  | 'settings'
  | 'profile';

interface NavigationContextType {
  currentView: ViewName;
  setCurrentView: (view: ViewName) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

export const useNavigation = () => {
  const ctx = useContext(NavigationContext);
  if (!ctx)
    throw new Error('useNavigation must be used within NavigationProvider');
  return ctx;
};

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentView, setCurrentView] = useState<ViewName>('landing');

  return (
    <NavigationContext.Provider value={{ currentView, setCurrentView }}>
      {children}
    </NavigationContext.Provider>
  );
};

export default NavigationProvider;
