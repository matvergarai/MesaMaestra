# MesaMaestra

<p align="center">
  <img src="img/logo.svg" alt="Logo MesaMaestra" width="120">
</p>

> Tienda ficticia de juegos de mesa en Chile. Catálogo, carrito, autenticación simulada con `localStorage` y panel de administración.

**Entrega principal:** aplicación Angular en [`mesa-maestra/`](mesa-maestra/)  
**Referencia histórica:** versión HTML/CSS/JS en la raíz del repositorio

![Angular](https://img.shields.io/badge/Angular-22-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white)

## Índice

- [Descripción](#descripción)
- [Requisitos](#requisitos)
- [Instalación y ejecución](#instalación-y-ejecución)
- [Scripts útiles](#scripts-útiles)
- [Cuentas de prueba](#cuentas-de-prueba)
- [Rutas de la aplicación](#rutas-de-la-aplicación)
- [Funcionalidades](#funcionalidades)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Documentación y pruebas](#documentación-y-pruebas)
- [Notas técnicas](#notas-técnicas)
- [Autor](#autor)

## Descripción

MesaMaestra simula la experiencia de una PYME chilena dedicada a la venta de juegos de mesa. Los usuarios pueden explorar categorías, filtrar el catálogo, agregar productos al carrito y completar un flujo de compra simulado. Los administradores gestionan inventario, usuarios registrados y ofertas desde un panel dedicado.

El proyecto fue migrado desde una versión estática (HTML, CSS y JavaScript) a **Angular 22**, conservando el diseño visual y las funcionalidades del frontend original.

## Requisitos

- **Node.js** LTS v20 o superior (recomendado v24)
- **npm** (incluido con Node.js)
- **Angular CLI** (opcional; el proyecto incluye `@angular/cli` como dependencia de desarrollo)

Verificar instalación:

```bash
node -v
npm -v
```

## Instalación y ejecución

```bash
git clone https://github.com/matvergarai/MesaMaestra.git
cd MesaMaestra/mesa-maestra
npm install
npm start
```

Abrir en el navegador: **http://localhost:4200/**

Si el puerto 4200 está ocupado:

```powershell
# Windows — liberar el puerto 4200
Get-NetTCPConnection -LocalPort 4200 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

Documentación detallada del proyecto Angular: [`mesa-maestra/README.md`](mesa-maestra/README.md)

## Scripts útiles

Ejecutar desde la carpeta `mesa-maestra/`:

| Comando | Descripción |
|---------|-------------|
| `npm start` | Servidor de desarrollo (`ng serve`) |
| `npm run build` | Compilar para producción |
| `npm test` | Pruebas unitarias con Vitest |
| `npm run doc` | Generar documentación Compodoc |
| `npm run doc:serve` | Compodoc con servidor local |

## Cuentas de prueba

| Usuario | Contraseña | Rol | Acceso |
|---------|------------|-----|--------|
| `admin` | `Admin123` | Admin | Panel admin, inventario, ofertas |
| `cliente` | `Cliente123` | Cliente | Catálogo, carrito, perfil |

También puedes registrarte desde `/registro`; las cuentas nuevas se crean con rol **cliente**.

## Rutas de la aplicación

| Página | Ruta Angular |
|--------|--------------|
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

## Funcionalidades

- **4 categorías:** Estrategia, Familiar, Party y Rol
- **12 juegos** (3 por categoría) con imagen, precio, ofertas y metadatos
- **Carrito** independiente por usuario (invitado, cliente, admin) con fusión al iniciar sesión
- **Catálogo** con búsqueda, filtro por categoría y scroll por filas
- **Formularios reactivos** en login, registro, recuperar contraseña y perfil
- **Validaciones personalizadas** (contraseña con 5 reglas, RUT chileno, etc.)
- **Guards de ruta:** `authGuard` (perfil) y `adminGuard` (panel admin)
- **Panel admin:** inventario, usuarios registrados y gestión de ofertas
- **Diseño responsivo** para móvil, tablet y escritorio

### Angular — elementos de la evaluación

| Elemento | Implementación |
|----------|----------------|
| Componentes standalone | Todas las páginas y componentes compartidos |
| Servicios | `Auth`, `Carrito`, `Productos`, `JuegoNubeService` |
| Directivas | `*ngIf`, `*ngFor`, `[(ngModel)]` |
| `@Input` / `@Output` | `card-juego`, `card-categoria` |
| Formularios reactivos | Login, registro, recuperar, perfil |
| Compodoc | `npm run doc` → carpeta `documentation/` |
| Pruebas unitarias | `app.spec.ts`, `login.spec.ts`, `registro.spec.ts` |

## Estructura del repositorio

```
MesaMaestra/
├── mesa-maestra/              # Aplicación Angular (entrega principal)
│   ├── src/app/
│   │   ├── componentes/       # navbar, footer, card-juego, card-categoria, juego-nube
│   │   ├── servicios/         # auth, carrito, productos, juego-nube
│   │   ├── guards/            # auth-guard, admin-guard
│   │   ├── pages/             # vistas de la aplicación
│   │   ├── models/            # interfaces TypeScript
│   │   ├── datos/             # catálogo estático de juegos
│   │   └── utilidades/        # validadores de formularios
│   ├── public/img/            # imágenes de la tienda
│   ├── documentation/         # documentación Compodoc generada
│   └── README.md              # documentación técnica Angular
├── index.html                 # Versión HTML/JS legacy
├── css/                       # Estilos originales
├── js/                        # Lógica JavaScript original
├── pages/                     # Páginas HTML originales
├── img/                       # Imágenes compartidas
└── instrucciones/             # Material de la asignatura
```

## Documentación y pruebas

### Compodoc

```bash
cd mesa-maestra
npm run doc
npm run doc:serve
```

La documentación se genera en `mesa-maestra/documentation/`.

### Pruebas unitarias

```bash
cd mesa-maestra
npm test
```

Incluye 8 pruebas en total:

- Componente raíz (`app.spec.ts`)
- Formulario de login (`login.spec.ts`)
- Validaciones de registro (`registro.spec.ts`)

## Notas técnicas

- No hay backend ni base de datos: autenticación, carrito y ofertas persisten en **`localStorage`** del navegador.
- Los datos de productos están definidos en `mesa-maestra/src/app/datos/productos.data.ts`.
- La carpeta `node_modules/` **no** debe subirse a Git (está en `.gitignore`).
- Tras clonar el repositorio, siempre ejecutar `npm install` dentro de `mesa-maestra/`.

### Versión HTML estática (legacy)

Para ver la versión original sin Angular:

1. Clona el repositorio
2. Abre `index.html` en el navegador o usa Live Server

## Autor

**matvergarai**  
Duoc UC — Desarrollo Full Stack 2 — 2026

Repositorio: [github.com/matvergarai/MesaMaestra](https://github.com/matvergarai/MesaMaestra)
