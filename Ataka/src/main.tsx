
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './hooks/useAuth';

// Error boundary to catch rendering errors
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("React error boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI when an error is caught
      return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md flex flex-col items-center mt-10">
          <h1 className="text-xl font-bold text-red-600 mb-4">Something went wrong</h1>
          <p className="text-gray-700 mb-4">
            We're sorry, but there was an error loading the application.
          </p>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40 w-full mb-4">
            {this.state.error?.toString()}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

try {
  console.log("Starting application render...");
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    throw new Error("Root element not found! Make sure there's a div with id='root' in your index.html");
  }
  
  const root = createRoot(rootElement);
  root.render(
    <ErrorBoundary>
      <StrictMode>
        <AuthProvider>
          <App />
        </AuthProvider>
      </StrictMode>
    </ErrorBoundary>
  );
  console.log("Application render completed");
} catch (err) {
  console.error("Fatal error during application initialization:", err);
  // Display a minimal fallback UI for fatal errors
  document.body.innerHTML = `
    <div style="padding: 20px; max-width: 500px; margin: 50px auto; text-align: center; font-family: sans-serif;">
      <h1 style="color: #e53e3e; margin-bottom: 16px;">Application Failed to Start</h1>
      <p style="margin-bottom: 16px;">There was a critical error during application initialization:</p>
      <pre style="background: #f7fafc; padding: 12px; border-radius: 4px; overflow: auto; text-align: left;">${err instanceof Error ? err.message : String(err)}</pre>
      <button style="margin-top: 16px; padding: 8px 16px; background: #4299e1; color: white; border: none; border-radius: 4px; cursor: pointer;" onclick="window.location.reload()">Reload Page</button>
    </div>
  `;
}
