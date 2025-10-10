import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { Roles } from "../authSlice";

interface SuperAdminGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * SuperAdminGuard - Blocks access to routes for Super Admins
 * 
 * This component prevents Super Admins from accessing certain routes.
 * Regular Admins can access these routes normally.
 * 
 * @param children - The component/route to render if user is NOT a Super Admin
 * @param redirectTo - Where to redirect Super Admins (default: /admin/learnings/dailyPulse)
 */
const SuperAdminGuard: React.FC<SuperAdminGuardProps> = ({
  children,
  redirectTo = "/admin/learnings/dailyPulse",
}) => {
  const role = useSelector((state: RootState) => state.auth.role);
  const isSuperAdmin = role === Roles.SUPER_ADMIN;

  // If user is Super Admin, redirect them away from this route
  if (isSuperAdmin) {
    return <Navigate to={redirectTo} replace />;
  }

  // If user is regular Admin, allow access
  return <>{children}</>;
};

export default SuperAdminGuard;
