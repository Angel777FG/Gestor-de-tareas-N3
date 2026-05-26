// ─── Capa de datos: Modelo de Tareas ─────────────────────────────────────────
// Único lugar que interactúa directamente con la base de datos.
// Devuelve los datos al controlador sin lógica de negocio.

const db = require('../db/conexion');

const getAll = () => {
    return db.tareas;
};

const getById = (id) => {
    return db.tareas.find(t => t.id === id) || null;
};

const create = (descripcion) => {
    const nueva = { id: db.nextId++, descripcion: descripcion.trim(), completada: false };
    db.tareas.push(nueva);
    return nueva;
};

const complete = (id) => {
    const tarea = db.tareas.find(t => t.id === id);
    if (!tarea) return null;
    tarea.completada = true;
    return tarea;
};

const remove = (id) => {
    const index = db.tareas.findIndex(t => t.id === id);
    if (index === -1) return null;
    return db.tareas.splice(index, 1)[0];
};

module.exports = { getAll, getById, create, complete, remove };
