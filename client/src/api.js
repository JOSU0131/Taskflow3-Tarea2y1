const BASE_URL = 'http://localhost:3000/api/v1/tasks';

// 1. Obtener todas las tareas (GET)
export const fetchTasks = async () => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Error al obtener tareas');
  return res.json();
};

// 2. Crear tarea (POST)
export const createTask = async (task) => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  });
  if (!res.ok) throw new Error('Error al crear tarea');
  return res.json();
};

// 3. Eliminar tarea (DELETE)
export const deleteTask = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Error al eliminar tarea');
};

