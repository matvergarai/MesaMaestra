# MesaMaestra — Angular

<p align="center">
  <img src="public/img/logo.svg" alt="Logo MesaMaestra" width="120">
</p>

> SPA de tienda ficticia de juegos de mesa. Angular 22, Bootstrap 5, formularios reactivos, servicios, guards, Compodoc y pruebas unitarias.

## Índice

- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Scripts](#scripts)
- [Rutas y guards](#rutas-y-guards)
- [Cuentas de prueba](#cuentas-de-prueba)
- [Arquitectura](#arquitectura)
- [Servicios](#servicios)
- [Componentes compartidos](#componentes-compartidos)
- [Formularios reactivos](#formularios-reactivos)
- [Directivas y comunicación entre componentes](#directivas-y-comunicación-entre-componentes)
- [Documentación Compodoc](#documentación-compodoc)
- [Pruebas unitarias](#pruebas-unitarias)
- [Build de producción](#build-de-producción)
- [Autor](#autor)

## Requisitos

| Herramienta | Versión mínima |
|-------------|----------------|
| Node.js | v20 LTS |
| npm | v10+ |

Este proyecto usa **Angular 22**, **TypeScript 6** y **Vitest** para pruebas.

## Instalación

```bash
cd mesa-maestra
npm install
npm start
```

Abrir: **http://localhost:4200/**

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm start` | Servidor de desarrollo (`ng serve`) |
| `npm run build` | Compilar para producción en `dist/` |
| `npm test` | Ejecutar pruebas unitarias (Vitest, modo watch) |
| `ng test --no-watch` | Ejecutar pruebas una sola vez |
| `npm run doc` | Generar documentación Compodoc |
| `npm run doc:serve` | Compodoc con servidor en http://127.0.0.1:8080 |

## Rutas y guards

Definidas en `src/app/app.routes.ts`:

| Ruta | Componente | Guard |
|------|------------|-------|
| `/` | Home | — |
| `/login` | Login | — |
| `/registro` | Registro | — |
| `/recuperar` | Recuperar | — |
| `/perfil` | Perfil | `authGuard` |
| `/categorias` | Categorias | — |
| `/categoria/:id` | Categoria | — |
| `/catalogo` | Catalogo | — |
| `/carrito` | CarritoPage | — |
| `/pago-exitoso` | PagoExitoso | — |
| `/admin` | Admin | `adminGuard` |
| `**` | — | Redirige a `/` |

## Cuentas de prueba

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| `admin` | `Admin123` | Admin |
| `cliente` | `Cliente123` | Cliente |

Los usuarios registrados desde `/registro` se guardan en `localStorage` con rol `cliente`.

## Arquitectura

```
src/app/
├── app.ts / app.html / app.routes.ts   # Shell y routing
├── componentes/
│   ├── navbar/                         # Navegación y sesión
│   ├── footer/                         # Pie de página
│   ├── card-juego/                     # Tarjeta de producto
│   ├── card-categoria/                 # Tarjeta de categoría
│   └── juego-nube/                     # Tooltip flotante de info
├── servicios/
│   ├── auth.ts                         # Login, registro, sesión
│   ├── carrito.ts                      # Carrito por usuario
│   ├── productos.ts                    # Catálogo, ofertas, filtros
│   └── juego-nube.ts                   # Estado de la nube informativa
├── guards/
│   ├── auth-guard.ts                   # Protege /perfil
│   └── admin-guard.ts                  # Protege /admin
├── pages/                              # Vistas por ruta
├── models/                             # Juego, Categoria, Usuario, ItemCarrito
├── datos/productos.data.ts             # 12 juegos y 4 categorías
└── utilidades/validadores.ts           # Validadores de formularios
```

Estilos globales en `src/styles/` (CSS migrado del proyecto original). Imágenes en `public/img/`.

## Servicios

### `Auth`
- Inicio y cierre de sesión
- Registro de usuarios
- Persistencia en `localStorage` (`mm_usuarios`, `mm_sesion`)
- Usuarios demo precargados (`admin`, `cliente`)

### `Carrito`
- Carrito separado para invitado y usuarios autenticados
- Fusión del carrito de invitado al iniciar sesión
- Agregar, quitar y modificar cantidades

### `Productos`
- Catálogo estático con categorías y ofertas
- Filtros, búsqueda y formateo de precios
- Gestión de descuentos desde el panel admin

### `JuegoNubeService`
- Controla el panel flotante de descripción/recomendación en las tarjetas de juego

## Componentes compartidos

| Componente | Selector | Descripción |
|------------|----------|-------------|
| CardJuego | `app-card-juego` | Tarjeta de juego con `@Input` (juego, índice) y `@Output` (juegoAgregado) |
| CardCategoria | `app-card-categoria` | Enlace visual a cada categoría |
| Navbar | `app-navbar` | Menú, carrito y estado de sesión |
| Footer | `app-footer` | Contacto y horario |
| JuegoNube | `app-juego-nube` | Nube informativa global |

## Formularios reactivos

| Página | Archivo | Validaciones destacadas |
|--------|---------|---------------------------|
| Login | `pages/login/login.ts` | Usuario y contraseña requeridos |
| Registro | `pages/registro/registro.ts` | RUT, email, contraseña (5 reglas), confirmación |
| Recuperar | `pages/recuperar/recuperar.ts` | Email registrado |
| Perfil | `pages/perfil/perfil.ts` | Edición de datos del usuario logueado |

Validadores personalizados en `utilidades/validadores.ts` (equivalente a `validaciones.js` del proyecto original).

## Directivas y comunicación entre componentes

Ejemplos implementados en el proyecto:

- **`*ngFor`:** listado de categorías y destacados en `home.html`
- **`*ngIf`:** mensajes condicionales en `login.html` y `navbar.html`
- **`[(ngModel)]`:** búsqueda en catálogo/admin, checkbox "recordar usuario" en login
- **`@Input`:** datos en `card-juego` y `card-categoria`
- **`@Output`:** evento `juegoAgregado` en `card-juego`

## Documentación Compodoc

Generar documentación del frontend:

```bash
npm run doc
```

Ver en el navegador:

```bash
npm run doc:serve
```

Salida en `documentation/` (componentes, servicios, interfaces, rutas).

## Pruebas unitarias

Archivos de prueba:

| Archivo | Qué prueba |
|---------|------------|
| `app.spec.ts` | Creación del componente raíz y render del hero en home |
| `pages/login/login.spec.ts` | Formulario inválido vacío y login con credenciales válidas |
| `pages/registro/registro.spec.ts` | Creación del componente y validaciones del formulario |

Ejecutar:

```bash
npm test
# o una sola ejecución:
ng test --no-watch
```

## Build de producción

```bash
npm run build
```

Los archivos compilados quedan en `dist/mesa-maestra/`. Para servirlos localmente:

```bash
npx serve dist/mesa-maestra/browser
```

## Autor

**matvergarai**  
Duoc UC — Desarrollo Full Stack 2 — 2026

Repositorio: [github.com/matvergarai/MesaMaestra](https://github.com/matvergarai/MesaMaestra)
