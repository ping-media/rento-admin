import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary";

function ErrorBoundaryWrapper({ children }) {
  const location = useLocation();
  const errorBoundaryRef = useRef(null);

  useEffect(() => {
    errorBoundaryRef.current?.resetErrorBoundary();
  }, [location.pathname]);

  return <ErrorBoundary ref={errorBoundaryRef}>{children}</ErrorBoundary>;
}

export default ErrorBoundaryWrapper;
