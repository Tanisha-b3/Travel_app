import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '@/components/Service/AuthService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state on app mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = authService.getUser();
        if (storedUser) {
          // Verify token is still valid
          const verified = await authService.verifyToken();
          if (verified.success) {
            setUser(verified.user || storedUser);
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      } catch (err) {
        console.error('Auth init error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(email, password);
      if (response.success) {
        setUser(response.user);
        return { success: true };
      }
      throw new Error(response.message || 'Login failed');
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register(name, email, password);
      if (response.success) {
        setUser(response.user);
        return { success: true };
      }
      throw new Error(response.message || 'Registration failed');
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Registration failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const googleAuth = async (googleData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.googleAuth(googleData);
      if (response.success) {
        setUser(response.user);
        return { success: true };
      }
      throw new Error(response.message || 'Google auth failed');
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Google auth failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        register,
        googleAuth,
        logout,
        clearError,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
