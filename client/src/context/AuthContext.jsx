import { createContext, useState, useEffect } from 'react';
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

  const register = async (userData) => {
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
  };

  const login = async (credentials) => {
    setError(null);
    try {
      console.log('Attempting login with:', { email: credentials.email });
      const data = await authService.login(credentials);
      console.log('Login successful, user:', data.user);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      const message = err.response?.data?.error || err.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    setError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth hook is exported from hooks/useAuth.js
