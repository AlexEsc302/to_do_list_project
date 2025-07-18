import React, { useState, Component, ErrorInfo, ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import './styles/design-system.css';
import './styles/TodoList.css';

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
        <div className="p-5 text-center rounded-lg bg-white shadow-md">
          <h2 className="text-error mb-3">Something went wrong.</h2>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="btn btn-primary"
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
      <div className="d-flex justify-content-center align-items-center p-5 min-h-screen">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h2 className="text-secondary">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="app-container bg-light shadow-lg p-5 rounded-lg">
        <h1 className="app-title">ToDo App</h1>
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

export default App;
