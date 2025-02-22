import { Navigate } from "react-router-dom";

const PrivateRouteBasedOnUser = ({ children, allowedRoles, userRole }) => {
  return allowedRoles.includes(userRole) ? (
    children
  ) : (
    <Navigate to="/unauthorized" replace />
  );
};

export default PrivateRouteBasedOnUser;
