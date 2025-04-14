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

        await createTodo(newToDo);
        onAdd();
        setShowForm(false); 
        setName('');
        setDescription('');
        setPriority('LOW');
        setDueDate('');
    };

  return (
    <div style={{ margin: '1rem 0' }}>
        <button onClick={() => setShowForm(!showForm)} style={{ marginTop: '1rem',  backgroundColor: 'lightblue'}}>
            {showForm ? 'Cancel' : 'Add New ToDo'}
        </button>

        {showForm && (
            <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
            <div style={{ marginTop: '1rem' }}>
                <label>Name: </label>
                <input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div style={{ marginTop: '1rem' }}>
                <label>Description: </label>
                <input value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div style={{ marginTop: '1rem' }}>
                <label>Priority: </label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                </select>
            </div>
            <div style={{ marginTop: '1rem' }}>
                <label>Due Date: </label>
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
            <button type="submit" style={{ backgroundColor: 'lightgreen'}}>Create</button>
            </form>
        )}
    </div>
  );
};

export default AddToDoButton;
