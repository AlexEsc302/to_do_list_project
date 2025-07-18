import React, { useState } from 'react';
import { ToDo, Priority } from '../types/ToDo';
import { TodoApi } from '../api/ToDoApi';
import '../styles/design-system.css';

interface TodoCardProps {
  todo: ToDo;
  onUpdate: (updatedTodo: ToDo) => void;
  onDelete: (id: number) => void;
}

const TodoCardModern: React.FC<TodoCardProps> = ({ todo, onUpdate, onDelete }) => {
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
        return 'var(--priority-high)';
      case 'MEDIUM':
        return 'var(--priority-medium)';
      case 'LOW':
        return 'var(--priority-low)';
      default:
        return 'var(--color-gray-500)';
    }
  };

  // Get appropriate styling based on due date
  const getDueDateStatus = (dueDate?: string): { color: string; label: string } => {
    if (!dueDate) return { color: 'var(--due-none)', label: 'No due date' };
    
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { color: 'var(--due-overdue)', label: 'Overdue' };
    if (diffDays === 0) return { color: 'var(--due-today)', label: 'Due today' };
    if (diffDays <= 3) return { color: 'var(--due-soon)', label: 'Due soon' };
    if (diffDays <= 7) return { color: 'var(--due-week)', label: 'Due this week' };
    return { color: 'var(--due-upcoming)', label: 'Upcoming' };
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
  const priorityClass = `todo-card__priority-badge--${todo.priority.toLowerCase()}`;
  const dueDateClass = `todo-card__due-date-badge--${dueDateStatus.label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`todo-card ${todo.done ? 'todo-card--done' : ''} ${isEditing ? 'todo-card--editing' : ''}`}
         style={{ borderLeft: `4px solid ${getPriorityColor(todo.priority)}` }}>
      {/* Card Header */}
      <div className="todo-card__header">
        <div className="todo-card__title-area">
          <input
            type="checkbox"
            checked={todo.done}
            onChange={handleToggleDone}
            className="todo-card__checkbox"
            id={`todo-checkbox-${todo.id}`}
          />
          <label 
            htmlFor={`todo-checkbox-${todo.id}`}
            style={{ cursor: 'pointer' }}
          >
            {!isEditing ? (
              <span className={`todo-card__title ${todo.done ? 'todo-card__title--done' : ''}`}>
                {todo.name}
              </span>
            ) : (
              <input
                type="text"
                value={editValues.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="todo-card__input"
              />
            )}
          </label>
        </div>
        
        <div className="todo-card__actions">
          <button 
            onClick={() => setExpanded(!expanded)}
            className="todo-card__button"
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? '▲' : '▼'}
          </button>
          
          {!isEditing ? (
            <>
              <button 
                onClick={() => setIsEditing(true)}
                className="todo-card__button"
                aria-label="Edit"
              >
                ✏️
              </button>
              <button 
                onClick={handleDelete}
                className="todo-card__button todo-card__button--delete"
                aria-label="Delete"
              >
                🗑️
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={handleSave}
                className="todo-card__button"
                aria-label="Save"
              >
                💾
              </button>
              <button 
                onClick={() => {
                  setIsEditing(false);
                  setEditValues({
                    name: todo.name,
                    description: todo.description || '',
                    priority: todo.priority,
                    dueDate: todo.dueDate || undefined
                  });
                }}
                className="todo-card__button"
                aria-label="Cancel"
              >
                ❌
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Card Metadata */}
      <div className="todo-card__meta">
        <div className={`todo-card__priority-badge ${priorityClass}`}>
          {!isEditing ? (
            todo.priority
          ) : (
            <select
              value={editValues.priority}
              onChange={(e) => handleChange('priority', e.target.value as Priority)}
              className="todo-card__input"
            >
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          )}
        </div>
        
        <div className={`todo-card__due-date-badge ${dueDateClass}`}>
          {!isEditing ? (
            todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : 'No due date'
          ) : (
            <input
              type="date"
              value={editValues.dueDate || ''}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              className="todo-card__input"
            />
          )}
        </div>
      </div>
      
      {/* Expanded Content */}
      {expanded && (
        <div className="todo-card__content">
          <h4 className="text-lg font-medium mb-2">Description</h4>
          {!isEditing ? (
            <p className="todo-card__description">
              {todo.description || 'No description provided.'}
            </p>
          ) : (
            <textarea
              value={editValues.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              className="todo-card__input"
              rows={3}
              placeholder="Add a description..."
            />
          )}
          
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex items-center">
              <span className="text-sm text-gray mr-2">Status:</span>
              <span className={`text-sm font-medium ${todo.done ? 'text-success' : 'text-warning'}`}>
                {todo.done ? 'Completed' : 'Active'}
              </span>
            </div>
            
            {todo.done && todo.doneDate && (
              <div className="flex items-center">
                <span className="text-sm text-gray mr-2">Completed on:</span>
                <span className="text-sm">
                  {new Date(todo.doneDate).toLocaleDateString()}
                </span>
              </div>
            )}
            
            {todo.createdDate && (
              <div className="flex items-center">
                <span className="text-sm text-gray mr-2">Created:</span>
                <span className="text-sm">
                  {new Date(todo.createdDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoCardModern;
