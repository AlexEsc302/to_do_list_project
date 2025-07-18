import React, { useState } from 'react';
import { ToDo, Priority } from '../types/ToDo';
import { TodoApi } from '../api/ToDoApi';

interface TodoCardProps {
  todo: ToDo;
  onUpdate: (updatedTodo: ToDo) => void;
  onDelete: (id: number) => void;
}

const TodoCard: React.FC<TodoCardProps> = ({ todo, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [editValues, setEditValues] = useState<Partial<ToDo>>({
    name: todo.name,
    description: todo.description || '',
    priority: todo.priority,
    dueDate: todo.dueDate || undefined
  });

  // Get appropriate styling based on priority
  const getPriorityColor = (priority: Priority): string => {
    switch (priority) {
      case 'HIGH':
        return '#f44336'; // Red
      case 'MEDIUM':
        return '#ff9800'; // Orange
      case 'LOW':
        return '#4caf50'; // Green
      default:
        return '#757575'; // Gray
    }
  };

  // Get appropriate styling based on due date
  const getDueDateStatus = (dueDate?: string): { color: string; label: string } => {
    if (!dueDate) return { color: '#9e9e9e', label: 'No due date' };
    
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { color: '#d32f2f', label: 'Overdue' };
    if (diffDays === 0) return { color: '#f44336', label: 'Due today' };
    if (diffDays <= 3) return { color: '#ff9800', label: 'Due soon' };
    if (diffDays <= 7) return { color: '#ffc107', label: 'Due this week' };
    return { color: '#4caf50', label: 'Upcoming' };
  };

  const handleChange = (field: string, value: any) => {
    setEditValues({ ...editValues, [field]: value });
  };

  const handleSave = async () => {
    try {
      const updatedTodo = await TodoApi.updateTodo(todo.id, editValues);
      onUpdate(updatedTodo);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleToggleDone = async () => {
    try {
      let updatedTodo;
      if (todo.done) {
        updatedTodo = await TodoApi.markAsUndone(todo.id);
      } else {
        updatedTodo = await TodoApi.markAsDone(todo.id);
      }
      onUpdate(updatedTodo);
    } catch (error) {
      console.error('Error toggling todo status:', error);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(todo.id);
    }
  };

  const dueDateStatus = getDueDateStatus(todo.dueDate || undefined);

  return (
    <div style={{
      ...cardStyle,
      borderLeft: `4px solid ${getPriorityColor(todo.priority)}`,
      opacity: todo.done ? 0.8 : 1,
      transform: isEditing ? 'scale(1.02)' : 'scale(1)'
    }}>
      {/* Card Header */}
      <div style={cardHeaderStyle}>
        <div style={cardCheckboxContainer}>
          <input
            type="checkbox"
            checked={todo.done}
            onChange={handleToggleDone}
            style={checkboxStyle}
            id={`todo-checkbox-${todo.id}`}
          />
          <label 
            htmlFor={`todo-checkbox-${todo.id}`}
            style={{ cursor: 'pointer' }}
          >
            {!isEditing ? (
              <span style={{
                ...cardTitleStyle,
                textDecoration: todo.done ? 'line-through' : 'none',
                color: todo.done ? '#757575' : '#212121'
              }}>
                {todo.name}
              </span>
            ) : (
              <input
                type="text"
                value={editValues.name}
                onChange={(e) => handleChange('name', e.target.value)}
                style={editInputStyle}
              />
            )}
          </label>
        </div>
        
        <div style={cardActionsStyle}>
          <button 
            onClick={() => setExpanded(!expanded)}
            style={iconButtonStyle}
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? '▲' : '▼'}
          </button>
          
          {!isEditing ? (
            <>
              <button 
                onClick={() => setIsEditing(true)}
                style={iconButtonStyle}
                aria-label="Edit"
              >
                ✏️
              </button>
              <button 
                onClick={handleDelete}
                style={{...iconButtonStyle, color: '#f44336'}}
                aria-label="Delete"
              >
                🗑️
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={handleSave}
                style={{...iconButtonStyle, color: '#4caf50'}}
                aria-label="Save"
              >
                💾
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                style={{...iconButtonStyle, color: '#f44336'}}
                aria-label="Cancel"
              >
                ✖️
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Card Metadata */}
      <div style={metadataContainerStyle}>
        <div style={metadataItemStyle}>
          <span style={metadataLabelStyle}>Priority:</span>
          {!isEditing ? (
            <span style={{
              ...priorityBadgeStyle,
              backgroundColor: getPriorityColor(todo.priority),
            }}>
              {todo.priority}
            </span>
          ) : (
            <select
              value={editValues.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
              style={editSelectStyle}
            >
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          )}
        </div>
        
        <div style={metadataItemStyle}>
          <span style={metadataLabelStyle}>Due:</span>
          {!isEditing ? (
            <span style={{
              ...dueDateBadgeStyle, 
              backgroundColor: dueDateStatus.color,
            }}>
              {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : 'None'}
            </span>
          ) : (
            <input
              type="date"
              value={editValues.dueDate || ''}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              style={editInputStyle}
            />
          )}
        </div>
      </div>
      
      {/* Expanded Content */}
      {expanded && (
        <div style={expandedContentStyle}>
          <h4 style={expandedHeadingStyle}>Description</h4>
          {!isEditing ? (
            <p style={descriptionStyle}>
              {todo.description || 'No description provided.'}
            </p>
          ) : (
            <textarea
              value={editValues.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              style={editTextareaStyle}
              rows={3}
              placeholder="Add a description..."
            />
          )}
          
          <div style={statusContainerStyle}>
            <div style={statusItemStyle}>
              <span style={statusLabelStyle}>Status:</span>
              <span style={{
                ...statusValueStyle,
                color: todo.done ? '#4caf50' : '#ff9800'
              }}>
                {todo.done ? 'Completed' : 'Active'}
              </span>
            </div>
            
            {todo.done && todo.doneDate && (
              <div style={statusItemStyle}>
                <span style={statusLabelStyle}>Completed on:</span>
                <span style={statusValueStyle}>
                  {new Date(todo.doneDate).toLocaleDateString()}
                </span>
              </div>
            )}
            
            <div style={statusItemStyle}>
              <span style={statusLabelStyle}>Created:</span>
              <span style={statusValueStyle}>
                {new Date(todo.createdDate || Date.now()).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const cardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  padding: '16px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  marginBottom: '16px',
  transition: 'all 0.3s ease',
};

const cardHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '12px',
};

const cardCheckboxContainer = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const checkboxStyle = {
  width: '20px',
  height: '20px',
  cursor: 'pointer',
};

const cardTitleStyle = {
  fontSize: '16px',
  fontWeight: 'bold' as const,
  margin: 0,
  paddingRight: '8px',
};

const cardActionsStyle = {
  display: 'flex',
  gap: '4px',
};

const iconButtonStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '16px',
  padding: '4px',
  borderRadius: '4px',
  transition: 'background-color 0.2s',
  
  '&:hover': {
    backgroundColor: '#f5f5f5',
  }
};

const metadataContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: '12px',
  marginBottom: '12px',
};

const metadataItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
};

const metadataLabelStyle = {
  fontSize: '14px',
  color: '#757575',
};

const priorityBadgeStyle = {
  display: 'inline-block',
  padding: '4px 8px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: 'bold' as const,
  color: 'white',
  textTransform: 'uppercase' as const,
};

const dueDateBadgeStyle = {
  display: 'inline-block',
  padding: '4px 8px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: 'bold' as const,
  color: 'white',
};

const expandedContentStyle = {
  borderTop: '1px solid #eeeeee',
  marginTop: '12px',
  paddingTop: '12px',
};

const expandedHeadingStyle = {
  fontSize: '14px',
  fontWeight: 'bold' as const,
  margin: '0 0 8px 0',
  color: '#555555',
};

const descriptionStyle = {
  fontSize: '14px',
  color: '#666666',
  margin: '0 0 16px 0',
  lineHeight: '1.5',
};

const statusContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
  gap: '8px',
  borderTop: '1px solid #eeeeee',
  paddingTop: '12px',
};

const statusItemStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
};

const statusLabelStyle = {
  fontSize: '12px',
  color: '#757575',
};

const statusValueStyle = {
  fontSize: '14px',
  fontWeight: '500' as const,
};

const editInputStyle = {
  padding: '6px 8px',
  borderRadius: '4px',
  border: '1px solid #cccccc',
  fontSize: '14px',
};

const editSelectStyle = {
  padding: '6px 8px',
  borderRadius: '4px',
  border: '1px solid #cccccc',
  fontSize: '14px',
  minWidth: '100px',
};

const editTextareaStyle = {
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #cccccc',
  fontSize: '14px',
  width: '100%',
  resize: 'vertical' as const,
};

export default TodoCard;
