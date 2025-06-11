
import { createContext, useContext, useEffect, useState } from 'react';
import { newFileDb } from '@/services/fileDatabase';

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
    // Check if user is already logged in (from localStorage as session backup only)
    const storedUser = localStorage.getItem('currentUser');
    console.log('Stored user in localStorage:', storedUser);
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setSession({ user: userData });
      setUserRole(userData.role);
      console.log('Restored user session from localStorage:', userData);
    }
    setLoading(false);
  }, []);

  const signIn = async (username: string, password: string) => {
    console.log('Attempting sign in with .db file database:', username, password);
    
    try {
      // Force reload from .db file database to get latest users
      await newFileDb.reloadFromStorage();
      
      // Use the .db file database service
      const user = newFileDb.authenticateUser(username, password);
      
      console.log('.db file database authentication result:', user);

      if (!user) {
        console.log('Authentication failed - invalid credentials in .db file database');
        return { error: { message: 'Invalid username or password' } };
      }

      // Store user data
      const userData = {
        id: user.id,
        username: user.username,
        role: user.role,
        default_credit_name: user.default_credit_name
      };

      console.log('Setting user data from .db file database:', userData);

      setUser(userData);
      setSession({ user: userData });
      setUserRole(user.role);
      
      // Store in localStorage for session backup only
      localStorage.setItem('currentUser', JSON.stringify(userData));

      return { error: null };
    } catch (error) {
      console.error('Sign in error with .db file database:', error);
      return { error: { message: 'An unexpected error occurred with .db file database' } };
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
