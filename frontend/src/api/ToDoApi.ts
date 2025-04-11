const API_BASE_URL = 'http://localhost:9090';

export const fetchTodos = async (params = '') => {
  const response = await fetch(`${API_BASE_URL}/todos?${params}`);
  return response.json();
};

export const createTodo = async (todo: any) => {
  const response = await fetch(`${API_BASE_URL}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todo),
  });
  return response.json();
};

export const updateTodo = async (todo: any) => {
    const { id, ...body } = todo;
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return response.json();
};
  

export const markAsDoneTodo = async (todo: any) => {
    const response = await fetch(`${API_BASE_URL}/todos/${todo.id}/done`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    });
    return response.json();
};

export const markAsUnDoneTodo = async (todo: any) => {
    const response = await fetch(`${API_BASE_URL}/todos/${todo.id}/undone`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    });
    return response.json();
};

export async function fetchMetrics() {
    const response = await fetch(`${API_BASE_URL}/todos/metrics`);
    if (!response.ok) throw new Error("Error fetching metrics");
    return response.json();
}
  
export const deleteTodo = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Error deleting ToDo');
  }
};
