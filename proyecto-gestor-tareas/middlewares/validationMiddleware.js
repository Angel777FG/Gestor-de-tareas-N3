// ─── Middleware de Validación ─────────────────────────────────────────────────
// Valida los datos de entrada antes de que lleguen al controlador

const validarTarea = (req, res, next) => {
    const { descripcion } = req.body;

    // 1. Verificar que existe el campo descripcion
    if (descripcion === undefined || descripcion === null) {
        return res.status(400).json({
            error: 'El campo "descripcion" es obligatorio'
        });
    }

    // 2. Verificar que no esté vacía ni tenga solo espacios
    if (typeof descripcion !== 'string' || descripcion.trim().length === 0) {
        return res.status(400).json({
            error: 'La descripción no puede estar vacía ni tener solo espacios'
        });
    }

    // 3. Verificar que no supere los 100 caracteres
    if (descripcion.trim().length > 100) {
        return res.status(400).json({
            error: 'La descripción no puede tener más de 100 caracteres'
        });
    }

    // Validación exitosa → continuar al controlador
    next();
};

module.exports = { validarTarea };
