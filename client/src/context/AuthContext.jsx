import { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { authService } from '../services/authService';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for existing session on mount
    const storedUser = authService.getStoredUser();
    if (storedUser && authService.getToken()) {
      setUser(storedUser);
      // Verify token is still valid
      authService.getMe()
        .then((data) => {
          setUser(data.user);
        })
        .catch(() => {
          // Token invalid, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    setError(null);
    try {
      const data = await authService.register(userData);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      console.error('Registration error:', err);
      // Handle validation errors array from backend
      const errors = err.response?.data?.errors;
      let message;
      if (errors && errors.length > 0) {
        message = errors.map(e => e.message).join('. ');
      } else {
        message = err.response?.data?.error || err.message || 'Registration failed';
      }
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const login = useCallback(async (credentials) => {
    setError(null);
    try {
      const data = await authService.login(credentials);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      const message = err.response?.data?.error || err.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const data = await authService.getMe();
      setUser(data.user);
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  }, []);

  const setErrorHandler = useCallback((err) => {
    setError(err);
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    loading,
    error,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    refreshUser,
    setError: setErrorHandler,
  }), [user, loading, error, register, login, logout, refreshUser, setErrorHandler]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth hook is exported from hooks/useAuth.js
