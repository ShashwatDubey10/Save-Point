import { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import BackendWakeUpIndicator from './components/BackendWakeUpIndicator';

// Lazy load all pages for better code splitting
const LandingPage = lazy(() => import('./pages/LandingPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const HabitsPage = lazy(() => import('./pages/HabitsPage'));
const StreaksPage = lazy(() => import('./pages/StreaksPage'));
const LevelsPage = lazy(() => import('./pages/LevelsPage'));
const TasksPage = lazy(() => import('./pages/TasksPage'));
const NotesPage = lazy(() => import('./pages/NotesPage'));
const CalendarPage = lazy(() => import('./pages/CalendarPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

// Enhanced loading fallback component with backend status
const LoadingFallback = () => {
  const [loadingMessage, setLoadingMessage] = useState('Loading...');
  const [showSlowMessage, setShowSlowMessage] = useState(false);

  useEffect(() => {
    // Show "slow loading" message after 3 seconds
    const slowTimer = setTimeout(() => {
      setLoadingMessage('Backend might be waking up...');
      setShowSlowMessage(true);
    }, 3000);

    // Show more detailed message after 8 seconds
    const detailTimer = setTimeout(() => {
      setLoadingMessage('This is taking longer than usual. Please wait...');
    }, 8000);

    return () => {
      clearTimeout(slowTimer);
      clearTimeout(detailTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-300 font-medium mb-2">{loadingMessage}</p>
        {showSlowMessage && (
          <p className="text-gray-500 text-sm max-w-xs mx-auto">
            Free tier servers sleep after inactivity. First load may take 30-60 seconds.
          </p>
        )}
      </div>
    </div>
  );
};

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingFallback />;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route - redirect to dashboard if already logged in
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingFallback />;
  }

  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/habits" element={<ProtectedRoute><HabitsPage /></ProtectedRoute>} />
        <Route path="/streaks" element={<ProtectedRoute><StreaksPage /></ProtectedRoute>} />
        <Route path="/levels" element={<ProtectedRoute><LevelsPage /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
        <Route path="/notes" element={<ProtectedRoute><NotesPage /></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        <BackendWakeUpIndicator />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1f2937',
              color: '#fff',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '12px',
              padding: '16px',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </AuthProvider>
    </Router>
  );
}

export default App;
