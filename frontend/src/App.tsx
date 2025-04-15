import React,  { useState } from 'react';
import './App.css';

import Filters from './components/Filters';
import TodoTable from './components/TodoTable';
import AddToDoButton from './components/AddToDoButton';
import Metrics from './components/Metrics';

function App() {
  const [filters, setFilters] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="app-container" style={appContainerStyle}>
      <h1 style={appTitleStyle}>ToDo App</h1>
      <Filters onFilterChange={setFilters} />
      <AddToDoButton onAdd={() => setRefreshKey((prev) => prev + 1)} />
      <TodoTable filters={filters} refreshKey={refreshKey} />
      <Metrics />
    </div>
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
