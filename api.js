const BASE_URL = "/api/v1/tasks"; // Al quitar el dominio, funcionará TANTO en local como en Vercel automáticamente


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
  // Verificamos que el ID exista antes de disparar la red
  if (!id) throw new Error('ID de tarea no válido');

  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE'
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'No se pudo borrar la tarea del servidor');
  }
  return true;
};

