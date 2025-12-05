import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { AccessibilitySettings } from './components/AccessibilitySettings';
import { Help } from './components/Help';
import { SkipLink } from './components/Layout/SkipLink';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <SkipLink href="#main-content">Skip to main content</SkipLink>
        
        <header role="banner">
          <nav role="navigation" aria-label="Main navigation">
            <Link to="/" className="logo">AccessibleOS</Link>
            <ul className="nav-list">
              <li><Link to="/">Tasks</Link></li>
              <li><Link to="/settings">Settings</Link></li>
              <li><Link to="/help">Help</Link></li>
            </ul>
          </nav>
        </header>

        <main id="main-content" role="main">
          <Routes>
            <Route path="/" element={<TaskList />} />
            <Route path="/tasks/new" element={<TaskForm />} />
            <Route path="/tasks/:id/edit" element={<TaskForm />} />
            <Route path="/settings" element={<AccessibilitySettings />} />
            <Route path="/help" element={<Help />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer role="contentinfo">
          <p>AccessibleOS - Built with accessibility in mind</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;

