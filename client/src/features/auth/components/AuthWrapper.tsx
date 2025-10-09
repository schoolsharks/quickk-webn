import { Navigate, Outlet } from "react-router-dom";
import { Roles } from "../authSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";

const AuthWrapper = ({
  verifyRole,
  redirection,
}: {
  verifyRole: Roles;
  redirection: string;
}) => {
  const { role, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  // Check authentication
  if (!isAuthenticated) {
    return <Navigate to={redirection} />;
  }

  // Role hierarchy: SUPER_ADMIN can access all ADMIN routes
  // ADMIN can only access ADMIN routes
  // USER can only access USER routes
  const hasAccess = 
    role === verifyRole || 
    (verifyRole === Roles.ADMIN && role === Roles.SUPER_ADMIN);

  if (!hasAccess) {
    return <Navigate to={redirection} />;
  }

  return <Outlet />;
};

export default AuthWrapper;
