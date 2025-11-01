import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Error caught by boundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          backgroundColor: '#111',
          color: '#ff5555',
          padding: '20px',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap'
        }}>
          <h2>⚠️ Something went wrong rendering this page</h2>
          <p>{this.state.error?.toString()}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
