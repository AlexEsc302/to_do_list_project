import React, { useState, Component, ErrorInfo, ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import Filters from './components/Filters';
import TodoTable from './components/TodoTable';
import AddToDoButton from './components/AddToDoButton';
import Metrics from './components/Metrics';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
          <h2>Something went wrong.</h2>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [filters, setFilters] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial load
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div style={{
        ...appContainerStyle,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <>
      <div className="app-container" style={appContainerStyle}>
        <h1 style={appTitleStyle}>ToDo App</h1>
        <ErrorBoundary>
          <Filters onFilterChange={setFilters} />
          <AddToDoButton onAdd={() => setRefreshKey((prev) => prev + 1)} />
          <TodoTable filters={filters} refreshKey={refreshKey} />
          <Metrics />
        </ErrorBoundary>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

const appContainerStyle = {
  maxWidth: '1500px',
  margin: '2rem auto',
  padding: '2rem',
  backgroundColor: '#f4f6f8',
  borderRadius: '12px',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
  fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
};

const appTitleStyle = {
  color: '#333',
  fontSize: '2.5rem',
  fontWeight: 'bold',
  marginBottom: '1.5rem',
};

export default App;
