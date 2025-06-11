import { createContext, useContext, useEffect, useState } from 'react';
import { newFileDb } from '@/services/fileDatabase';

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
      await newFileDb.reloadFromStorage();
      const user = newFileDb.authenticateUser(username, password);
      
      if (!user) {
        return { error: { message: 'Invalid credentials' } };
      }

      const userData = {
        id: user.id,
        username: user.username,
        role: user.role,
        default_credit_name: user.default_credit_name
      };

      setUser(userData);
      setUserRole(user.role);
      localStorage.setItem('currentUser', JSON.stringify(userData));

      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: { message: 'Authentication failed' } };
    }
  };

  const signOut = async () => {
    setUser(null);
    setUserRole(null);
    localStorage.removeItem('currentUser');
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
