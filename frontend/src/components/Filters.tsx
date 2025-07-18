import React, { useState } from 'react';

interface FilterProps {
    onFilterChange: (filters: { done?: string; name?: string; priority?: string }) => void;
}

const Filters: React.FC<FilterProps> = ({ onFilterChange }) => {
    const [done, setDone] = useState('all');
    const [name, setName] = useState('');
    const [priority, setPriority] = useState('all');

    const handleChange = () => {
        const filters: any = {};
        if (done !== 'all') filters.done = done;
        if (name.trim() !== '') filters.name = name;
        if (priority !== 'all') filters.priority = priority;
        onFilterChange(filters);
    };
    
    const handleReset = () => {
        setDone('all');
        setName('');
        setPriority('all');
        onFilterChange({});
    }

  return (
    <div className="card bg-light shadow-sm p-4 mb-4">
      <h5 className="mb-3">Filter Tasks</h5>
      <div className="row g-3">
        <div className="col-md-4">
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Search by name"
              aria-label="Task name"
            />
          </div>
        </div>
        
        <div className="col-md-3">
          <select 
            className="form-select" 
            value={priority} 
            onChange={(e) => setPriority(e.target.value)}
            aria-label="Priority filter"
          >
            <option value="all">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
        
        <div className="col-md-3">
          <select 
            className="form-select" 
            value={done} 
            onChange={(e) => setDone(e.target.value)}
            aria-label="Status filter"
          >
            <option value="all">All Status</option>
            <option value="true">Completed</option>
            <option value="false">Active</option>
          </select>
        </div>
        
        <div className="col-md-2 d-flex">
          <button 
            onClick={handleChange} 
            className="btn btn-primary me-2 flex-grow-1"
          >
            Apply
          </button>
          <button 
            onClick={handleReset} 
            className="btn btn-outline-secondary flex-grow-1"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
