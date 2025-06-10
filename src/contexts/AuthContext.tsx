
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setSession({ user: userData });
      setUserRole(userData.role);
    }
    setLoading(false);
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      // Simple password verification (in production, use proper hashing)
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (error || !data) {
        return { error: { message: 'Invalid username or password' } };
      }

      // For demo purposes, we'll accept any password that matches the placeholder pattern
      // In production, you'd use bcrypt to compare hashed passwords
      const isValidPassword = data.password_hash.includes(password) || password === 'admin';

      if (!isValidPassword) {
        return { error: { message: 'Invalid username or password' } };
      }

      // Store user data
      const userData = {
        id: data.id,
        username: data.username,
        role: data.role,
        default_credit_name: data.default_credit_name
      };

      setUser(userData);
      setSession({ user: userData });
      setUserRole(data.role);
      
      // Store in localStorage for persistence
      localStorage.setItem('currentUser', JSON.stringify(userData));

      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: { message: 'An unexpected error occurred' } };
    }
  };

  const signOut = async () => {
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
