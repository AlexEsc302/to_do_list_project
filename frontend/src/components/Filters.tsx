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
    <div style={filtersContainerStyle}>
        <div style={filterGroupStyle}>
        <label style={filterLabelStyle}>
            Name:
            <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={filterInputStyle}
            placeholder="Search by name"
            />
        </label>
        </div>

        <div style={filterGroupStyle}>
        <label style={filterLabelStyle}>
            Priority:
            <select value={priority} onChange={(e) => setPriority(e.target.value)} style={filterSelectStyle}>
            <option value="all">All</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            </select>
        </label>
        </div>

        <div style={filterGroupStyle}>
        <label style={filterLabelStyle}>
            State:
            <select value={done} onChange={(e) => setDone(e.target.value)} style={filterSelectStyle}>
            <option value="all">All</option>
            <option value="true">Done</option>
            <option value="false">Undone</option>
            </select>
        </label>
        </div>

        <div style={filterButtonGroupStyle}>
        <button onClick={handleChange} style={filterButtonStyle}>Search</button>
        <button onClick={handleReset} style={filterButtonStyle}>Reset</button>
        </div>
    </div>
    );
};

const filtersContainerStyle = {
  display: 'flex',
  gap: '1rem',
  marginBottom: '1.5rem',
  backgroundColor: '#fff',
  padding: '1.5rem',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
};

const filterGroupStyle = {
  display: 'flex',
  alignItems: 'center',
};

const filterLabelStyle = {
  marginRight: '0.5rem',
  fontWeight: 'bold',
  color: '#555',
};

const filterInputStyle = {
  padding: '0.75rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '0.8rem',
  minWidth: '150px',
};

const filterSelectStyle = {
  padding: '0.75rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '1rem',
  minWidth: '120px',
};

const filterButtonGroupStyle = {
  display: 'flex',
  gap: '0.5rem',
  marginTop: '1rem',
};

const filterButtonStyle = {
  padding: '0.75rem 1rem',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: '#007bff',
  color: '#fff',
  cursor: 'pointer',
  fontSize: '0.8rem',
  transition: 'background-color 0.3s ease',

  '&:hover': {
    backgroundColor: '#0056b3',
  },
};

export default Filters;
