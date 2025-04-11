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
    <div style={{ marginBottom: '1rem' }}>
        <label>
            Name:
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ margin: '0 1rem' }}
            />
        </label>

        <label>
            Priority:
            <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{ marginRight: '1rem' }}>
                <option value="all">All</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
            </select>
        </label>

        <label>
            State:
            <select value={done} onChange={(e) => setDone(e.target.value)} style={{ margin: '0 1rem' }}>
                <option value="all">All</option>
                <option value="true">Done</option>
                <option value="false">Undone</option>
            </select>
        </label>

        <button onClick={handleChange}>Search</button>
        <button onClick={handleReset}>Reset</button>
    </div>
  );
};

export default Filters;
