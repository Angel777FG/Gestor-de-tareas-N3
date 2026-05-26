// script.js - Cliente para conectar con el backend
const API_URL = 'http://localhost:3000/tareas';

// ─── API Key para autenticación ──────────────────────────────────────────────
// TAREA 3: Header requerido para operaciones de escritura
const API_KEY = 'eval-s12-2024';

// ─── Estado ───────────────────────────────────────────────────────────────────
let todasLasTareas = [];
let filtroActual = 'todas';

// ─── Elementos del DOM ────────────────────────────────────────────────────────
const listaTareas      = document.getElementById('listaTareas');
const nuevaTareaInput  = document.getElementById('nuevaTarea');
const btnAgregar       = document.getElementById('btnAgregar');
const mensajeErrorDiv  = document.getElementById('mensajeError');
const mensajeErrorText = document.getElementById('mensajeErrorTexto');
const statTotal        = document.getElementById('statTotal');
const statPendientes   = document.getElementById('statPendientes');
const statCompletadas  = document.getElementById('statCompletadas');

// ─── Mostrar mensajes de error temporales ─────────────────────────────────────
function mostrarError(mensaje) {
    mensajeErrorText.textContent = mensaje;
    mensajeErrorDiv.classList.add('visible');
    setTimeout(() => {
        mensajeErrorDiv.classList.remove('visible');
    }, 3000);
}

// ─── Actualizar stats ─────────────────────────────────────────────────────────
function actualizarStats(tareas) {
    const total = tareas.length;
    const completadas = tareas.filter(t => t.completada).length;
    const pendientes = total - completadas;
    statTotal.textContent = total;
    statPendientes.textContent = pendientes;
    statCompletadas.textContent = completadas;
}

// ─── Cargar tareas desde el backend ──────────────────────────────────────────
async function cargarTareas() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
        const data = await response.json();
        // El backend devuelve { ok, total, tareas: [...] }
        todasLasTareas = Array.isArray(data) ? data : (data.tareas || []);
        actualizarStats(todasLasTareas);
        aplicarFiltro();
    } catch (error) {
        mostrarError('Error al cargar tareas: ' + error.message);
    }
}

// ─── Filtrar tareas ───────────────────────────────────────────────────────────
function aplicarFiltro() {
    let tareasFiltradas = todasLasTareas;
    if (filtroActual === 'pendientes') {
        tareasFiltradas = todasLasTareas.filter(t => !t.completada);
    } else if (filtroActual === 'completadas') {
        tareasFiltradas = todasLasTareas.filter(t => t.completada);
    }
    renderizarTareas(tareasFiltradas);
}

// ─── Renderizar tareas en la maqueta ─────────────────────────────────────────
function renderizarTareas(tareas) {
    if (!tareas || tareas.length === 0) {
        listaTareas.innerHTML = '<li class="cargando">Sin tareas en esta categoría.</li>';
        return;
    }

    listaTareas.innerHTML = '';

    tareas.forEach(tarea => {
        const li = document.createElement('li');
        li.className  = tarea.completada ? 'completada' : '';
        li.dataset.id = tarea.id;

        li.innerHTML = `
            <div class="check-circle">${tarea.completada ? '✓' : ''}</div>
            <span class="texto-tarea">${escapeHTML(tarea.descripcion)}</span>
            <div class="acciones">
                ${!tarea.completada
                    ? `<button class="btn-completar" title="Marcar como completada">✓ Completar</button>`
                    : ''}
                <button class="btn-eliminar" title="Eliminar tarea">✕ Eliminar</button>
            </div>
        `;

        const btnCompletar = li.querySelector('.btn-completar');
        if (btnCompletar) {
            btnCompletar.addEventListener('click', () => completarTarea(tarea.id));
        }
        li.querySelector('.btn-eliminar').addEventListener('click', () => eliminarTarea(tarea.id));
        listaTareas.appendChild(li);
    });
}

// ─── Agregar nueva tarea ──────────────────────────────────────────────────────
async function agregarTarea() {
    const descripcion = nuevaTareaInput.value.trim();

    if (!descripcion) {
        mostrarError('La descripción no puede estar vacía');
        return;
    }
    if (descripcion.length > 100) {
        mostrarError('La descripción no puede tener más de 100 caracteres');
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-api-key': API_KEY  // TAREA 3: Header de autenticación
            },
            body: JSON.stringify({ descripcion })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Error ${response.status}`);
        }

        nuevaTareaInput.value = '';
        await cargarTareas();
    } catch (error) {
        mostrarError('Error al agregar tarea: ' + error.message);
    }
}

// ─── Marcar tarea como completada ─────────────────────────────────────────────
async function completarTarea(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'x-api-key': API_KEY  // TAREA 3: Header de autenticación
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Error ${response.status}`);
        }

        await cargarTareas();
    } catch (error) {
        mostrarError('Error al completar tarea: ' + error.message);
    }
}

// ─── Eliminar tarea ───────────────────────────────────────────────────────────
async function eliminarTarea(id) {
    if (!confirm('¿Seguro que deseas eliminar esta tarea?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, { 
            method: 'DELETE',
            headers: {
                'x-api-key': API_KEY  // TAREA 3: Header de autenticación
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Error ${response.status}`);
        }

        await cargarTareas();
    } catch (error) {
        mostrarError('Error al eliminar tarea: ' + error.message);
    }
}

// ─── Utilidad para prevenir XSS ──────────────────────────────────────────────
function escapeHTML(str) {
    return str.replace(/[&<>]/g, m => {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// ─── Event Listeners ──────────────────────────────────────────────────────────
btnAgregar.addEventListener('click', agregarTarea);

nuevaTareaInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') agregarTarea();
});

document.querySelectorAll('.pill').forEach(pill => {
    pill.addEventListener('click', () => {
        document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        filtroActual = pill.dataset.filter;
        aplicarFiltro();
    });
});

// Cargar tareas al iniciar la página
cargarTareas();
