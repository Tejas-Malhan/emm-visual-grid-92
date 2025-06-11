
import { createContext, useContext, useEffect, useState } from 'react';
import { sqlite3Db } from '@/services/sqlite3Database';

interface AuthContextType {
  user: any | null;
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
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setUserRole(userData.role);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      console.log('🔐 Attempting to sign in user:', username);
      const authenticatedUser = await sqlite3Db.authenticateUser(username, password);
      
      if (!authenticatedUser) {
        console.log('❌ Authentication failed for user:', username);
        return { error: { message: 'Invalid credentials' } };
      }

      const userData = {
        id: authenticatedUser.id,
        username: authenticatedUser.username,
        role: authenticatedUser.role,
        default_credit_name: authenticatedUser.default_credit_name
      };

      setUser(userData);
      setUserRole(authenticatedUser.role);
      localStorage.setItem('currentUser', JSON.stringify(userData));

      console.log('✅ User signed in successfully:', userData);
      return { error: null };
    } catch (error) {
      console.error('❌ Sign in error:', error);
      return { error: { message: 'Authentication failed' } };
    }
  };

  const signOut = async () => {
    setUser(null);
    setUserRole(null);
    localStorage.removeItem('currentUser');
    console.log('👋 User signed out');
  };

  const value = {
    user,
    userRole,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
