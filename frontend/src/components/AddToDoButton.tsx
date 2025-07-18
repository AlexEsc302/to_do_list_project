import React, { useState } from 'react';
import { TodoApi } from '../api/ToDoApi';
import { Priority } from '../types/ToDo';

const AddToDoButton: React.FC<{ onAdd: () => void }> = ({ onAdd }) => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('LOW');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newToDo = {
      name,
      description,
      priority,
      dueDate: dueDate || null,
    };

    try {
      await TodoApi.createTodo(newToDo);
      onAdd();
      resetForm();
    } catch (error) {
      console.error('Error creating todo:', error);
      // Error will be shown via toast from the API interceptor
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setName('');
    setDescription('');
    setPriority('LOW');
    setDueDate('');
  };

  // Helper function to get priority dot color
  const getPriorityColor = (selectedPriority: Priority) => {
    switch(selectedPriority) {
      case 'LOW':
        return 'var(--color-priority-low)';
      case 'MEDIUM':
        return 'var(--color-priority-medium)';
      case 'HIGH':
        return 'var(--color-priority-high)';
      default:
        return 'var(--color-priority-low)';
    }
  };

  return (
    <div className="add-task-container">
      <button 
        onClick={() => setShowForm(!showForm)} 
        className={`add-task-button ${showForm ? 'cancel' : 'add'}`}
      >
        {showForm ? (
          <>
            <i className="fas fa-times"></i> 
            Cancel
          </>
        ) : (
          <>
            <i className="fas fa-plus"></i>
            Add New Task
          </>
        )}
      </button>

      {showForm && (
        <div className="add-task-form-container">
          <div className="add-task-header">
            <i className="fas fa-clipboard-list add-task-header-icon"></i>
            <h5 className="add-task-title">Create New Task</h5>
          </div>
          <div className="add-task-form">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name" className="form-label">Task Name</label>
                <div className="input-container">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter task name"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  className="form-control"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Enter task description (optional)"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group-half">
                  <label htmlFor="priority" className="form-label">Priority</label>
                  <div className="priority-select-container">
                    <div 
                      className="priority-dot" 
                      style={{ backgroundColor: getPriorityColor(priority) }}
                    ></div>
                    <select
                      className="priority-select"
                      id="priority"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as Priority)}
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group-half">
                  <label htmlFor="dueDate" className="form-label">Due Date</label>
                  <div className="date-input-container">
                    <i className="fas fa-calendar-alt"></i>
                    <input
                      type="date"
                      className="form-control date-input"
                      id="dueDate"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={resetForm}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-create"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Creating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check"></i>
                      Create Task
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddToDoButton;