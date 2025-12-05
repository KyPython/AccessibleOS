import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppRouter from './AppRouter';
import LoginForm from '../Auth/LoginForm';
import Dashboard from '../Dashboard/Dashboard';
import TaskList from '../Tasks/TaskList';
// Update these imports if your files are named differently, e.g. TaskCreatePage.tsx, TaskDetailPage.tsx, TaskEditPage.tsx
import TaskCreatePage from '../Tasks/TaskCreatePage';
// Update the import path to match the actual file name and location
import TaskDetailPage from '../Tasks/TaskDetailPage';
import TaskEditPage from '../Tasks/TaskEditPage';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const RouterContainer: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppRouter />} />
        <Route
          path="/login"
          element={<LoginForm onToggleMode={() => {}} isSignUp={false} />}
        />
        <Route
          path="/register"
          element={<LoginForm onToggleMode={() => {}} isSignUp={true} />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <TaskList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/new"
          element={
            <ProtectedRoute>
              <TaskCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/:id"
          element={
            <ProtectedRoute>
              <TaskDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/:id/edit"
          element={
            <ProtectedRoute>
              <TaskEditPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouterContainer;
