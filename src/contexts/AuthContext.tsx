import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name?: string;
  sleep_goal_hours?: number;
  timezone?: string;
  email_reminders?: boolean;
  reminder_time?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Get stored tokens
  const getTokens = () => {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    return { accessToken, refreshToken };
  };

  // Clear stored tokens
  const clearTokens = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };

  // Make authenticated API request
  const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
    const { accessToken } = getTokens();
    
    if (!accessToken) {
      throw new Error('No access token available');
    }

    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  };

  // Load user profile
  const loadUserProfile = async (): Promise<User | null> => {
    try {
      const response = await authenticatedFetch('/api/user/profile');
      const data = await response.json();

      if (data.success) {
        return data.data;
      } else {
        console.error('Failed to load user profile:', data.message);
        return null;
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Store tokens
        localStorage.setItem('access_token', data.data.session.access_token);
        localStorage.setItem('refresh_token', data.data.session.refresh_token);
        
        // Load user profile
        const userProfile = await loadUserProfile();
        if (userProfile) {
          setUser(userProfile);
          toast.success('Welcome back!');
          return true;
        } else {
          clearTokens();
          toast.error('Failed to load user profile');
          return false;
        }
      } else {
        toast.error(data.message || 'Sign in failed');
        return false;
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('An error occurred during sign in');
      return false;
    }
  };

  // Sign up function
  const signUp = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Store tokens if provided
        if (data.token) {
          localStorage.setItem('access_token', data.token);
        }
        
        // Set user data immediately
        if (data.user) {
          setUser(data.user);
        }
        
        toast.success(data.message || 'Account created successfully!');
        return true;
      } else {
        toast.error(data.message || 'Sign up failed');
        return false;
      }
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error('An error occurred during sign up');
      return false;
    }
  };

  // Sign out function
  const signOut = async (): Promise<void> => {
    try {
      // Call logout endpoint
      await authenticatedFetch('/api/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state and tokens regardless of API call result
      setUser(null);
      clearTokens();
      toast.success('Signed out successfully');
    }
  };

  // Refresh user profile
  const refreshUser = async (): Promise<void> => {
    try {
      const userProfile = await loadUserProfile();
      if (userProfile) {
        setUser(userProfile);
      } else {
        // If we can't load the profile, the token might be invalid
        setUser(null);
        clearTokens();
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
      clearTokens();
    }
  };

  // Update user profile
  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    try {
      const response = await authenticatedFetch('/api/user/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setUser(result.data);
        toast.success('Profile updated successfully');
        return true;
      } else {
        toast.error(result.message || 'Failed to update profile');
        return false;
      }
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('An error occurred while updating profile');
      return false;
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { accessToken } = getTokens();
      
      if (accessToken) {
        // Try to load user profile with existing token
        const userProfile = await loadUserProfile();
        if (userProfile) {
          setUser(userProfile);
        } else {
          // Token is invalid, clear it
          clearTokens();
        }
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    refreshUser,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;