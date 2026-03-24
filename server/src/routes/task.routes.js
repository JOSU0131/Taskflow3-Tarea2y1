
// ROUTERS: "conectar todo"
// Son los encargados de definir las rutas de la aplicación y asociarlas a los controllers correspondientes.
const express = require("express");
const router = express.Router();
const controller = require("../controllers/task.controller");

router.get("/", controller.getTasks);
router.post("/", controller.createTask);
router.delete("/:id", controller.deleteTask);

module.exports = router;