// ─── Capa de Servicios ───────────────────────────────────────────────────────
// Contiene la lógica de negocio: validación y preparación de datos.
// Los controladores llaman a estos servicios antes de acceder al modelo.

/**
 * TAREA 1: Valida que los datos de la tarea sean correctos
 * @param {Object} body - Datos de la tarea
 * @returns {Object} { valido: boolean, error?: string }
 */
function validarDatos(body) {
    const { descripcion } = body;
    
    if (!descripcion) {
        return { valido: false, error: 'El campo descripcion es requerido' };
    }
    
    if (typeof descripcion !== 'string') {
        return { valido: false, error: 'El campo descripcion debe ser una cadena de texto' };
    }
    
    if (descripcion.trim() === '') {
        return { valido: false, error: 'El campo descripcion no puede estar vacío' };
    }
    
    if (descripcion.length > 200) {
        return { valido: false, error: 'La descripción no puede exceder los 200 caracteres' };
    }
    
    return { valido: true };
}

/**
 * TAREA 1: Prepara y normaliza los datos de la tarea
 * @param {Object} body - Datos crudos de la tarea
 * @returns {Object} Datos normalizados
 */
function prepararTarea(body) {
    return {
        descripcion: body.descripcion.trim().toLowerCase()
    };
}

module.exports = {
    validarDatos,
    prepararTarea
};
