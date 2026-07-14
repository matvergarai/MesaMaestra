# MesaMaestra

<p align="center">
  <img src="img/logo.svg" alt="Logo MesaMaestra" width="120">
</p>

> Tienda ficticia de juegos de mesa en Chile. Catálogo, carrito, autenticación con `localStorage`, panel de administración y consumo de datos JSON (json-server, localStorage y Docker).

Aplicación Angular en [`mesa-maestra/`](mesa-maestra/). La raíz del repositorio conserva la versión HTML/CSS/JS original como referencia histórica.

![Angular](https://img.shields.io/badge/Angular-22-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)

## Índice

- [Descripción](#descripción)
- [Requisitos](#requisitos)
- [Instalación y ejecución](#instalación-y-ejecución)
- [Scripts útiles](#scripts-útiles)
- [Cuentas de prueba](#cuentas-de-prueba)
- [Rutas de la aplicación](#rutas-de-la-aplicación)
- [Consumo de datos JSON](#consumo-de-datos-json)
- [Funcionalidades](#funcionalidades)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Documentación](#documentación)
- [Autor](#autor)

## Descripción

MesaMaestra simula la experiencia de una PYME chilena dedicada a la venta de juegos de mesa. Los usuarios exploran categorías, filtran el catálogo, agregan productos al carrito y completan un flujo de compra simulado. Los administradores gestionan inventario, usuarios y ofertas desde un panel dedicado.

La aplicación Angular 22 consume datos JSON de tres formas:

| Enfoque | Ruta | Persistencia |
|---------|------|--------------|
| JSON estático + localStorage | `/juegos-storage` | GET remoto · POST/PUT/DELETE en el navegador |
| json-server (REST) | `/juegos-json-server`, `/catalogo`, `/admin` | `db.json` |
| Docker Compose | `:8080` + `:3000` | Contenedores web + API |

Documentación técnica detallada: [`mesa-maestra/documentacion/SISTEMA.md`](mesa-maestra/documentacion/SISTEMA.md)

## Requisitos

- **Node.js** v20 LTS o superior (recomendado v22+)
- **npm** v10+
- **Docker Desktop** (opcional, para `docker compose`)

```bash
node -v
npm -v
```

## Instalación y ejecución

### Solo Angular

```bash
git clone https://github.com/matvergarai/MesaMaestra.git
cd MesaMaestra/mesa-maestra
npm install
npm start
```

→ http://localhost:4200

### Angular + API (json-server)

Terminal 1:

```bash
cd mesa-maestra
npm run api
```

Terminal 2:

```bash
npm start
```

→ API: http://localhost:3000/juegos  
→ App: http://localhost:4200

### Docker Compose (app + API)

```bash
cd mesa-maestra
npm run docker:up
```

→ App: http://localhost:8080  
→ API: http://localhost:3000/juegos

Documentación del proyecto Angular: [`mesa-maestra/README.md`](mesa-maestra/README.md)

## Scripts útiles

Ejecutar desde `mesa-maestra/`:

| Comando | Descripción |
|---------|-------------|
| `npm start` | Servidor de desarrollo Angular (:4200) |
| `npm run api` | json-server con `db.json` (:3000) |
| `npm run build` | Compilar para producción |
| `npm run docker:up` | Levantar Angular + json-server con Docker |
| `npm run docker:down` | Detener contenedores |
| `npm test` | Pruebas unitarias (Vitest) |
| `npm run doc` | Generar documentación Compodoc |

## Cuentas de prueba

| Usuario | Contraseña | Rol | Acceso |
|---------|------------|-----|--------|
| `admin` | `Admin123` | Admin | Panel admin, inventario, ofertas |
| `cliente` | `Cliente123` | Cliente | Catálogo, carrito, perfil |

También puedes registrarte desde `/registro`; las cuentas nuevas se crean con rol **cliente**.

## Rutas de la aplicación

| Página | Ruta |
|--------|------|
| Inicio | `/` |
| Inicio de sesión | `/login` |
| Registro | `/registro` |
| Recuperar clave | `/recuperar` |
| Perfil | `/perfil` *(requiere sesión)* |
| Categorías | `/categorias` |
| Juegos por categoría | `/categoria/:id` |
| Catálogo completo | `/catalogo` |
| Carrito | `/carrito` |
| Pago simulado | `/pago-exitoso` |
| Panel admin | `/admin` *(solo rol admin)* |
| CRUD JSON + localStorage | `/juegos-storage` |
| CRUD json-server | `/juegos-json-server` |

## Consumo de datos JSON

- **`db.json`** — base de datos REST para json-server (12 juegos, 4 categorías).
- **`public/data/juegos.json`** — JSON estático servido por Nginx o GitHub Pages.
- **`JuegosApi`** — servicio HTTP con GET, POST, PUT y DELETE contra json-server.
- **`JuegosGithub`** — GET remoto + CRUD simulado en localStorage.
- **`Productos`** — catálogo y admin cargados desde `JuegosApi`; ofertas en localStorage.

Autenticación, carrito y ofertas del admin siguen en **localStorage**. El inventario de juegos persiste en **`db.json`** vía json-server.

## Funcionalidades

- **4 categorías** y **12 juegos** con imagen, precio, stock y metadatos
- **Catálogo** con búsqueda, filtro por categoría y scroll por filas
- **Carrito** independiente por usuario con fusión al iniciar sesión
- **Formularios reactivos** en login, registro, recuperar y perfil
- **Guards:** `authGuard` (perfil) y `adminGuard` (panel admin)
- **Panel admin:** CRUD de juegos, usuarios registrados y gestión de ofertas
- **Vistas CRUD demo:** JSON + localStorage y json-server
- **Docker Compose:** frontend Nginx + API json-server
- **Diseño responsivo** para móvil, tablet y escritorio

## Estructura del repositorio

```
MesaMaestra/
├── mesa-maestra/                 # Aplicación Angular
│   ├── db.json                   # Datos REST (json-server)
│   ├── docker-compose.yml
│   ├── Dockerfile / Dockerfile.api
│   ├── public/data/              # JSON estático
│   ├── src/app/
│   │   ├── servicios/            # auth, carrito, productos, juegos-api, juegos-github
│   │   ├── pages/                # vistas incl. juegos-storage, juegos-json-server
│   │   └── ...
│   ├── documentacion/SISTEMA.md  # Documentación técnica del sistema
│   └── README.md
├── index.html                    # Versión HTML/JS legacy
├── css/ · js/ · pages/ · img/
└── README.md
```

## Documentación

| Recurso | Descripción |
|---------|-------------|
| [`mesa-maestra/README.md`](mesa-maestra/README.md) | Guía técnica Angular |
| [`mesa-maestra/documentacion/SISTEMA.md`](mesa-maestra/documentacion/SISTEMA.md) | Arquitectura JSON, API, Docker |
| `npm run doc` | Compodoc → `mesa-maestra/documentation/` |

## Autor

**matvergarai**

Repositorio: [github.com/matvergarai/MesaMaestra](https://github.com/matvergarai/MesaMaestra)
