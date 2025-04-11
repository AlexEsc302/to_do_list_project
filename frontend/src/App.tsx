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
    <div className="App" style={{ padding: '2rem' }}>
      <h1>Todo List</h1>
      <Filters onFilterChange={setFilters} />
      <AddToDoButton onAdd={() => setRefreshKey((prev) => prev + 1)} />
      <TodoTable filters={filters} refreshKey={refreshKey} />
      <Metrics />
    </div>
  );
}

export default App;
