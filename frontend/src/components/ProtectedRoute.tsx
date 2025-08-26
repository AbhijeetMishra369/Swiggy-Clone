import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store';

export default function ProtectedRoute({ role }: { role: 'CUSTOMER' | 'ADMIN' }) {
  const { token, user } = useAppSelector(s => s.auth);
  if (!token || !user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    // If user is admin trying to access customer-only, or vice versa
    return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/'} replace />;
  }
  return <Outlet />;
}