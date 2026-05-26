require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const tareasRoutes = require('./routes/tareasRoutes');
const { loggerMiddleware } = require('./middlewares/loggerMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middlewares globales ────────────────────────────────────────────────────
app.use(cors({
    origin: '*',
    allowedHeaders: ['Content-Type', 'x-api-key']
}));
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());
app.use(loggerMiddleware);

// ─── Ruta de login (genera cookie de sesión) ─────────────────────────────────
// Usuario y contraseña fijos para demostración
app.post('/login', (req, res) => {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
        return res.status(400).json({ ok: false, mensaje: 'Usuario y contraseña son requeridos' });
    }

    if (usuario === 'admin' && password === '123') {
        // Crear cookie de sesión (httpOnly para seguridad)
        res.cookie('sesion_id', 'sesion_activa_' + Date.now(), {
            httpOnly: true,
            maxAge: 60 * 60 * 1000 // 1 hora
        });
        return res.status(200).json({ ok: true, mensaje: 'Login exitoso' });
    }

    return res.status(401).json({ ok: false, mensaje: 'Credenciales incorrectas' });
});

// ─── Ruta de logout (elimina cookie de sesión) ───────────────────────────────
app.post('/logout', (req, res) => {
    res.clearCookie('sesion_id');
    res.status(200).json({ ok: true, mensaje: 'Sesión cerrada' });
});

// ─── Rutas de tareas ─────────────────────────────────────────────────────────
app.use('/tareas', tareasRoutes);

// ─── Middleware global de manejo de errores (debe ir al final) ───────────────
app.use((err, req, res, next) => {
    console.error('[ERROR]', err.stack);
    res.status(500).json({ error: 'Algo salió mal en el servidor' });
});

// ─── Iniciar servidor ────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📋 Maqueta disponible en http://localhost:${PORT}`);
});
