import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  account, 
  client, 
  AuthHelpers, 
  AppwriteUser,
  AppwriteError 
} from '@/lib/appwrite';

interface AppwriteContextType {
  user: AppwriteUser | null;
  session: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, password: string, name: string) => Promise<any>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AppwriteContext = createContext<AppwriteContextType | null>(null);

export const useAppwrite = () => {
  const context = useContext(AppwriteContext);
  if (!context) {
    throw new Error('useAppwrite must be used within an AppwriteProvider');
  }
  return context;
};

interface AppwriteProviderProps {
  children: React.ReactNode;
}

export const AppwriteProvider: React.FC<AppwriteProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AppwriteUser | null>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const result = await AuthHelpers.getCurrentUser();
      if (result) {
        setUser(result.user);
        setSession(result.session);
      } else {
        setUser(null);
        setSession(null);
      }
    } catch (error) {
      console.log('No active session');
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();

    // Subscribe to auth changes
    const unsubscribe = client.subscribe('account', (response) => {
      console.log('Auth event:', response);
      if (response.events.includes('users.sessions.create')) {
        // User logged in
        checkAuth();
      } else if (response.events.includes('users.sessions.delete')) {
        // User logged out
        setUser(null);
        setSession(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const session = await AuthHelpers.loginWithEmail(email, password);
      await checkAuth(); // Refresh user data
      return session;
    } catch (error) {
      if (error instanceof AppwriteError) {
        throw error;
      }
      throw new AppwriteError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      const result = await AuthHelpers.registerWithEmail(email, password, name);
      await checkAuth(); // Refresh user data
      return result;
    } catch (error) {
      if (error instanceof AppwriteError) {
        throw error;
      }
      throw new AppwriteError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await AuthHelpers.logout();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local state anyway
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await AuthHelpers.resetPassword(email);
    } catch (error) {
      if (error instanceof AppwriteError) {
        throw error;
      }
      throw new AppwriteError('Password reset failed');
    }
  };

  const isAuthenticated = !!user && !!session;
  const isAdmin = user?.role === 'admin';

  const value: AppwriteContextType = {
    user,
    session,
    loading,
    login,
    register,
    logout,
    resetPassword,
    isAuthenticated,
    isAdmin,
  };

  return (
    <AppwriteContext.Provider value={value}>
      {children}
    </AppwriteContext.Provider>
  );
};

// Hook for authentication guard
export const useAuthGuard = (requireAdmin: boolean = false) => {
  const { user, loading, isAuthenticated, isAdmin } = useAppwrite();

  const canAccess = isAuthenticated && (!requireAdmin || isAdmin);

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    canAccess,
    needsAuth: !loading && !isAuthenticated,
    needsAdmin: !loading && isAuthenticated && requireAdmin && !isAdmin,
  };
};

// Hook for protected routes
export const useProtectedRoute = (requireAdmin: boolean = false) => {
  const { canAccess, loading, needsAuth, needsAdmin } = useAuthGuard(requireAdmin);

  useEffect(() => {
    if (!loading) {
      if (needsAuth) {
        // Redirect to login
        window.location.href = '/login';
      } else if (needsAdmin) {
        // Redirect to unauthorized page or home
        window.location.href = '/';
      }
    }
  }, [loading, needsAuth, needsAdmin]);

  return { canAccess, loading };
};

export default AppwriteContext;
