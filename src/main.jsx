import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(err) {
    return { error: err };
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

ReactDOM.createRoot(document.getElementById('root')).render(
  React.createElement(ErrorBoundary, null,
    React.createElement(App, null)
  )
);
