import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'patient' | 'caregiver' | 'admin';
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole
}) => {
  const {
    user,
    isAuthenticated
  } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect based on role
    if (user?.role === 'patient') {
      return <Navigate to="/patient-dashboard" />;
    } else if (user?.role === 'caregiver') {
      return <Navigate to="/caregiver-dashboard" />;
    }
    return <Navigate to="/" />;
  }
  return <>{children}</>;
};
export default ProtectedRoute;