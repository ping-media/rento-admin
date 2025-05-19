import React from "react";
import InternalError from "../../assets/logo/internalError.png";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="w-60">
            <img src={InternalError} alt="INTERNAL_ERROR" />
          </div>
          <div className="text-center">
            <h1 className="font-semibold text-xl">
              Oops! Something went wrong.
            </h1>
            <p>Please try refreshing the page.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
