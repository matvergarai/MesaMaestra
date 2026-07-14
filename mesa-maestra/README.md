# MesaMaestra — Angular

<p align="center">
  <img src="public/img/logo.svg" alt="Logo MesaMaestra" width="120">
</p>

> SPA de tienda ficticia de juegos de mesa. Angular 22, Bootstrap 5, json-server, HttpClient, Docker Compose, formularios reactivos y pruebas unitarias.

Documentación del sistema: [`documentacion/SISTEMA.md`](documentacion/SISTEMA.md)

## Índice

- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Scripts](#scripts)
- [Rutas y guards](#rutas-y-guards)
- [Consumo JSON y API](#consumo-json-y-api)
- [Docker](#docker)
- [Cuentas de prueba](#cuentas-de-prueba)
- [Arquitectura](#arquitectura)
- [Servicios](#servicios)
- [Componentes compartidos](#componentes-compartidos)
- [Formularios reactivos](#formularios-reactivos)
- [Documentación Compodoc](#documentación-compodoc)
- [Pruebas unitarias](#pruebas-unitarias)
- [Build de producción](#build-de-producción)
- [Autor](#autor)

## Requisitos

| Herramienta | Versión mínima |
|-------------|----------------|
| Node.js | v20 LTS (v22 recomendado para Docker) |
| npm | v10+ |
| Docker Desktop | Opcional (para Compose) |

Stack: **Angular 22**, **TypeScript 6**, **json-server**, **Vitest**.

## Instalación

```bash
cd mesa-maestra
npm install
```

### Desarrollo con API

Terminal 1 — json-server:

```bash
npm run api
```

Terminal 2 — Angular:

```bash
npm start
```

- App: http://localhost:4200  
- API: http://localhost:3000/juegos

> No ejecutar `npm run api` y `docker compose` al mismo tiempo: ambos usan el puerto 3000.

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm start` | Servidor de desarrollo (`ng serve`, :4200) |
| `npm run api` | json-server con `db.json` (:3000) |
| `npm run build` | Compilar para producción en `dist/` |
| `npm run docker:up` | Docker Compose: web (:8080) + api (:3000) |
| `npm run docker:down` | Detener contenedores |
| `npm run docker:build` | Imagen solo frontend |
| `npm run docker:run` | Contenedor frontend (:8080) |
| `npm test` | Pruebas unitarias (Vitest, modo watch) |
| `ng test --no-watch` | Pruebas una sola vez |
| `npm run doc` | Generar Compodoc |
| `npm run doc:serve` | Compodoc en http://127.0.0.1:8080 |
| `npm run firebase:seed` | Generar seed Firebase (opcional) |

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
| `/juegos-storage` | JuegosStorage | — |
| `/juegos-json-server` | JuegosJsonServer | — |
| `**` | — | Redirige a `/` |

## Consumo JSON y API

### json-server (`JuegosApi`)

Backend REST local con `db.json`. Usado por catálogo, admin y `/juegos-json-server`.

| Método servicio | HTTP | Endpoint |
|-----------------|------|----------|
| `obtenerJuegos()` | GET | `/juegos` |
| `obtenerJuegoPorId(id)` | GET | `/juegos/:id` |
| `crearJuego(juego)` | POST | `/juegos` |
| `actualizarJuego(juego)` | PUT | `/juegos/:id` |
| `eliminarJuego(id)` | DELETE | `/juegos/:id` |

Configuración en `src/environments/environment.ts`:

```typescript
jsonServerUrl: 'http://localhost:3000'
```

### JSON estático + localStorage (`JuegosGithub`)

Ruta `/juegos-storage`:

- **GET** desde `public/data/juegos.json` (o URL de GitHub Pages).
- **POST / PUT / DELETE** simulados en localStorage (`mesamaestra_juegos_github`).

### Catálogo y admin (`Productos`)

- Carga juegos y categorías desde `JuegosApi` (json-server).
- Ofertas del panel admin en localStorage (`mesamaestra_ofertas`).
- CRUD de inventario en `/admin` persiste en `db.json`.

## Docker

```bash
npm run docker:up
```

| Servicio | URL |
|----------|-----|
| Angular + Nginx | http://localhost:8080 |
| json-server | http://localhost:3000/juegos |

Archivos: `Dockerfile`, `Dockerfile.api`, `docker-compose.yml`, `nginx.conf`.

Imagen publicada (opcional): `matvergarai/mesa-maestra:latest`

## Cuentas de prueba

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| `admin` | `Admin123` | Admin |
| `cliente` | `Cliente123` | Cliente |

Los usuarios registrados desde `/registro` se guardan en `localStorage` con rol `cliente`.

## Arquitectura

```
mesa-maestra/
├── db.json                              # Datos REST
├── docker-compose.yml
├── public/data/juegos.json              # JSON estático
├── src/app/
│   ├── app.config.ts                    # provideHttpClient()
│   ├── servicios/
│   │   ├── auth.ts                      # Sesión y usuarios
│   │   ├── carrito.ts                   # Carrito por usuario
│   │   ├── productos.ts                 # Catálogo + ofertas (→ JuegosApi)
│   │   ├── juegos-api.ts                # CRUD REST json-server
│   │   └── juegos-github.ts             # CRUD simulado localStorage
│   ├── pages/
│   │   ├── juegos-storage/              # JSON + localStorage
│   │   ├── juegos-json-server/          # CRUD REST
│   │   ├── admin/                       # Panel admin + CRUD inventario
│   │   └── ...
│   ├── guards/                          # auth-guard, admin-guard
│   ├── models/
│   └── utilidades/validadores.ts
└── src/environments/
    ├── environment.ts
    └── environment.prod.ts
```

Estilos en `src/styles/`. Imágenes en `public/img/`.

## Servicios

### `Auth`
- Login, registro y cierre de sesión
- Persistencia en `localStorage` (`mm_usuarios`, `mm_sesion`)
- Cuentas demo: `admin`, `cliente`

### `Carrito`
- Carrito separado para invitado y usuarios autenticados
- Fusión del carrito de invitado al iniciar sesión

### `Productos`
- Catálogo y categorías desde json-server vía `JuegosApi`
- Filtros, búsqueda y formateo de precios
- Ofertas configuradas en localStorage desde el panel admin

### `JuegosApi`
- CRUD HTTP contra json-server
- Usado por catálogo, admin e inventario

### `JuegosGithub`
- Lectura desde JSON estático remoto
- CRUD simulado en localStorage

### `JuegoNubeService`
- Panel flotante de descripción en las tarjetas de juego

## Componentes compartidos

| Componente | Selector | Descripción |
|------------|----------|-------------|
| CardJuego | `app-card-juego` | Tarjeta de juego con `@Input` y `@Output` |
| CardCategoria | `app-card-categoria` | Enlace visual a cada categoría |
| Navbar | `app-navbar` | Menú, carrito, sesión y rutas CRUD |
| Footer | `app-footer` | Contacto y horario |
| JuegoNube | `app-juego-nube` | Nube informativa global |

## Formularios reactivos

| Página | Archivo | Validaciones destacadas |
|--------|---------|---------------------------|
| Login | `pages/login/login.ts` | Usuario y contraseña requeridos |
| Registro | `pages/registro/registro.ts` | RUT, email, contraseña (5 reglas) |
| Recuperar | `pages/recuperar/recuperar.ts` | Email registrado |
| Perfil | `pages/perfil/perfil.ts` | Edición de datos del usuario |

Validadores en `utilidades/validadores.ts`.

## Documentación Compodoc

```bash
npm run doc
npm run doc:serve
```

Salida en `documentation/`.

## Pruebas unitarias

| Archivo | Qué prueba |
|---------|------------|
| `app.spec.ts` | Componente raíz y hero en home |
| `pages/login/login.spec.ts` | Formulario y login válido |
| `pages/registro/registro.spec.ts` | Validaciones de registro |

```bash
npm test
ng test --no-watch
```

## Build de producción

```bash
npm run build
```

Salida en `dist/mesa-maestra/`. Servir localmente:

```bash
npx serve dist/mesa-maestra/browser
```

## Autor

**matvergarai**

Repositorio: [github.com/matvergarai/MesaMaestra](https://github.com/matvergarai/MesaMaestra)
