
// Los controllers es un "TRADUCTOR HTTP"
// realiza peticiones HTTP, procesa y devolve una respuesta adecuada.
const service = require("../services/task.service");

function getTasks(req, res) {
  const tasks = service.obtenerTodas();
  res.json(tasks);
}

function createTask(req, res) {
  
  // VALIDACIÓN
  // llama al servicio → responde con un error si no se cumple la validación
  // Verificamos si req.body existe (por si mandan el body vacío en Thunder Client)
  if (!req.body) {
    return res.status(400).json({ error: "El cuerpo de la petición no puede estar vacío" });
  }

  // 1. Extraemos los 3 campos que envía el Frontend
  const { title, category, priority } = req.body;

  // Validación defensiva 
  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    return res.status(400).json({ 
      error: "El título es obligatorio, debe ser un texto y tener al menos 3 caracteres." 
    });
  }

  // 2. Se los pasamos TODOS al servicio
  // Usamos .trim() para que no nos guarden espacios vacíos raros
  const nueva = service.crearTarea({
    title: title.trim(),
    category: category || "Todas",
    priority: priority || "Alta"
  });
  res.status(201).json(nueva);
}

function deleteTask(req, res, next) {
try {
  service.eliminarTarea(req.params.id);

  res.status(204).send();
    } catch (error) { next(error) };  
}

module.exports = {
  getTasks,
  createTask,
  deleteTask
};