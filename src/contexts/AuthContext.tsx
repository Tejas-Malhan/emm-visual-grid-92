
import { createContext, useContext, useEffect, useState } from 'react';
import { db } from '@/services/database';

interface AuthContextType {
  user: any | null;
  session: any | null;
  userRole: string | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem('currentUser');
    console.log('Stored user:', storedUser);
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setSession({ user: userData });
      setUserRole(userData.role);
      console.log('Restored user session:', userData);
    }
    setLoading(false);
  }, []);

  const signIn = async (username: string, password: string) => {
    console.log('Attempting sign in with:', username, password);
    
    try {
      // Use the local database service
      const user = db.authenticateUser(username, password);
      
      console.log('Database authentication result:', user);

      if (!user) {
        console.log('Authentication failed - invalid credentials');
        return { error: { message: 'Invalid username or password' } };
      }

      // Store user data
      const userData = {
        id: user.id,
        username: user.username,
        role: user.role,
        default_credit_name: user.default_credit_name
      };

      console.log('Setting user data:', userData);

      setUser(userData);
      setSession({ user: userData });
      setUserRole(user.role);
      
      // Store in localStorage for persistence
      localStorage.setItem('currentUser', JSON.stringify(userData));

      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: { message: 'An unexpected error occurred' } };
    }
  };

  const signOut = async () => {
    console.log('Signing out user');
    setUser(null);
    setSession(null);
    setUserRole(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    user,
    session,
    userRole,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
