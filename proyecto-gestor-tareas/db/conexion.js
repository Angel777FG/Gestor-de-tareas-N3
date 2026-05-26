// ─── Capa de datos: conexión a la base de datos ──────────────────────────────
// En este proyecto se usa almacenamiento en memoria (array).
// Para conectar con MySQL real, reemplaza este módulo por:
//
//   const mysql = require('mysql2/promise');
//   const pool = mysql.createPool({ host, user, password, database });
//   module.exports = pool;

const db = {
    tareas: [
        { id: 1, descripcion: 'Aprender Node.js y Express', completada: false },
        { id: 2, descripcion: 'Integrar backend con maqueta', completada: false },
        { id: 3, descripcion: 'Probar endpoints con Postman', completada: true }
    ],
    nextId: 4
};

console.log('✅ Base de datos en memoria inicializada');

module.exports = db;
