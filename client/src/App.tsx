
/**
 * My Name Is - Personalized Phonics Learning App
 * Created by BoredMamaApp
 * 
 * An inclusive phonics tool where parents record their child's name pronunciation
 * Licensed under Creative Commons BY-NC-SA 4.0
 * 
 * Built with love for every child to learn their name ❤️
 */

import React, { Suspense } from 'react';
import { Route, Switch } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import Home from '@/pages/home';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('React Error Boundary caught error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error details:', error, errorInfo);
    console.error('Component stack:', errorInfo.componentStack);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    // Make error available globally for debugging
    (window as any).lastError = { error, errorInfo };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600 text-white">
          <div className="text-center p-8 max-w-md">
            <h1 className="text-2xl font-bold mb-4">Oops! Something went wrong</h1>
            <p className="mb-4">Please refresh the page to try again.</p>
            <details className="mb-4 text-left bg-white/10 p-4 rounded text-sm">
              <summary className="cursor-pointer font-semibold">Technical Details</summary>
              <div className="mt-2 text-xs font-mono">
                <p>Check the browser console (F12) for full error details.</p>
                <p className="mt-1">Open DevTools → Console tab</p>
                <p className="mt-1">Look for red error messages</p>
              </div>
            </details>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-background text-foreground">
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
          }>
            <Switch>
              <Route path="/" component={Home} />
              <Route component={NotFound} />
            </Switch>
          </Suspense>
          <Toaster />
        </div>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
