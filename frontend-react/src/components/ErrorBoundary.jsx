import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error", error, info);
    this.setState({ info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: 'white', background: 'red', padding: '2rem', height: '100vh', zIndex: 9999 }}>
          <h1>React Component Crashed</h1>
          <p><strong>Error:</strong> {this.state.error?.toString()}</p>
          <pre style={{ color: '#ffaaaa', overflow: 'auto', maxHeight: '50vh' }}>
            {this.state.info?.componentStack || this.state.error?.stack}
          </pre>
          <button onClick={() => window.location.href = '/'}>Go Home</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
