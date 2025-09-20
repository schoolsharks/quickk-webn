import React from "react";
import { Navigate } from "react-router-dom";
import { useFeatureAccess } from "../hooks/useFeatureAccess";
import { FeatureKeys } from "../Types/features";

interface FeatureGuardProps {
  feature: FeatureKeys;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

const FeatureGuard: React.FC<FeatureGuardProps> = ({
  feature,
  children,
  fallback,
  redirectTo = "/admin/dashboard",
}) => {
  const { hasFeatureAccess } = useFeatureAccess();

  if (!hasFeatureAccess(feature)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default FeatureGuard;
