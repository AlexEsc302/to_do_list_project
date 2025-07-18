import React, { useState, useEffect } from 'react';

interface FilterProps {
    onFilterChange: (filters: { done?: string; name?: string; priority?: string }) => void;
}

const Filters: React.FC<FilterProps> = ({ onFilterChange }) => {
    const [done, setDone] = useState('all');
    const [name, setName] = useState('');
    const [priority, setPriority] = useState('all');
    const [isOpen, setIsOpen] = useState(false);
    const [activeFilterCount, setActiveFilterCount] = useState(0);

    useEffect(() => {
        let count = 0;
        if (done !== 'all') count++;
        if (name.trim() !== '') count++;
        if (priority !== 'all') count++;
        setActiveFilterCount(count);
    }, [done, name, priority]);

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
    };

    const toggleFilters = () => {
        setIsOpen(!isOpen);
    };

    // Color indicators for priority levels
    const getPriorityDot = (priorityLevel: string) => {
      switch(priorityLevel) {
        case 'LOW':
          return <span className="priority-dot priority-low"></span>;
        case 'MEDIUM':
          return <span className="priority-dot priority-medium"></span>;
        case 'HIGH':
          return <span className="priority-dot priority-high"></span>;
        default:
          return null;
      }
    };

    // Status indicator
    const getStatusIcon = (status: string) => {
      switch(status) {
        case 'true':
          return <i className="fas fa-check-circle text-success"></i>;
        case 'false':
          return <i className="fas fa-clock text-warning"></i>;
        default:
          return null;
      }
    };

  return (
    <div className={`filter-card mb-4 ${isOpen ? 'filter-card-expanded' : 'filter-card-collapsible'}`}>
      <div 
        className="filter-card-header" 
        onClick={toggleFilters}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-controls="filter-content"
        title={isOpen ? "Click to collapse filters" : "Click to expand filters"}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleFilters();
          }
        }}
      >
        <h5 className="filter-card-title m-0">
          <i className="fas fa-filter filter-card-title-icon"></i>
          Filter Tasks 
          {!isOpen && activeFilterCount > 0 && (
            <span className="filter-badge">{activeFilterCount}</span>
          )}
        </h5>
        <div className="expand-indicator">
          <span className="expand-text">{isOpen ? "▲" : "▼"}</span>
        </div>
      </div>

      <div className={`filter-card-content ${isOpen ? 'open' : ''}`} id="filter-content">
        <div className="row g-3">
          <div className="col-md-6">
            <div className="filter-section">
              <label className="filter-label">Search</label>
              <div className="filter-input-group">
                <i className="fas fa-search filter-input-icon"></i>
                <input
                  type="text"
                  className="filter-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Search by task name"
                  aria-label="Task name"
                />
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="filter-section">
              <div className="status-priority-container">
                <div className="filter-field-half">
                  <label className="filter-label">Status</label>
                  <div className="select-with-indicator">
                    {done !== 'all' && getStatusIcon(done)}
                    <select 
                      className="filter-select" 
                      value={done} 
                      onChange={(e) => setDone(e.target.value)}
                      aria-label="Status filter"
                    >
                      <option value="all">All Status</option>
                      <option value="true">Completed</option>
                      <option value="false">Active</option>
                    </select>
                  </div>
                </div>
                
                <div className="filter-field-half">
                  <label className="filter-label">Priority</label>
                  <div className="select-with-indicator">
                    {priority !== 'all' && getPriorityDot(priority)}
                    <select 
                      className="filter-select" 
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
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-12">
            <div className="filter-section">
              <div className="filter-actions">
                <button 
                  onClick={handleChange} 
                  className="btn btn-primary btn-sm"
                >
                  <i className="fas fa-check me-1"></i> Apply
                </button>
                <button 
                  onClick={handleReset} 
                  className="btn btn-outline-secondary btn-sm"
                >
                  <i className="fas fa-undo me-1"></i> Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
