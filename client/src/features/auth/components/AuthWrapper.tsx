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

  if (!isAuthenticated || role !== verifyRole) {
    return <Navigate to={redirection} />;
  }
  return <Outlet />;
};

export default AuthWrapper;
