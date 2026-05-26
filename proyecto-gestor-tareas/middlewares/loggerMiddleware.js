// ─── Middleware de Logs ───────────────────────────────────────────────────────
// Registra en consola cada request que llega al servidor con:
// método HTTP, ruta, código de estado y tiempo de respuesta

const loggerMiddleware = (req, res, next) => {
    const inicio = Date.now();
    const timestamp = new Date().toISOString();

    // Cuando la respuesta termine, registrar el resultado
    res.on('finish', () => {
        const duracion = Date.now() - inicio;
        const { method, originalUrl } = req;
        const { statusCode } = res;

        // Color según el código de estado HTTP
        const color =
            statusCode >= 500 ? '\x1b[31m' : // Rojo  → errores de servidor
            statusCode >= 400 ? '\x1b[33m' : // Amarillo → errores de cliente
            statusCode >= 200 ? '\x1b[32m' : // Verde  → éxito
            '\x1b[0m';

        const reset = '\x1b[0m';

        console.log(
            `[${timestamp}] ${color}${method} ${originalUrl} → ${statusCode}${reset} (${duracion}ms)`
        );
    });

    next();
};

module.exports = { loggerMiddleware };
