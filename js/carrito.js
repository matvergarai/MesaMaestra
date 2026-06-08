/**
 * MesaMaestra - carrito.js
 * Carrito de compras por usuario en localStorage.
 * Cada usuario (e invitado) mantiene su propio carrito independiente.
 */

/* ─── Claves de almacenamiento ─────────────────────────────── */

const CARRO_INVITADO_KEY = 'mesamaestra_carrito_invitado';
const CARRO_LEGACY_KEY = 'carrito'; // Migración desde versión anterior global

/* ─── Resolución de clave activa ───────────────────────────── */

function claveCarritoUsuario(usuario) {
  return 'mesamaestra_carrito_' + usuario;
}

/** Devuelve la clave del carrito según sesión: invitado o usuario logueado. */
function obtenerClaveCarritoActiva() {
  const sesion = typeof obtenerSesion === 'function' ? obtenerSesion() : null;
  return sesion ? claveCarritoUsuario(sesion.usuario) : CARRO_INVITADO_KEY;
}

/* ─── Lectura y escritura ──────────────────────────────────── */

function leerCarritoDeClave(clave) {
  try {
    const datos = JSON.parse(localStorage.getItem(clave) || '[]');
    return Array.isArray(datos) ? datos : [];
  } catch (e) {
    return [];
  }
}

function guardarCarritoEnClave(clave, carrito) {
  localStorage.setItem(clave, JSON.stringify(carrito));
}

/**
 * Combina ítems de origen en destino, sumando cantidades si el juego ya existe.
 */
function fusionarCarritos(destino, origen) {
  origen.forEach(function (item) {
    const existente = destino.find(function (i) { return i.id === item.id; });
    if (existente) {
      existente.cantidad += item.cantidad || 1;
    } else {
      destino.push({
        id: item.id,
        nombre: item.nombre,
        marca: item.marca,
        precio: item.precio,
        cantidad: item.cantidad || 1
      });
    }
  });
  return destino;
}

/** Migra el carrito global antiguo ('carrito') al carrito del usuario/invitado actual. */
function migrarCarritoLegacy() {
  const legacy = localStorage.getItem(CARRO_LEGACY_KEY);
  if (!legacy) return;

  try {
    const items = JSON.parse(legacy);
    if (!Array.isArray(items) || items.length === 0) {
      localStorage.removeItem(CARRO_LEGACY_KEY);
      return;
    }
    const clave = obtenerClaveCarritoActiva();
    const actual = leerCarritoDeClave(clave);
    fusionarCarritos(actual, items);
    guardarCarritoEnClave(clave, actual);
    localStorage.removeItem(CARRO_LEGACY_KEY);
  } catch (e) {
    localStorage.removeItem(CARRO_LEGACY_KEY);
  }
}

/* ─── API pública del carrito ──────────────────────────────── */

function obtenerCarrito() {
  migrarCarritoLegacy();
  return leerCarritoDeClave(obtenerClaveCarritoActiva());
}

function guardarCarrito(carrito) {
  guardarCarritoEnClave(obtenerClaveCarritoActiva(), carrito);
}

function vaciarCarrito() {
  guardarCarritoEnClave(obtenerClaveCarritoActiva(), []);
}

/* ─── Sincronización con auth.js ───────────────────────────── */

/**
 * Al iniciar sesión: fusiona el carrito de invitado en el del usuario y vacía invitado.
 * @param {string} usuario Nombre de usuario autenticado.
 */
function sincronizarCarritoAlIniciarSesion(usuario) {
  migrarCarritoLegacy();
  const invitado = leerCarritoDeClave(CARRO_INVITADO_KEY);
  const claveUsuario = claveCarritoUsuario(usuario);
  const carritoUsuario = leerCarritoDeClave(claveUsuario);

  if (invitado.length > 0) {
    fusionarCarritos(carritoUsuario, invitado);
    guardarCarritoEnClave(claveUsuario, carritoUsuario);
    guardarCarritoEnClave(CARRO_INVITADO_KEY, []);
  }
}

/** Tras cerrar sesión, el navbar debe reflejar el carrito de invitado. */
function sincronizarCarritoAlCerrarSesion() {
  if (typeof actualizarBadgeCarrito === 'function') {
    actualizarBadgeCarrito();
  }
}

document.addEventListener('DOMContentLoaded', migrarCarritoLegacy);
