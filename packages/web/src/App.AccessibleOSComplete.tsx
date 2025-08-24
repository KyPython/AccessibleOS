import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import LoginForm from './components/Auth/LoginForm';
import Dashboard from './components/Dashboard/Dashboard';
import TaskList from './components/Tasks/TaskList';
import Analytics from './components/Analytics/Analytics';
import UserProfile from './components/Profile/UserProfile';
import AccessibilitySettings from './components/Settings/AccessibilitySettings';
import Sidebar from './components/Navigation/Sidebar';
import TopBar from './components/Navigation/TopBar';
import './index.css';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  if (!user) {
    return (
      <LoginForm 
        onToggleMode={() => setIsSignUp(!isSignUp)}
        isSignUp={isSignUp}
      />
    );
  }

  const getViewTitle = (view: string) => {
    switch (view) {
      case 'dashboard': return 'Dashboard';
      case 'tasks': return 'Tasks';
      case 'analytics': return 'Analytics';
      case 'profile': return 'Profile';
      case 'settings': return 'Accessibility Settings';
      case 'notifications': return 'Notifications';
      default: return 'AccessibleOS';
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <TaskList />;
      case 'analytics':
        return <Analytics />;
      case 'profile':
        return <UserProfile />;
      case 'settings':
        return <AccessibilitySettings />;
      case 'notifications':
        return (
          <div style={{ padding: '2rem' }}>
            <h2 className="heading-3">Notifications</h2>
            <p className="body-base text-muted">Notification management coming soon...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-layout" style={{ display: 'flex', minHeight: '100vh' }}>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <div className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <TopBar
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          title={getViewTitle(currentView)}
        />
        
        <main 
          id="main-content"
          className="content-area" 
          style={{ flex: 1, overflow: 'auto' }}
          role="main"
          aria-label={`${getViewTitle(currentView)} content`}
        >
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AccessibilityProvider>
        <AppContent />
      </AccessibilityProvider>
    </AuthProvider>
  );
}

export default App;