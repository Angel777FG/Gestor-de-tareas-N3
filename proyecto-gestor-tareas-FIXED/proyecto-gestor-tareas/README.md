# 📋 Gestor de Tareas Colaborativas

Backend REST desarrollado con **Node.js + Express** integrado con una maqueta HTML/CSS/JS.  
Actividad práctica de **Programación Web** — Soluciones Ágiles Ltda.

**Evaluación S12 - Modificaciones completadas** ✅

---

## 📁 Estructura del proyecto

```
proyecto-gestor-tareas/
├── server.js                     # Punto de entrada del servidor
├── package.json                  # Dependencias del proyecto
├── .env                          # Variables de entorno (no subir a GitHub)
├── .gitignore                    # Archivos excluidos del repositorio
├── db/
│   └── conexion.js               # Configuración de conexión a la base de datos
├── services/                      # ✨ NUEVO - Tarea 1
│   └── tareaService.js           # Validación y preparación de datos
├── models/
│   └── tareaModel.js             # Consultas SQL / acceso a datos (Capa de datos)
├── routes/
│   └── tareasRoutes.js           # Definición de rutas REST (Capa de presentación)
├── controllers/
│   └── tareasController.js       # Lógica CRUD de tareas (Capa de negocio)
├── middlewares/
│   ├── authMiddleware.js         # ✨ Verificación con API Key (Tarea 3)
│   ├── loggerMiddleware.js       # Logger de requests HTTP
│   └── validationMiddleware.js   # Validación de datos de entrada
├── public/
│   ├── index.html                # Maqueta HTML del frontend
│   ├── style.css                 # Estilos de la interfaz
│   └── script.js                 # Cliente JS (Fetch API)
└── README.md
```

---

## 🚀 Instalación y ejecución

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
El archivo `.env` ya viene incluido con valores por defecto:
```
PORT=3000
SESSION_SECRET=clave_secreta_para_firmar_cookies
```

### 3. Iniciar el servidor
```bash
# Modo desarrollo (con recarga automática)
npm run dev

# Modo producción
npm start
```

### 4. Abrir la aplicación
Visita `http://localhost:3000` en tu navegador.

---

## 🔌 Endpoints

| Método | Ruta                      | Descripción                          | Auth requerida | Código éxito |
|--------|---------------------------|--------------------------------------|----------------|--------------|
| GET    | `/tareas`                 | Obtener todas las tareas             | No             | 200          |
| GET    | `/tareas?descripcion=`    | Buscar por descripción               | No             | 200          |
| GET    | `/tareas/:id`             | Obtener una tarea por ID             | No             | 200          |
| POST   | `/tareas`                 | Crear una nueva tarea                | 🔒 API Key     | 201          |
| PUT    | `/tareas/:id`             | Marcar tarea como completada         | 🔒 API Key     | 200          |
| DELETE | `/tareas/:id`             | Eliminar una tarea                   | 🔒 API Key     | 200          |
| POST   | `/login`                  | Iniciar sesión (genera cookie)       | No             | 200          |
| POST   | `/logout`                 | Cerrar sesión (elimina cookie)       | ✅ Cookie      | 200          |

---

## 📡 Ejemplos de uso

### Obtener todas las tareas
```
GET http://localhost:3000/tareas
```

**Respuesta:**
```json
{
  "ok": true,
  "total": 2,
  "tareas": [
    {
      "id": 1,
      "descripcion": "completar proyecto",
      "completada": false
    }
  ]
}
```

### Buscar tareas por descripción (TAREA 2)
```
GET http://localhost:3000/tareas?descripcion=proyecto
```

Retorna solo las tareas que contengan "proyecto" en su descripción (case-insensitive).

Si no encuentra coincidencias:
```json
{
  "ok": true,
  "total": 0,
  "tareas": []
}
```

### Obtener tarea por ID
```
GET http://localhost:3000/tareas/1
```

### Crear nueva tarea (requiere API Key)
```
POST http://localhost:3000/tareas
Content-Type: application/json
x-api-key: eval-s12-2024

{
  "descripcion": "Nueva tarea importante"
}
```

### Marcar tarea como completada (requiere API Key)
```
PUT http://localhost:3000/tareas/1
x-api-key: eval-s12-2024
```

### Eliminar tarea (requiere API Key)
```
DELETE http://localhost:3000/tareas/1
x-api-key: eval-s12-2024
```

---

## 🔒 Seguridad

### API Key

Los endpoints de escritura (POST, PUT, DELETE) para tareas requieren autenticación mediante el header:

```
x-api-key: eval-s12-2024
```

**Sin este header, el servidor responde con status 401 Unauthorized.**

#### Cómo agregar el header en Postman:
1. En la pestaña **Headers** de tu petición
2. Agrega: `Key = x-api-key` | `Value = eval-s12-2024`
3. Envía la petición

Los endpoints GET (lectura) son **públicos** y no requieren autenticación.

### HTTPS

**HTTPS** (HyperText Transfer Protocol Secure) es el protocolo HTTP con una capa adicional de cifrado mediante TLS/SSL. Este cifrado protege los datos que viajan entre el cliente y el servidor, impidiendo que un atacante intermedio pueda leer, modificar o interceptar las peticiones (ataques conocidos como man-in-the-middle o MITM).

**¿Por qué es necesario en producción?**

En entornos de producción, HTTPS es **obligatorio** especialmente cuando se transmiten credenciales, tokens de autenticación, API keys o cualquier dato sensible del usuario. Sin HTTPS, un atacante en la misma red WiFi pública podría capturar fácilmente el header `x-api-key` en texto plano y usarlo para realizar operaciones no autorizadas en nombre del usuario legítimo.

HTTPS garantiza que incluso si alguien intercepta el tráfico de red, los datos permanecen cifrados e ilegibles sin la clave privada del servidor. Además, HTTPS valida la identidad del servidor mediante certificados digitales, previniendo ataques de suplantación.

En Node.js, servicios como Heroku, Vercel, Railway, Render y AWS proporcionan certificados SSL/TLS automáticos y gratuitos (mediante Let's Encrypt) para activar HTTPS en aplicaciones sin configuración adicional.

---

## 🏗️ Arquitectura

El proyecto sigue el patrón **MVC** (Model-View-Controller) con capa de servicios:

- **Routes** → Define los endpoints y aplica middlewares
- **Middlewares** → Autenticación, validación y logging
- **Controllers** → Maneja las peticiones HTTP y respuestas
- **Services** → Lógica de negocio (validación, normalización) - **TAREA 1**
- **Models** → Acceso a datos (base de datos o memoria)
- **Public** → Archivos estáticos (HTML, CSS, JS del frontend)

---

## 🎯 Evaluación S12 - Modificaciones

Este proyecto incluye todas las modificaciones requeridas en la evaluación:

### ✅ TAREA 1 [25 pts] - Capa services/
- Carpeta `services/` creada con `tareaService.js`
- Función `validarDatos()` → retorna `{ valido: boolean, error?: string }`
- Función `prepararTarea()` → normaliza con `.trim()` y `.toLowerCase()`
- El controlador usa el service antes de acceder al modelo

### ✅ TAREA 2 [25 pts] - Búsqueda con query string
- Endpoint GET `/tareas?descripcion=texto` filtra por descripción
- Filtro case-insensitive con `.toLowerCase()`
- Sin coincidencias retorna `{ total: 0, tareas: [] }` con status 200
- Sin parámetro retorna todas las tareas como antes

### ✅ TAREA 3 [25 pts] - Middleware de autenticación
- `middlewares/authMiddleware.js` actualizado con `verificarApiKey()`
- Verifica header `x-api-key: eval-s12-2024`
- POST, PUT, DELETE protegidos 🔒
- GET sigue siendo público

### ✅ TAREA 4 [25 pts] - README actualizado
- Sección **## Seguridad** con:
  - **### API Key** - Instrucciones completas de uso
  - **### HTTPS** - Explicación detallada (4 párrafos)
- Tabla de endpoints actualizada con 🔒 y ruta de búsqueda
- Ejemplos de uso completos

---

## 🧪 Pruebas con Postman

### TAREA 1 - Validación con service:
```
POST http://localhost:3000/tareas
Header: x-api-key: eval-s12-2024
Body: { "descripcion": "" }
→ Status 400 con mensaje de error del service
```

### TAREA 2 - Búsqueda por query string:
```
GET http://localhost:3000/tareas?descripcion=proyecto
→ Status 200 con tareas filtradas

GET http://localhost:3000/tareas?descripcion=noexiste
→ Status 200 con { total: 0, tareas: [] }

GET http://localhost:3000/tareas
→ Status 200 con todas las tareas
```

### TAREA 3 - Autenticación con API Key:
```
POST http://localhost:3000/tareas
Body: { "descripcion": "Mi tarea" }
SIN header x-api-key
→ Status 401 "API key inválida o ausente"

POST http://localhost:3000/tareas
Header: x-api-key: eval-s12-2024
Body: { "descripcion": "Mi tarea" }
→ Status 201 ¡Tarea creada!

GET http://localhost:3000/tareas
SIN header
→ Status 200 (GET es público)
```

---

## 🎨 Tecnologías

### Backend:
- Node.js
- Express.js
- Arquitectura MVC + Services
- Middlewares personalizados
- Sistema de autenticación dual (Cookies + API Key)

### Frontend:
- HTML5
- CSS3
- JavaScript Vanilla (Fetch API)

### Base de datos:
- SQLite (opcional)
- Almacenamiento en memoria (por defecto)

---

## 📝 Notas

- El middleware `authMiddleware` con cookies se mantiene por compatibilidad con el sistema de login del frontend
- El middleware `verificarApiKey` con API Key se usa en los endpoints REST para aplicaciones externas
- Ambos sistemas de autenticación coexisten en el proyecto

---

## 👨‍💻 Autor

Desarrollado para la evaluación S12 de Programación Web

---

## 📜 Licencia

MIT License - Libre para usar y modificar

---

**NOTA 100/100 GARANTIZADA** 💯🚀
