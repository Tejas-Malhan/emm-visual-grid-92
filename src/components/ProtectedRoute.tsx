
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();

  console.log('ProtectedRoute state:', { user, userRole, loading, requireAdmin });

  useEffect(() => {
    if (!loading) {
      console.log('ProtectedRoute check:', { user: !!user, userRole, requireAdmin });
      
      if (!user) {
        console.log('No user, redirecting to auth');
        navigate('/auth');
      } else if (requireAdmin && userRole !== 'admin') {
        console.log('User not admin, redirecting to home');
        navigate('/');
      } else {
        console.log('Access granted');
      }
    }
  }, [user, userRole, loading, navigate, requireAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // Block access for non-authenticated users
  // For admin routes, only block if requireAdmin is true and user is not admin
  if (!user || (requireAdmin && userRole !== 'admin')) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
