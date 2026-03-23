
// Los controllers es un "TRADUCTOR HTTP"
// realiza peticiones HTTP, procesa y devolve una respuesta adecuada.
const service = require("../services/task.service");

function getTasks(req, res) {
  const tasks = service.obtenerTodas();
  res.json(tasks);
}

function createTask(req, res) {
  const { title } = req.body;

  // VALIDACIÓN
  // llama al servicio → responde con un error si no se cumple la validación
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const nueva = service.crearTarea({ title });

  res.status(201).json(nueva);
}

function deleteTask(req, res) {
  const { id } = req.params;

  service.eliminarTarea(id);

  res.status(204).send();
}

module.exports = {
  getTasks,
  createTask,
  deleteTask
};