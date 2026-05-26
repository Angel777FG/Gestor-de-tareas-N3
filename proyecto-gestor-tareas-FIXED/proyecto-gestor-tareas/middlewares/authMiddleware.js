// ─── Middleware de Autenticación ──────────────────────────────────────────────
// TAREA 3: Verifica que la petición tenga el header x-api-key correcto.
// Si no lo tiene o es incorrecto, responde 401 Unauthorized.
//
// Uso en rutas que requieren autenticación:
//   router.post('/', verificarApiKey, validarTarea, crearTarea);

// TAREA 3: Clave definida en el servidor
const API_KEY = 'eval-s12-2024';

/**
 * TAREA 3: Middleware para verificar API Key
 * Protege endpoints de escritura (POST, PUT, DELETE)
 */
const verificarApiKey = (req, res, next) => {
    const keyRecibida = req.headers['x-api-key'];
    
    if (!keyRecibida || keyRecibida !== API_KEY) {
        return res.status(401).json({
            ok: false,
            error: 'API key inválida o ausente'
        });
    }
    
    // Clave correcta → continuar al controlador
    next();
};

// DEPRECATED: Middleware anterior con cookies (mantenido por compatibilidad)
const authMiddleware = (req, res, next) => {
    const sesionId = req.cookies?.sesion_id;

    if (!sesionId) {
        return res.status(401).json({
            ok: false,
            mensaje: 'Acceso denegado. Debes iniciar sesión para realizar esta acción.'
        });
    }

    next();
};

module.exports = { authMiddleware, verificarApiKey };
