import PreLoader from "../../components/Skeleton/PreLoader";
import { Navigate } from "react-router-dom";

const PrivateRouteBasedOnUser = ({
  children,
  allowedRoles,
  userRole,
  isLoading,
}) => {
  if (isLoading) return <PreLoader />;
  return allowedRoles.includes(userRole) ? (
    children
  ) : (
    <Navigate to="/unauthorized" replace />
  );
};

export default PrivateRouteBasedOnUser;
