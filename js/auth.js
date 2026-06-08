/**
 * MesaMaestra - auth.js
 * Autenticación simulada con localStorage.
 * Gestiona usuarios registrados, sesión activa y protección de rutas por rol.
 */

/* ─── Claves de almacenamiento ─────────────────────────────── */

const USUARIOS_KEY = 'mesamaestra_usuarios';
const SESION_KEY = 'mesamaestra_sesion';

/* ─── Inicialización ───────────────────────────────────────── */

/**
 * Crea usuarios demo (admin y cliente) si no existen en localStorage.
 */
function inicializarUsuarios() {
  if (!localStorage.getItem(USUARIOS_KEY)) {
    const usuariosDefault = [
      {
        nombreCompleto: 'Admin MesaMaestra',
        usuario: 'admin',
        email: 'admin@mesamaestra.cl',
        password: 'Admin123',
        fechaNacimiento: '1990-01-15',
        direccion: 'Av. Providencia 123, Santiago',
        rol: 'admin'
      },
      {
        nombreCompleto: 'Cliente Demo',
        usuario: 'cliente',
        email: 'cliente@mesamaestra.cl',
        password: 'Cliente123',
        fechaNacimiento: '2000-06-20',
        direccion: 'Calle Los Juegos 456, Valparaíso',
        rol: 'cliente'
      }
    ];
    localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuariosDefault));
  }
}

/* ─── Acceso a datos de usuarios ───────────────────────────── */

function obtenerUsuarios() {
  return JSON.parse(localStorage.getItem(USUARIOS_KEY) || '[]');
}

function guardarUsuarios(usuarios) {
  localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));
}

/**
 * @returns {Object|null} Sesión activa o null si no hay usuario logueado.
 */
function obtenerSesion() {
  const sesion = localStorage.getItem(SESION_KEY);
  return sesion ? JSON.parse(sesion) : null;
}

/* ─── Sesión ───────────────────────────────────────────────── */

/**
 * Valida credenciales por nombre de usuario o correo electrónico.
 * @param {string} usuario
 * @param {string} password
 * @returns {{ exito: boolean, sesion?: Object, mensaje?: string }}
 */
function iniciarSesion(usuario, password) {
  const usuarios = obtenerUsuarios();
  const encontrado = usuarios.find(
    u => (u.usuario === usuario || u.email === usuario) && u.password === password
  );

  if (encontrado) {
    const sesion = {
      usuario: encontrado.usuario,
      nombreCompleto: encontrado.nombreCompleto,
      email: encontrado.email,
      rol: encontrado.rol
    };
    localStorage.setItem(SESION_KEY, JSON.stringify(sesion));
    if (typeof sincronizarCarritoAlIniciarSesion === 'function') {
      sincronizarCarritoAlIniciarSesion(encontrado.usuario);
    }
    return { exito: true, sesion };
  }

  return { exito: false, mensaje: 'Usuario o contraseña incorrectos.' };
}

/** Elimina la sesión y actualiza el badge del carrito (carrito de invitado). */
function cerrarSesion() {
  localStorage.removeItem(SESION_KEY);
  if (typeof sincronizarCarritoAlCerrarSesion === 'function') {
    sincronizarCarritoAlCerrarSesion();
  }
}

/* ─── Protección de páginas ────────────────────────────────── */

/**
 * Redirige a login si no hay sesión. Usar al inicio de páginas privadas.
 * @param {string} basePath Prefijo de ruta ('' desde index, '../' desde pages/)
 * @returns {boolean}
 */
function requiereSesion(basePath) {
  if (!obtenerSesion()) {
    window.location.href = basePath + 'pages/login.html';
    return false;
  }
  return true;
}

/**
 * Exige sesión y rol específico (ej: admin para panel de administración).
 * @param {string} rolRequerido
 * @param {string} basePath
 * @returns {boolean}
 */
function requiereRol(rolRequerido, basePath) {
  const sesion = obtenerSesion();
  if (!sesion) {
    window.location.href = basePath + 'pages/login.html';
    return false;
  }
  if (sesion.rol !== rolRequerido) {
    alert('No tienes permisos para acceder a esta sección.');
    window.location.href = basePath + 'index.html';
    return false;
  }
  return true;
}

inicializarUsuarios();
