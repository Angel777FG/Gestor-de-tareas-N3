const express = require('express');
const router = express.Router();
const {
    getTareas,
    getTareaById,
    crearTarea,
    completarTarea,
    eliminarTarea
} = require('../controllers/tareasController');
const { validarTarea } = require('../middlewares/validationMiddleware');
const { verificarApiKey } = require('../middlewares/authMiddleware');

// TAREA 3: GET es público (sin protección)
// GET    /tareas        → Listar todas las tareas (público)
router.get('/', getTareas);

// GET    /tareas/:id    → Obtener una tarea por ID (público)
router.get('/:id', getTareaById);

// TAREA 3: POST, PUT, DELETE protegidos con API Key
// POST   /tareas        → Crear nueva tarea (requiere API key)
router.post('/', verificarApiKey, crearTarea);

// PUT    /tareas/:id    → Marcar tarea como completada (requiere API key)
router.put('/:id', verificarApiKey, completarTarea);

// DELETE /tareas/:id   → Eliminar tarea (requiere API key)
router.delete('/:id', verificarApiKey, eliminarTarea);

module.exports = router;
