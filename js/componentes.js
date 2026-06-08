/**
 * MesaMaestra - componentes.js
 * Layout compartido: navbar, footer, fondo decorativo y badge del carrito.
 * Se inyecta dinámicamente en #navbar-container y #footer-container.
 */

/* ─── Carrito en navbar ────────────────────────────────────── */

/** Suma las cantidades de todos los ítems del carrito activo. */
function contarItemsCarrito() {
  try {
    const carrito = typeof obtenerCarrito === 'function'
      ? obtenerCarrito()
      : JSON.parse(localStorage.getItem('carrito') || '[]');
    return carrito.reduce(function (total, item) {
      return total + (item.cantidad || 1);
    }, 0);
  } catch (e) {
    return 0;
  }
}

/** Actualiza el contador visual sobre el icono del carrito (máx. "9+"). */
function actualizarBadgeCarrito() {
  const btn = document.querySelector('.navbar-carrito-btn');
  if (!btn) return;

  const totalCarrito = contarItemsCarrito();
  let badge = btn.querySelector('.navbar-carrito-badge');

  btn.setAttribute(
    'aria-label',
    'Ir al carrito' + (totalCarrito > 0 ? ' (' + totalCarrito + ' productos)' : '')
  );

  if (totalCarrito <= 0) {
    if (badge) badge.remove();
    return;
  }

  const texto = totalCarrito > 9 ? '9+' : String(totalCarrito);
  if (!badge) {
    badge = document.createElement('span');
    badge.className = 'navbar-carrito-badge';
    btn.appendChild(badge);
  }
  badge.textContent = texto;
}

/* ─── Navbar ───────────────────────────────────────────────── */

/**
 * Renderiza la barra de navegación según estado de sesión y rol.
 * @param {string} basePath Prefijo de rutas ('' o '../').
 */
function renderizarNavbar(basePath) {
  const sesion = typeof obtenerSesion === 'function' ? obtenerSesion() : null;
  const nav = document.getElementById('navbar-container');
  if (!nav) return;

  const totalCarrito = contarItemsCarrito();
  const badgeCarrito = totalCarrito > 0
    ? `<span class="navbar-carrito-badge">${totalCarrito > 9 ? '9+' : totalCarrito}</span>`
    : '';

  let saludoNav = '';
  let enlacesSesion = '';
  if (sesion) {
    saludoNav = `
      <li class="nav-item">
        <span class="nav-link nav-saludo">Hola, ${sesion.nombreCompleto.split(' ')[0]}</span>
      </li>`;
    enlacesSesion = `
      <li class="nav-item"><a class="nav-link" href="${basePath}pages/perfil.html">Mi Perfil</a></li>`;
    if (sesion.rol === 'admin') {
      enlacesSesion += `<li class="nav-item"><a class="nav-link" href="${basePath}pages/admin.html">Panel Admin</a></li>`;
    }
    enlacesSesion += `<li class="nav-item"><a class="nav-link" href="#" id="btn-cerrar-sesion">Cerrar sesión</a></li>`;
  } else {
    enlacesSesion = `
      <li class="nav-item"><a class="nav-link" href="${basePath}pages/login.html">Iniciar sesión</a></li>
      <li class="nav-item"><a class="nav-link" href="${basePath}pages/registro.html">Registrarse</a></li>`;
  }

  nav.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark navbar-mesamaestra">
      <div class="container navbar-contenedor">
        <a class="navbar-brand" href="${basePath}index.html">
          <img src="${basePath}img/logo.svg" alt="MesaMaestra" class="logo-img"
            onerror="this.outerHTML='🎲 <span class=\\'fw-bold\\'>MesaMaestra</span>'">
        </a>
        <div class="navbar-panel">
          <a class="navbar-carrito-btn" href="${basePath}pages/carrito.html"
            aria-label="Ir al carrito${totalCarrito > 0 ? ' (' + totalCarrito + ' productos)' : ''}"
            title="Carrito">
            <span class="navbar-carrito-icono" aria-hidden="true">🛒</span>
            ${badgeCarrito}
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Menú">
            <span class="navbar-toggler-icon"></span>
          </button>
        </div>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-lg-auto">
            ${saludoNav}
            <li class="nav-item"><a class="nav-link" href="${basePath}index.html">Inicio</a></li>
            <li class="nav-item"><a class="nav-link" href="${basePath}pages/categorias.html">Categorías</a></li>
            <li class="nav-item"><a class="nav-link" href="${basePath}pages/catalogo.html">Catálogo</a></li>
            ${enlacesSesion}
          </ul>
        </div>
      </div>
    </nav>`;

  const btnCerrar = document.getElementById('btn-cerrar-sesion');
  if (btnCerrar) {
    btnCerrar.addEventListener('click', function (e) {
      e.preventDefault();
      cerrarSesion();
      window.location.href = basePath + 'index.html';
    });
  }
}

/* ─── Footer ───────────────────────────────────────────────── */

/**
 * @param {string} [basePath=''] Prefijo de rutas para assets y enlaces.
 */
function renderizarFooter(basePath) {
  basePath = basePath || '';
  const footer = document.getElementById('footer-container');
  if (!footer) return;

  footer.innerHTML = `
    <footer class="footer-mesamaestra">
      <div class="container">
        <div class="row g-4 footer-grid">
          <div class="col-12 col-lg-4 footer-marca">
            <img src="${basePath}img/logo.svg" alt="MesaMaestra" class="footer-logo"
              onerror="this.outerHTML='<h5 class=\\'footer-titulo-marca\\'>🎲 MesaMaestra</h5>'">
            <p class="footer-texto">Tu tienda de juegos de mesa favorita en Chile.</p>
          </div>
          <div class="col-12 col-sm-6 col-lg-4 footer-contacto">
            <h5 class="footer-titulo">Contacto</h5>
            <p class="footer-texto">
              <button type="button" class="footer-enlace footer-enlace-btn"
                data-contacto="contacto@mesamaestra.cl">contacto@mesamaestra.cl</button><br>
              <button type="button" class="footer-enlace footer-enlace-btn"
                data-contacto="+56 2 2345 6789">+56 2 2345 6789</button>
            </p>
            <p class="footer-contacto-aviso d-none" id="footer-contacto-aviso" role="status" aria-live="polite"></p>
          </div>
          <div class="col-12 col-sm-6 col-lg-4 footer-horario">
            <h5 class="footer-titulo">Horario</h5>
            <p class="footer-texto">
              Lunes a Viernes: 9:00 a 20:00<br>
              Sábados y Domingos: 10:00 a 15:00
            </p>
          </div>
        </div>
        <hr class="footer-divider">
        <p class="footer-copy">&copy; 2026 MesaMaestra - Desarrollo Full Stack 2</p>
      </div>
    </footer>`;

  initFooterContacto();
}

/** Contacto simulado: copia el dato y muestra aviso sin abrir mailto/tel. */
function initFooterContacto() {
  const aviso = document.getElementById('footer-contacto-aviso');
  document.querySelectorAll('.footer-enlace-btn[data-contacto]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const dato = btn.getAttribute('data-contacto') || btn.textContent.trim();

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(dato).catch(function () {});
      }

      if (aviso) {
        aviso.textContent = 'Contacto simulado: ' + dato + ' (copiado al portapapeles)';
        aviso.classList.remove('d-none');
        clearTimeout(aviso._timeoutId);
        aviso._timeoutId = setTimeout(function () {
          aviso.classList.add('d-none');
        }, 3500);
      }
    });
  });
}

/* ─── Fondo global ─────────────────────────────────────────── */

/**
 * Inserta gradiente e iconos decorativos. En catálogo/listados usa fondo ligero
 * (sin animaciones) para mejorar el rendimiento.
 */
function renderizarFondoGlobal() {
  if (document.getElementById('fondo-global')) return;

  const esPaginaLigera = document.body.classList.contains('pagina-catalogo')
    || document.body.classList.contains('pagina-listado');
  const iconos = esPaginaLigera
    ? []
    : ['🎲', '♟️', '🃏', '🎯', '🐉', '🎉', '🧩', '⚔️', '👑', '🀄'];

  let html = '<div id="fondo-global" class="fondo-global" aria-hidden="true">';
  if (!esPaginaLigera) {
    html += '<div class="hero-brillo"></div>';
    iconos.forEach((icono, i) => {
      html += `<span class="hero-icono hero-icono--${i + 1}">${icono}</span>`;
    });
  }
  html += '</div>';
  document.body.insertAdjacentHTML('afterbegin', html);
}

document.addEventListener('DOMContentLoaded', renderizarFondoGlobal);
