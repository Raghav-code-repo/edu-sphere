import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

export function RoleRedirect() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      switch (user.role) {
        case 'STUDENT':
          navigate('/student/dashboard', { replace: true });
          break;
        case 'PARENT':
          navigate('/parent/dashboard', { replace: true });
          break;
        case 'FACULTY':
          navigate('/faculty/dashboard', { replace: true });
          break;
        case 'ADMIN':
        case 'SUPER_ADMIN':
          navigate('/admin/dashboard', { replace: true });
          break;
        default:
          navigate('/student/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
    </div>
  );
}
