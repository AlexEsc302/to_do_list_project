import React, { useState } from 'react';
import { Priority } from '../types/ToDo';

// Types for sort configuration
interface SortConfig {
  primarySort: string;
  secondarySort: string;
  primaryDirection: 'asc' | 'desc';
  secondaryDirection: 'asc' | 'desc';
}

interface SortControlsProps {
  onSortChange: (sortConfig: SortConfig) => void;
  initialConfig?: SortConfig;
}

const SortControls: React.FC<SortControlsProps> = ({ 
  onSortChange, 
  initialConfig = {
    primarySort: 'dueDate',
    secondarySort: 'priority',
    primaryDirection: 'asc',
    secondaryDirection: 'desc'
  }
}) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>(initialConfig);

  // Available sort fields
  const sortFields = [
    { value: 'dueDate', label: 'Due Date' },
    { value: 'priority', label: 'Priority' },
    { value: 'name', label: 'Name' },
    { value: 'createdAt', label: 'Created Date' },
  ];

  const handleSortChange = (field: keyof SortConfig, value: string | 'asc' | 'desc') => {
    const newConfig = { 
      ...sortConfig,
      [field]: value 
    };
    
    setSortConfig(newConfig);
    onSortChange(newConfig);
  };

  return (
    <div style={sortControlsContainerStyle}>
      <h3 style={sortHeadingStyle}>Sort Options</h3>
      
      <div style={sortRowStyle}>
        <div style={sortGroupStyle}>
          <label style={labelStyle}>Primary Sort:</label>
          <select 
            value={sortConfig.primarySort}
            onChange={(e) => handleSortChange('primarySort', e.target.value)}
            style={selectStyle}
          >
            {sortFields.map(field => (
              <option key={field.value} value={field.value}>
                {field.label}
              </option>
            ))}
          </select>
          
          <div style={directionControlsStyle}>
            <button 
              onClick={() => handleSortChange('primaryDirection', 'asc')}
              style={{
                ...directionButtonStyle,
                backgroundColor: sortConfig.primaryDirection === 'asc' ? '#3f51b5' : '#e0e0e0'
              }}
              aria-label="Sort ascending"
              title="Sort ascending"
            >
              ↑
            </button>
            <button 
              onClick={() => handleSortChange('primaryDirection', 'desc')}
              style={{
                ...directionButtonStyle,
                backgroundColor: sortConfig.primaryDirection === 'desc' ? '#3f51b5' : '#e0e0e0'
              }}
              aria-label="Sort descending"
              title="Sort descending"
            >
              ↓
            </button>
          </div>
        </div>
        
        <div style={sortGroupStyle}>
          <label style={labelStyle}>Then Sort By:</label>
          <select 
            value={sortConfig.secondarySort}
            onChange={(e) => handleSortChange('secondarySort', e.target.value)}
            style={selectStyle}
          >
            {sortFields.map(field => (
              <option key={field.value} value={field.value}>
                {field.label}
              </option>
            ))}
          </select>
          
          <div style={directionControlsStyle}>
            <button 
              onClick={() => handleSortChange('secondaryDirection', 'asc')}
              style={{
                ...directionButtonStyle,
                backgroundColor: sortConfig.secondaryDirection === 'asc' ? '#3f51b5' : '#e0e0e0'
              }}
              aria-label="Sort ascending"
              title="Sort ascending"
            >
              ↑
            </button>
            <button 
              onClick={() => handleSortChange('secondaryDirection', 'desc')}
              style={{
                ...directionButtonStyle,
                backgroundColor: sortConfig.secondaryDirection === 'desc' ? '#3f51b5' : '#e0e0e0'
              }}
              aria-label="Sort descending"
              title="Sort descending"
            >
              ↓
            </button>
          </div>
        </div>
      </div>

      <div style={currentSortStyle}>
        <span>Sorting by: </span>
        <strong>{sortFields.find(f => f.value === sortConfig.primarySort)?.label}</strong>
        <span> ({sortConfig.primaryDirection === 'asc' ? 'ascending' : 'descending'})</span>
        <span>, then by </span>
        <strong>{sortFields.find(f => f.value === sortConfig.secondarySort)?.label}</strong>
        <span> ({sortConfig.secondaryDirection === 'asc' ? 'ascending' : 'descending'})</span>
      </div>
    </div>
  );
};

// Styles
const sortControlsContainerStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  padding: '16px',
  marginBottom: '24px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

const sortHeadingStyle = {
  fontSize: '18px',
  fontWeight: 'bold' as const,
  marginTop: 0,
  marginBottom: '16px',
  color: '#333333',
};

const sortRowStyle = {
  display: 'flex',
  flexDirection: 'row' as const,
  gap: '24px',
  flexWrap: 'wrap' as const,
};

const sortGroupStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexWrap: 'wrap' as const,
};

const labelStyle = {
  fontWeight: '500' as const,
  fontSize: '14px',
  color: '#555555',
};

const selectStyle = {
  padding: '8px 12px',
  borderRadius: '4px',
  border: '1px solid #cccccc',
  fontSize: '14px',
  backgroundColor: '#ffffff',
  minWidth: '120px',
};

const directionControlsStyle = {
  display: 'flex',
  gap: '4px',
};

const directionButtonStyle = {
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
  color: '#ffffff',
  transition: 'background-color 0.2s',
};

const currentSortStyle = {
  marginTop: '16px',
  fontSize: '14px',
  color: '#666666',
  padding: '8px',
  backgroundColor: '#f5f7fa',
  borderRadius: '4px',
};

export default SortControls;
