/**
 * My Name Is - Personalized Phonics Learning App
 * Created by BoredMamaApp - An inclusive phonics tool where parents record their child's name pronunciation
 * Licensed under Creative Commons BY-NC-SA 4.0
 * Built with love for every child to learn their name ❤️
 */

import React from 'react';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('React Error Boundary caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error details:', error, errorInfo);
    console.error('Component stack:', errorInfo.componentStack);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    (window as any).lastError = { error, errorInfo };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600 text-white">
          <div className="text-center p-8 max-w-md">
            <h1 className="text-2xl font-bold mb-4">Oops! Something went wrong</h1>
            <p className="mb-4">Error details available in console</p>
            <details className="mb-4 text-left bg-white/10 p-4 rounded text-sm">
              <summary className="cursor-pointer font-semibold">Error Message</summary>
              <p className="mt-2 font-mono text-xs">{this.state.error?.message || 'Unknown error'}</p>
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

function MinimalApp() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">My Name Is</h1>
        <p className="text-gray-600 mb-6">Minimal version for debugging</p>
        <button 
          onClick={() => console.log('Button clicked')}
          className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
        >
          Test Button
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MinimalApp />
    </ErrorBoundary>
  );
}