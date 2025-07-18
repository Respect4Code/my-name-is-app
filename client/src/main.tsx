import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Global error handler for better debugging
window.onerror = (message, source, lineno, colno, error) => {
  console.error('=== GLOBAL ERROR ===');
  console.error('Message:', message);
  console.error('Source:', source);
  console.error('Line:', lineno, 'Column:', colno);
  console.error('Error object:', error);
  console.error('Stack:', error?.stack);
  console.error('===================');
  return false;
};

window.addEventListener('unhandledrejection', (event) => {
  console.error('=== UNHANDLED PROMISE REJECTION ===');
  console.error('Reason:', event.reason);
  console.error('Promise:', event.promise);
  console.error('===================================');
});

try {
  const root = ReactDOM.createRoot(document.getElementById('root')!);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error('Error rendering app:', error);
  document.body.innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: Arial;">
      <h1>Startup Error</h1>
      <p>Check console for details: ${error}</p>
    </div>
  `;
}