import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router";
import { RootState } from "../../store/store";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  // If user is authenticated and trying to access signin/signup, redirect to dashboard
  if (isAuthenticated && (location.pathname === "/signin" || location.pathname === "/signup")) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
