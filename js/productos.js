/**
 * MesaMaestra - productos.js
 * Catálogo de juegos y categorías, ofertas (admin), nube informativa y cards HTML.
 * Depende de carrito.js para agregar ítems al carrito activo.
 */

/* ─── Datos estáticos: categorías ──────────────────────────── */

const CATEGORIAS = [
  {
    id: 'estrategia',
    nombre: 'Estrategia',
    icono: '♟️',
    descripcion: 'Juegos de planificación y táctica para mentes analíticas.',
    imagen: 'img/categorias/estrategia.webp',
    imagenRespaldo: 'img/categorias/estrategia.webp'
  },
  {
    id: 'familiar',
    nombre: 'Familiar',
    icono: '👨‍👩‍👧‍👦',
    descripcion: 'Diversión para toda la familia, fáciles de aprender.',
    imagen: 'img/categorias/familiar.webp',
    imagenRespaldo: 'img/categorias/familiar.webp'
  },
  {
    id: 'party',
    nombre: 'Party',
    icono: '🎉',
    descripcion: 'Ideales para reuniones y grupos numerosos.',
    imagen: 'img/categorias/party.webp',
    imagenRespaldo: 'img/categorias/party.webp'
  },
  {
    id: 'rol',
    nombre: 'Rol',
    icono: '🐉',
    descripcion: 'Aventuras épicas y narrativas inmersivas.',
    imagen: 'img/categorias/rol.webp',
    imagenRespaldo: 'img/categorias/rol.webp'
  }
];

/* ─── Datos estáticos: juegos (12 productos) ───────────────── */

const JUEGOS = [
  { id: 1, nombre: 'Catan', autor: 'Klaus Teuber', anio: 1995, marca: 'Kosmos', categoria: 'estrategia', descripcion: 'En un tablero de losetas hexagonales cultivas recursos, comercias con los demás y vas levantando caminos, asentamientos y ciudades. La partida avanza hasta que alguien alcanza diez puntos de victoria.', recomendacion: 'En este juego el comercio entre jugadores es lo central: rara vez alcanza con armar tu plan completamente solo y negociar en cada turno es la parte esencial del juego.', precio: 34990, descuento: true, precioOferta: 29990, imagen: 'img/juegos/catan.webp', jugadoresMin: 3, jugadoresMax: 4, edadMin: 10, duracion: '60-90 min' },
  { id: 2, nombre: 'Carcassonne', autor: 'Klaus-Jürgen Wrede', anio: 2000, marca: 'Hans im Glück', categoria: 'estrategia', descripcion: 'Vas uniendo losetas y el mapa crece con ciudades, caminos, monasterios y campos. En cada turno colocas una loseta y, si te conviene, un seguidor en alguna de esas zonas. A medida que el paisaje se completa, vas sumando puntos por lo que hayas logrado controlar.', recomendacion: 'Las reglas se entienden de inmediato, pero decidir dónde apostar y cuándo retirar un seguidor nunca deja de generar una buena discusión en la mesa.', precio: 27990, descuento: false, imagen: 'img/juegos/carcassonne.webp', jugadoresMin: 2, jugadoresMax: 5, edadMin: 7, duracion: '35 min' },
  { id: 3, nombre: 'Ticket to Ride', autor: 'Alan R. Moon', anio: 2004, marca: 'Days of Wonder', categoria: 'estrategia', descripcion: 'Cada jugador recibe billetes secretos que unen ciudades del mapa. Con cartas de colores vas reclamando tramos de tren e intentando cerrar tus rutas antes que el resto. Al cierre de la partida se suman los puntos de los tramos conquistados y de los billetes cumplidos.', recomendacion: 'Lo sacamos cuando queremos algo de estilo estratégico pero a la vez liviano: funciona bien con familia o amigos y casi siempre deja una buena partida sin andar media hora explicando reglas.', precio: 38990, descuento: true, precioOferta: 32990, imagen: 'img/juegos/ticket-to-ride.webp', jugadoresMin: 2, jugadoresMax: 5, edadMin: 8, duracion: '30-60 min' },
  { id: 4, nombre: 'Monopoly', autor: 'Charles Darrow', anio: 1935, marca: 'Hasbro', categoria: 'familiar', descripcion: 'Recorres el tablero comprando propiedades y, cuando completas un grupo, levantas casas y hoteles. Si alguien cae en una casilla tuya, pagas arriendo. Así la partida se va tensando hasta que solo queda un jugador en pie.', recomendacion: 'Es el clásico que todos conocen: negociaciones, remontadas y risas aseguradas. Perfecto para juntarse en familia sin complicarse demasiado.', precio: 19990, descuento: false, imagen: 'img/juegos/monopoly.webp', jugadoresMin: 2, jugadoresMax: 6, edadMin: 8, duracion: '60-180 min' },
  { id: 5, nombre: 'UNO', autor: 'Merle Robbins', anio: 1971, marca: 'Mattel', categoria: 'familiar', descripcion: 'Se reparten cartas de colores y números. En tu turno juegas una que coincida con la del descarte o robas del mazo. Hay cartas especiales que saltan turnos, invierten la dirección o obligan a robar, y cuando te queda una sola debes avisar con un «UNO». La partida termina cuando alguien se queda sin cartas.', recomendacion: 'Ideal para una tarde relajada o para partir el hielo antes de un juego más largo. En la tienda siempre lo tenemos a mano por lo práctico que es.', precio: 8990, descuento: true, precioOferta: 7490, imagen: 'img/juegos/uno.webp', jugadoresMin: 2, jugadoresMax: 10, edadMin: 7, duracion: '15 min' },
  { id: 6, nombre: 'Dobble', autor: 'Denis Blanchot', anio: 2009, marca: 'Asmodee', categoria: 'familiar', descripcion: 'Entre dos cartas siempre hay un símbolo en común, aunque cambie de tamaño o venga rotado. Todos miran a la vez y gana quien lo encuentre y lo nombre primero. Es puro reflejo y atención, sin turnos que se alarguen.', recomendacion: 'No hay turnos eternos ni reglas que estudiar. Lo sacamos cuando llega gente de distintas edades y queremos jugar sin perder mucho el tiempo buscando un juego.', precio: 12990, descuento: false, imagen: 'img/juegos/dobble.webp', jugadoresMin: 2, jugadoresMax: 8, edadMin: 6, duracion: '15 min' },
  { id: 7, nombre: 'Codenames', autor: 'Vlaada Chvátil', anio: 2015, marca: 'Czech Games Edition', categoria: 'party', descripcion: 'Dos equipos compiten por adivinar sus palabras secretas en una cuadrícula. El líder da pistas de una sola palabra y un número que indica cuántas cartas relaciona. El equipo interpreta la pista y elige; un error puede favorecer al rival o terminar la partida de golpe. Gana quien descubra antes todas sus palabras.', recomendacion: 'Funciona muy bien con grupos grandes y siempre deja conversación y risas. Para nosotros es de los party games más entretenidos que existen.', precio: 24990, descuento: false, imagen: 'img/juegos/codenames.webp', jugadoresMin: 4, jugadoresMax: 8, edadMin: 14, duracion: '15 min' },
  { id: 8, nombre: 'Dixit', autor: 'Jean-Louis Roubira', anio: 2008, marca: 'Libellud', categoria: 'party', descripcion: 'En cada ronda un narrador da una pista inspirada en una carta de su mano. Los demás eligen en secreto una imagen que encaje, se mezclan y se revelan. Todos votan cuál creen que era la del narrador. Puntúan quienes aciertan, quienes engañan bien y el narrador si acierta sin revelarlo del todo.', recomendacion: 'Las ilustraciones son hermosas y cada mesa juega distinto. Nos gusta cuando queremos algo creativo, tranquilo y sin tanta competencia directa.', precio: 29990, descuento: true, precioOferta: 25990, imagen: 'img/juegos/dixit.webp', jugadoresMin: 3, jugadoresMax: 6, edadMin: 8, duracion: '30 min' },
  { id: 9, nombre: 'Exploding Kittens', autor: 'Elan Lee', anio: 2015, marca: 'Exploding Kittens', categoria: 'party', descripcion: 'Por turnos robas cartas de un mazo donde acechan gatos explosivos. Si te toca uno y no puedes desactivarlo, quedas fuera. Entre medio puedes saltar turnos, espiar el mazo, mezclarlo o pasarle el problema a otro. Al final sobrevive quien logre quedar el último en juego.', recomendacion: 'Liviano, absurdo y corto. Lo disfrutamos cuando el grupo quiere reírse un rato sin ponerse a leer reglas en serio.', precio: 18990, descuento: false, imagen: 'img/juegos/exploding-kittens.webp', jugadoresMin: 2, jugadoresMax: 5, edadMin: 7, duracion: '15 min' },
  { id: 10, nombre: 'D&D Starter Set', autor: 'Gary Gygax & Dave Arneson', anio: 2014, marca: 'Wizards of the Coast', categoria: 'rol', descripcion: 'Kit de entrada a Dungeons & Dragons con reglas simplificadas, dados, personajes listos y una aventura de fantasía para jugar de una. Un jugador dirige como Dungeon Master y el resto interpreta héroes en una historia corta. Permite probar combate, exploración y rol sin necesidad de manuales adicionales.', recomendacion: 'Es la puerta más simple al rol. Lo recomendamos para probar el género con amigos antes de meterse a manuales más grandes.', precio: 45990, descuento: true, precioOferta: 39990, imagen: 'img/juegos/dnd-starter.webp', jugadoresMin: 3, jugadoresMax: 6, edadMin: 12, duracion: '120+ min' },
  { id: 11, nombre: 'Pathfinder', autor: 'Jason Bulmahn', anio: 2009, marca: 'Paizo', categoria: 'rol', descripcion: 'Juego de rol de fantasía donde creas tu personaje -clase, raza, habilidades y equipo- y exploras un mundo resolviendo situaciones con dados. Tiene combates tácticos y personajes que crecen por niveles. Está pensado para campañas largas con mucha personalización, en la línea de D&D pero con reglas propias.', recomendacion: 'Pensado para campañas largas entre amigos. Acá lo valoramos por la libertad que da para armar aventuras que duren semanas o meses.', precio: 52990, descuento: false, imagen: 'img/juegos/pathfinder.webp', jugadoresMin: 3, jugadoresMax: 6, edadMin: 13, duracion: '120+ min' },
  { id: 12, nombre: 'Call of Cthulhu', autor: 'Sandy Petersen', anio: 1981, marca: 'Chaosium', categoria: 'rol', descripcion: 'Rol de investigación y horror cósmico inspirado en Lovecraft. Interpretas investigadores que siguen pistas, interrogan testigos y se adentran en lugares peligrosos. Hay más misterio que combate, y la cordura de los personajes puede resentirse al enfrentar lo inexplicable. Cada sesión construye una historia tensa de la que el grupo va desentrañando poco a poco.', recomendacion: 'Más tensión y narrativa que acción épica. Nos engancha cómo junta el miedo, el misterio y el trabajo en equipo en cada sesión de juego.', precio: 48990, descuento: false, imagen: 'img/juegos/cthulhu.webp', jugadoresMin: 2, jugadoresMax: 6, edadMin: 14, duracion: '120+ min' }
];

/* ─── Utilidades de rutas y categorías ─────────────────────── */

function rutaImagen(basePath, ruta) {
  return basePath + ruta;
}

function rutaImagenRespaldo(basePath, ruta) {
  if (!ruta) return '';
  if (/^https?:\/\//i.test(ruta)) return ruta;
  return rutaImagen(basePath, ruta);
}

function obtenerCategoria(categoriaId) {
  return CATEGORIAS.find(c => c.id === categoriaId);
}

function obtenerIconoCategoria(categoriaId) {
  const cat = obtenerCategoria(categoriaId);
  return cat ? cat.icono : '🎲';
}

/* ─── Ofertas (persistidas por admin en localStorage) ──────── */

const CLAVE_OFERTAS_ADMIN = 'mesamaestra_ofertas';

function obtenerOfertasGuardadas() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_OFERTAS_ADMIN) || '{}');
  } catch (e) {
    return {};
  }
}

function guardarOfertaJuego(juegoId, config) {
  const ofertas = obtenerOfertasGuardadas();
  ofertas[String(juegoId)] = {
    activa: !!config.activa,
    porcentaje: Math.max(1, Math.min(90, parseInt(config.porcentaje, 10) || 10))
  };
  localStorage.setItem(CLAVE_OFERTAS_ADMIN, JSON.stringify(ofertas));
}

function inferirPorcentajeDescuento(juego) {
  if (!juego.descuento || !juego.precioOferta || !juego.precio) return 10;
  return Math.max(1, Math.min(90, Math.round((1 - juego.precioOferta / juego.precio) * 100)));
}

function calcularPrecioConDescuento(precio, porcentaje) {
  return Math.round(precio * (1 - porcentaje / 100));
}

function resolverOfertaJuego(juego) {
  const copia = Object.assign({}, juego);
  const override = obtenerOfertasGuardadas()[String(juego.id)];

  if (override) {
    if (override.activa) {
      const porcentaje = override.porcentaje || 10;
      copia.descuento = true;
      copia.porcentajeDescuento = porcentaje;
      copia.precioOferta = calcularPrecioConDescuento(copia.precio, porcentaje);
    } else {
      copia.descuento = false;
      delete copia.precioOferta;
      delete copia.porcentajeDescuento;
    }
    return copia;
  }

  if (copia.descuento && copia.precioOferta) {
    copia.porcentajeDescuento = inferirPorcentajeDescuento(copia);
  }
  return copia;
}

/* ─── Consultas del catálogo ───────────────────────────────── */

function obtenerJuegos() {
  return JUEGOS.map(resolverOfertaJuego);
}

function obtenerJuegoPorId(juegoId) {
  const juego = JUEGOS.find(function (j) { return j.id === juegoId; });
  return juego ? resolverOfertaJuego(juego) : null;
}

function obtenerJuegosEnOferta() {
  return obtenerJuegos().filter(function (j) { return j.descuento; });
}

function obtenerConfigOferta(juegoId) {
  const override = obtenerOfertasGuardadas()[String(juegoId)];
  const juego = JUEGOS.find(function (j) { return j.id === juegoId; });
  if (!juego) return { activa: false, porcentaje: 10 };

  if (override) {
    return {
      activa: !!override.activa,
      porcentaje: override.porcentaje || 10
    };
  }

  return {
    activa: !!juego.descuento,
    porcentaje: inferirPorcentajeDescuento(juego)
  };
}

function obtenerJuegosPorCategoria(categoriaId) {
  return obtenerJuegos().filter(j => j.categoria === categoriaId);
}

/* ─── Formateo de datos para la UI ─────────────────────────── */

function formatearPrecio(precio) {
  return '$' + precio.toLocaleString('es-CL');
}

function formatearNombreJuego(nombre) {
  return nombre;
}

function formatearJugadores(juego) {
  if (juego.jugadoresMin === juego.jugadoresMax) {
    return String(juego.jugadoresMin);
  }
  return juego.jugadoresMin + '-' + juego.jugadoresMax;
}

/* ─── Nube flotante (descripción / recomendación) ──────────── */

let nubeJuegoActiva = null;

function initNubeJuego() {
  if (document.getElementById('juego-nube')) return;

  document.body.insertAdjacentHTML('beforeend', `
    <div id="juego-nube-overlay" class="juego-nube-overlay" aria-hidden="true"></div>
    <div id="juego-nube" class="juego-nube" role="dialog" aria-hidden="true">
      <div class="juego-nube-contenido">
        <p id="juego-nube-texto" class="juego-nube-texto"></p>
      </div>
      <span class="juego-nube-flecha" aria-hidden="true"></span>
    </div>`);

  document.getElementById('juego-nube-overlay').addEventListener('click', cerrarNubeJuego);
  window.addEventListener('resize', cerrarNubeJuego);
}

function desactivarBotonNube(btn) {
  if (!btn) return;
  btn.classList.remove('is-active');
  btn.setAttribute('aria-expanded', 'false');
}

function cerrarNubeJuego() {
  const nube = document.getElementById('juego-nube');
  const overlay = document.getElementById('juego-nube-overlay');
  if (!nube || !overlay) return;

  nube.classList.remove('is-visible', 'is-reposicionando', 'is-actualizando', 'juego-nube--abajo');
  nube.style.display = '';
  nube.setAttribute('aria-hidden', 'true');
  overlay.classList.remove('is-visible');
  overlay.setAttribute('aria-hidden', 'true');

  desactivarBotonNube(nubeJuegoActiva);
  nubeJuegoActiva = null;
}

function posicionarNubeJuego(btn, nube, medirFueraPantalla) {
  const rect = btn.getBoundingClientRect();
  const nubeAncho = Math.min(320, window.innerWidth - 24);
  nube.style.width = nubeAncho + 'px';
  nube.style.display = 'block';
  nube.classList.remove('juego-nube--abajo');

  if (medirFueraPantalla) {
    nube.style.left = '-9999px';
    nube.style.top = '0';
    nube.style.visibility = 'hidden';
  }

  const nubeRect = nube.getBoundingClientRect();
  let top = rect.top - nubeRect.height - 14;
  let left = rect.left + rect.width / 2 - nubeAncho / 2;

  if (top < 12) {
    top = rect.bottom + 14;
    nube.classList.add('juego-nube--abajo');
  }

  left = Math.max(12, Math.min(left, window.innerWidth - nubeAncho - 12));
  nube.style.top = top + 'px';
  nube.style.left = left + 'px';
  nube.style.visibility = 'visible';

  const flecha = nube.querySelector('.juego-nube-flecha');
  const flechaLeft = rect.left + rect.width / 2 - left;
  flecha.style.left = Math.max(18, Math.min(flechaLeft, nubeAncho - 18)) + 'px';
}

function abrirNubeJuego(btn, texto) {
  const nube = document.getElementById('juego-nube');
  const overlay = document.getElementById('juego-nube-overlay');
  const yaVisible = nube.classList.contains('is-visible');
  const etiqueta = btn.querySelector('.juego-info-etiqueta');

  if (nubeJuegoActiva && nubeJuegoActiva !== btn) {
    desactivarBotonNube(nubeJuegoActiva);
  }

  document.getElementById('juego-nube-texto').textContent = texto;
  nube.setAttribute('aria-label', etiqueta ? etiqueta.textContent : 'Información del juego');

  nubeJuegoActiva = btn;
  btn.classList.add('is-active');
  btn.setAttribute('aria-expanded', 'true');

  if (yaVisible) {
    nube.classList.remove('is-actualizando');
    nube.classList.add('is-reposicionando');
    posicionarNubeJuego(btn, nube, false);
    void nube.offsetWidth;
    nube.classList.add('is-actualizando');
    window.setTimeout(function () {
      nube.classList.remove('is-actualizando', 'is-reposicionando');
    }, 320);
  } else {
    posicionarNubeJuego(btn, nube, true);
    requestAnimationFrame(function () {
      overlay.classList.add('is-visible');
      nube.classList.add('is-visible');
    });
  }

  overlay.classList.add('is-visible');
  overlay.setAttribute('aria-hidden', 'false');
  nube.setAttribute('aria-hidden', 'false');
}

function toggleNubeJuego(btn) {
  initNubeJuego();

  if (nubeJuegoActiva === btn) {
    cerrarNubeJuego();
    return;
  }

  const juego = obtenerJuegoPorId(parseInt(btn.dataset.juegoId, 10));
  if (!juego) return;

  const tipo = btn.dataset.tipo;
  const texto = tipo === 'descripcion' ? juego.descripcion : juego.recomendacion;

  abrirNubeJuego(btn, texto);
}

function crearCreditoJuego(juego) {
  return `
    <p class="juego-credito">
      <span class="juego-autor">${juego.autor}</span>
      <span class="juego-credito-sep" aria-hidden="true">·</span>
      <span class="juego-anio">${juego.anio}</span>
    </p>`;
}

function crearBloquesJuego(juego) {
  return `
    <div class="juego-bloques">
      <button type="button" class="juego-info-btn" aria-expanded="false"
        data-juego-id="${juego.id}" data-tipo="descripcion"
        onclick="toggleNubeJuego(this)">
        <span class="juego-info-etiqueta">Acerca del juego</span>
      </button>
      <button type="button" class="juego-info-btn" aria-expanded="false"
        data-juego-id="${juego.id}" data-tipo="recomendacion"
        onclick="toggleNubeJuego(this)">
        <span class="juego-info-etiqueta">¿Por qué recomendamos?</span>
      </button>
    </div>`;
}

document.addEventListener('DOMContentLoaded', initNubeJuego);

/* ─── Componentes HTML de cards ────────────────────────────── */

function crearMetaJuego(juego) {
  const iconoCat = obtenerIconoCategoria(juego.categoria);
  const cat = obtenerCategoria(juego.categoria);
  return `
    <ul class="juego-meta list-unstyled mb-2">
      <li><span class="juego-meta-icono">👥</span> ${formatearJugadores(juego)}</li>
      <li><span class="juego-meta-icono">🎂</span> ${juego.edadMin}+</li>
      <li><span class="juego-meta-icono">⏱️</span> ${juego.duracion}</li>
      <li><span class="juego-meta-icono">${iconoCat}</span> ${cat ? cat.nombre : juego.categoria}</li>
    </ul>`;
}

function crearCardJuego(juego, basePath, indice, opciones) {
  opciones = opciones || {};
  const animar = opciones.animar !== false;
  const cargaImagen = opciones.eagerImages && indice !== undefined && indice < 6 ? 'eager' : 'lazy';
  const src = rutaImagen(basePath, juego.imagen);
  const precioHtml = juego.descuento
    ? `<span class="precio-descuento">${formatearPrecio(juego.precio)}</span>
       <span class="precio">${formatearPrecio(juego.precioOferta)}</span>
       <span class="badge badge-oferta badge-descuento ms-2">Oferta</span>`
    : `<span class="precio">${formatearPrecio(juego.precio)}</span>`;

  const claseAnim = animar ? 'anim-fade-in' : 'anim-fade-in--instante';
  const delayAttr = animar && indice !== undefined
    ? ` style="animation-delay: ${Math.min(indice * 0.04, 0.24)}s"`
    : '';

  return `
    <div class="col-md-6 col-lg-4 mb-4 ${claseAnim}"${delayAttr}>
      <div class="card card-juego h-100">
        <img src="${src}" alt="${juego.nombre}" class="card-img-top" loading="${cargaImagen}" decoding="async"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="card-img-top img-placeholder" style="display:none;">${formatearNombreJuego(juego.nombre)}</div>
        <div class="card-body d-flex flex-column">
          <div class="juego-encabezado">
            <div class="juego-placa">
              <span class="juego-placa-clavo juego-placa-clavo--tl" aria-hidden="true"></span>
              <span class="juego-placa-clavo juego-placa-clavo--tr" aria-hidden="true"></span>
              <span class="juego-placa-clavo juego-placa-clavo--bl" aria-hidden="true"></span>
              <span class="juego-placa-clavo juego-placa-clavo--br" aria-hidden="true"></span>
              <h5 class="juego-titulo">${formatearNombreJuego(juego.nombre)}</h5>
              ${crearCreditoJuego(juego)}
              <p class="juego-marca"><span class="juego-marca-sello">${juego.marca}</span></p>
            </div>
          </div>
          ${crearBloquesJuego(juego)}
          ${crearMetaJuego(juego)}
          <div class="juego-precio">${precioHtml}</div>
          <button type="button" class="btn btn-carrito-juego btn-pulse" onclick="agregarAlCarrito(${juego.id})">
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>`;
}

function renderizarListaJuegos(contenedor, juegos, basePath, opciones) {
  if (!contenedor) return;
  if (typeof cerrarNubeJuego === 'function') cerrarNubeJuego();
  contenedor.innerHTML = juegos.map(function (juego, i) {
    return crearCardJuego(juego, basePath, i, opciones);
  }).join('');
}

function crearCardCategoria(cat, basePath, extraHtml, indice) {
  const src = rutaImagen(basePath, cat.imagen);
  const srcRespaldo = rutaImagenRespaldo(basePath, cat.imagenRespaldo);
  const delay = (indice !== undefined ? indice : 0) * 0.08;
  return `
    <div class="col-6 col-md-3">
      <a href="${basePath}pages/categoria.html?id=${cat.id}" class="text-decoration-none categoria-card h-100">
        <div class="categoria-card-wrapper anim-categoria h-100" style="animation-delay: ${delay}s">
          <div class="categoria-card-inner h-100">
            <div class="categoria-img-wrap categoria-img--${cat.id}">
              <div class="categoria-img-fondo" aria-hidden="true">${cat.icono}</div>
              <img src="${src}" alt="${cat.nombre}" class="categoria-img" loading="lazy" decoding="async"
                data-respaldo="${srcRespaldo}"
                onload="this.closest('.categoria-img-wrap').classList.add('tiene-imagen');"
                onerror="if(this.dataset.respaldo && !this.dataset.fb){this.dataset.fb='1';this.src=this.dataset.respaldo;}else{this.classList.add('sin-imagen');}">
              <div class="categoria-overlay">
                <span class="categoria-explorar">Explorar →</span>
              </div>
            </div>
            <div class="categoria-card-body categoria-body--${cat.id}">
              <h4>${cat.nombre}</h4>
              <p class="categoria-desc small mb-0">${cat.descripcion}</p>
              ${extraHtml || ''}
            </div>
          </div>
        </div>
      </a>
    </div>`;
}

/* ─── Carrito ──────────────────────────────────────────────── */

/** Añade un juego al carrito del usuario/invitado y actualiza el badge del navbar. */
function agregarAlCarrito(juegoId) {
  const juego = obtenerJuegoPorId(juegoId);
  if (!juego) return;

  const carrito = obtenerCarrito();
  const existente = carrito.find(item => item.id === juegoId);

  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({
      id: juego.id,
      nombre: juego.nombre,
      marca: juego.marca,
      precio: juego.descuento ? juego.precioOferta : juego.precio,
      cantidad: 1
    });
  }

  guardarCarrito(carrito);
  if (typeof actualizarBadgeCarrito === 'function') {
    actualizarBadgeCarrito();
  }
  alert(formatearNombreJuego(juego.nombre) + ' agregado al carrito.');
}
