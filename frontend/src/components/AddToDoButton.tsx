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

  return (
    <div className="mb-4">
      <button 
        onClick={() => setShowForm(!showForm)} 
        className={`btn ${showForm ? 'btn-outline-secondary' : 'btn-success'} d-flex align-items-center`}
      >
        {showForm ? (
          <>
            <i className="fas fa-times me-2"></i> 
            Cancel
          </>
        ) : (
          <>
            <i className="fas fa-plus me-2"></i>
            Add New Task
          </>
        )}
      </button>

      {showForm && (
        <div className="card mt-3 shadow-sm">
          <div className="card-header bg-light">
            <h5 className="mb-0">Create New Task</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Task Name</label>
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
              
              <div className="mb-3">
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
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="priority" className="form-label">Priority</label>
                  <select
                    className="form-select"
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                
                <div className="col-md-6">
                  <label htmlFor="dueDate" className="form-label">Due Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="dueDate"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="d-flex justify-content-end">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary me-2"
                  onClick={resetForm}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Creating...
                    </>
                  ) : 'Create Task'}
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