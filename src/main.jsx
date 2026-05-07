import React from 'react';
import ReactDOM from 'react-dom/client';

// Error boundary to catch render crashes
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error: error };
  }
  render() {
    if (this.state.error) {
      return React.createElement('div', {
        style: { padding: 40, fontFamily: 'monospace', color: '#ef4444', background: '#0f1119', minHeight: '100vh' }
      },
        React.createElement('h2', { style: { color: '#f59e0b' } }, 'Something went wrong'),
        React.createElement('pre', { style: { whiteSpace: 'pre-wrap', fontSize: 13, marginTop: 16, color: '#e2e8f0' } }, 
          String(this.state.error) + '\n\n' + (this.state.error.stack || ''))
      );
    }
    return this.props.children;
  }
}

// Wrap the import in a try so we see errors
try {
  var App = React.lazy(function() { return import('./App'); });
  ReactDOM.createRoot(document.getElementById('root')).render(
    React.createElement(ErrorBoundary, null,
      React.createElement(React.Suspense, { 
        fallback: React.createElement('div', {
          style: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0f1119', color: '#6366f1', fontFamily: 'sans-serif' }
        }, React.createElement('div', { style: { textAlign: 'center' } },
          React.createElement('div', { style: { fontSize: 40, marginBottom: 12 } }, '⚡'),
          React.createElement('div', { style: { fontSize: 16 } }, 'Loading...')))
      },
        React.createElement(App, null)
      )
    )
  );
} catch(e) {
  document.getElementById('root').innerHTML = '<div style="padding:40px;font-family:monospace;color:#ef4444;background:#0f1119;min-height:100vh"><h2 style="color:#f59e0b">Failed to start</h2><pre style="color:#e2e8f0;margin-top:16px;white-space:pre-wrap">' + String(e) + '</pre></div>';
}
