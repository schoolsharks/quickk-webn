import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useFeatureAccess } from '../hooks/useFeatureAccess';

interface RouteGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  fallback,
  redirectTo = '/admin/dashboard'
}) => {
  const location = useLocation();
  const { hasRouteAccess } = useFeatureAccess();

  if (!hasRouteAccess(location.pathname)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default RouteGuard;
