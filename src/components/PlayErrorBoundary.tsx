import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class PlayErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Play component error:", error, errorInfo);

    // Clear the game store from localStorage
    localStorage.removeItem("game-state");

    // Navigate to /new
    window.location.href = "/new";
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <h2 className="mb-2 text-xl font-semibold">Something went wrong</h2>
            <p className="mb-4 text-gray-600">
              Redirecting to create a new game...
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrapper component to access navigate hook
export const PlayErrorBoundary: React.FC<Props> = ({ children }) => {
  return <PlayErrorBoundaryClass>{children}</PlayErrorBoundaryClass>;
};
