// ─── Capa de negocio: Controladores ──────────────────────────────────────────
// Contiene la lógica de cada operación CRUD.
// Delega el acceso a datos al modelo (tareaModel).
// Delega validación y normalización al service (tareaService).

const tareaModel = require('../models/tareaModel');
const tareaService = require('../services/tareaService');

// ─── GET /tareas ──────────────────────────────────────────────────────────────
// TAREA 2: Retorna todas las tareas, con filtro opcional por query string
const getTareas = (req, res) => {
    let tareas = tareaModel.getAll();
    
    // TAREA 2: Filtro por query string ?descripcion=texto
    const { descripcion } = req.query;
    if (descripcion && descripcion.trim() !== '') {
        const busqueda = descripcion.trim().toLowerCase();
        tareas = tareas.filter(t => 
            t.descripcion.toLowerCase().includes(busqueda)
        );
    }
    
    res.status(200).json({
        ok: true,
        total: tareas.length,
        tareas: tareas
    });
};

// ─── GET /tareas/:id ──────────────────────────────────────────────────────────
// Retorna una tarea específica por su ID
const getTareaById = (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: 'El ID debe ser un número entero' });
    }

    const tarea = tareaModel.getById(id);

    if (!tarea) {
        return res.status(404).json({ error: `Tarea con id ${id} no encontrada` });
    }

    res.status(200).json(tarea);
};

// ─── POST /tareas ─────────────────────────────────────────────────────────────
// TAREA 1: Crea una nueva tarea (validación y normalización con service)
const crearTarea = (req, res) => {
    // TAREA 1: Validar con el service
    const { valido, error } = tareaService.validarDatos(req.body);
    if (!valido) {
        return res.status(400).json({
            ok: false,
            error: error
        });
    }
    
    // TAREA 1: Normalizar con el service
    const datosSeguros = tareaService.prepararTarea(req.body);
    
    const nuevaTarea = tareaModel.create(datosSeguros.descripcion);
    res.status(201).json(nuevaTarea);
};

// ─── PUT /tareas/:id ──────────────────────────────────────────────────────────
// Marca una tarea como completada
const completarTarea = (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: 'El ID debe ser un número entero' });
    }

    const tarea = tareaModel.complete(id);

    if (!tarea) {
        return res.status(404).json({ error: `Tarea con id ${id} no encontrada` });
    }

    res.status(200).json(tarea);
};

// ─── DELETE /tareas/:id ───────────────────────────────────────────────────────
// Elimina una tarea por su ID
const eliminarTarea = (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: 'El ID debe ser un número entero' });
    }

    const tareaEliminada = tareaModel.remove(id);

    if (!tareaEliminada) {
        return res.status(404).json({ error: `Tarea con id ${id} no encontrada` });
    }

    res.status(200).json({ mensaje: 'Tarea eliminada correctamente', tarea: tareaEliminada });
};

module.exports = { getTareas, getTareaById, crearTarea, completarTarea, eliminarTarea };
