import React, { useState } from 'react';
import { createTodo } from '../api/ToDoApi';

const AddToDoButton: React.FC<{ onAdd: () => void }> = ({ onAdd }) => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('LOW');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newToDo = {
      name,
      description,
      priority,
      dueDate: dueDate || null,
      done: false,
      doneDate: null,
    };

    try {
      await createTodo(newToDo);
      onAdd();
      setShowForm(false);
      setName('');
      setDescription('');
      setPriority('LOW');
      setDueDate('');
    } catch (error) {
      console.error('Error creating todo:', error);
      // Optionally display an error message to the user
    }
  };

  return (
    <div style={addToDoContainerStyle}>
      <button onClick={() => setShowForm(!showForm)} style={addButton}>
        {showForm ? 'Cancel Add' : '➕ Add New ToDo'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={formStyle}>
          <div>
            <label htmlFor="name" style={labelStyle}>Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label htmlFor="description" style={labelStyle}>Description:</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label htmlFor="priority" style={labelStyle}>Priority:</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={selectStyle}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          <div>
            <label htmlFor="dueDate" style={labelStyle}>Due Date:</label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={inputStyle}
            />
          </div>
          <button type="submit" style={submitButton}>Create ToDo</button>
        </form>
      )}
    </div>
  );
};

const addToDoContainerStyle = {
  margin: '1.5rem 0',
};

const addButton = {
  padding: '0.75rem 1.25rem',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: '#28a745', // Green
  color: '#fff',
  cursor: 'pointer',
  fontSize: '1rem',
  transition: 'background-color 0.3s ease',

  '&:hover': {
    backgroundColor: '#218838',
  },
};

const formStyle = {
  marginTop: '1rem',
  padding: '1.5rem',
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  gap: '1rem',
};

const labelStyle = {
  fontWeight: 'bold',
  marginBottom: '0.5rem',
  color: '#555',
};

const inputStyle = {
  padding: '0.75rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '1rem',
};

const selectStyle = {
  padding: '0.75rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '1rem',
};

const submitButton = {
  padding: '0.75rem 1.25rem',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: '#007bff', // Blue
  color: '#fff',
  cursor: 'pointer',
  fontSize: '1rem',
  transition: 'background-color 0.3s ease',

  '&:hover': {
    backgroundColor: '#0056b3',
  },
};

export default AddToDoButton;