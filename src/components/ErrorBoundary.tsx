import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorCount: number;
  lastErrorTime: number;
}

const MAX_RELOADS = 2;
const RELOAD_COOLDOWN = 30000; // 30 seconds

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorCount: 0,
      lastErrorTime: 0,
    };
  }

  static getDerivedStateFromError(): State {
    return {
      hasError: true,
      errorCount: 0,
      lastErrorTime: 0,
    };
  }

  componentDidCatch(error: Error) {
    console.error('App Error:', error);
    
    const now = Date.now();
    const timeSinceLastError = now - this.state.lastErrorTime;
    
    // Reset counter if enough time has passed
    const errorCount = timeSinceLastError > RELOAD_COOLDOWN ? 1 : this.state.errorCount + 1;
    
    this.setState({
      errorCount,
      lastErrorTime: now,
    });

    // Auto-reload if under limit and likely a cache issue
    if (errorCount <= MAX_RELOADS && this.isCacheError(error)) {
      console.log(`Auto-reloading (attempt ${errorCount}/${MAX_RELOADS})`);
      setTimeout(() => window.location.reload(), 1000);
    }
  }

  private isCacheError(error: Error): boolean {
    const cacheErrorPatterns = [
      /loading chunk/i,
      /unexpected eof/i,
      /failed to fetch/i,
      /network error/i,
      /module.*didn't register/i,
    ];
    
    return cacheErrorPatterns.some(pattern => 
      pattern.test(error.message) || pattern.test(error.stack || '')
    );
  }

  private handleManualReload = () => {
    // Clear service worker cache and reload
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => registration.unregister());
        window.location.reload();
      });
    } else {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-4">
            <div className="text-6xl">😵</div>
            <h1 className="text-2xl font-bold text-foreground">
              Something went wrong
            </h1>
            <p className="text-muted-foreground">
              {this.state.errorCount >= MAX_RELOADS 
                ? "The app encountered repeated errors. This might be a cache issue."
                : "The app will reload automatically in a moment..."
              }
            </p>
            {this.state.errorCount >= MAX_RELOADS && (
              <button
                onClick={this.handleManualReload}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Reload App
              </button>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}