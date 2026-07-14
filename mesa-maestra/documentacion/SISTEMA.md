# MesaMaestra — Documentación del sistema

Aplicación Angular 22 para tienda de juegos de mesa. Consume datos JSON mediante tres enfoques: JSON estático + localStorage, json-server (REST) y Docker Compose.

---

## 1. Resumen de la solución

| Ruta | Enfoque | Métodos HTTP | Persistencia |
|------|---------|--------------|--------------|
| `/juegos-storage` | JSON estático + localStorage | GET real · POST/PUT/DELETE simulados | Navegador (localStorage) |
| `/juegos-json-server` | json-server + db.json | GET · POST · PUT · DELETE reales | `db.json` |
| `/catalogo`, `/admin` | json-server (servicio `JuegosApi`) | GET · POST · PUT · DELETE reales | `db.json` |

---

## 2. Estructura de archivos

```
mesa-maestra/
├── db.json                          # Base de datos REST (json-server)
├── docker-compose.yml               # Angular/Nginx + json-server
├── Dockerfile                       # Frontend (Node 22 build + Nginx)
├── Dockerfile.api                   # json-server
├── public/data/juegos.json          # JSON estático (Nginx / GitHub Pages)
├── public/data/categorias.json
├── src/app/servicios/
│   ├── juegos-api.ts                # CRUD REST → json-server
│   ├── juegos-github.ts             # CRUD simulado → localStorage
│   └── productos.ts                 # Catálogo + admin (usa juegos-api)
├── src/app/pages/
│   ├── juegos-storage/              # Vista JSON + localStorage
│   └── juegos-json-server/          # Vista json-server
└── src/environments/
    ├── environment.ts               # Desarrollo
    └── environment.prod.ts          # Producción / Docker
```

---

## 3. Modelo de datos (`db.json`)

```json
{
  "juegos": [ { "id": 1, "nombre": "Catan", "precio": 29990, "stock": 15, ... } ],
  "categorias": [ { "id": "estrategia", "nombre": "Estrategia", ... } ]
}
```

Regenerar `db.json` desde el seed Firebase (opcional):

```bash
node -e "const s=require('./firebase/database.seed.json'); const fs=require('fs'); fs.writeFileSync('db.json', JSON.stringify({ juegos: Object.values(s.juegos), categorias: Object.values(s.categorias) }, null, 2));"
```

---

## 4. Desarrollo local

### Terminal 1 — API REST

```bash
cd mesa-maestra
npm run api
```

- http://localhost:3000/juegos
- http://localhost:3000/categorias

### Terminal 2 — Angular

```bash
npm start
```

- http://localhost:4200

### Rutas

| URL | Descripción |
|-----|-------------|
| http://localhost:4200/juegos-storage | Tabla desde `/data/juegos.json`; crear/editar/eliminar en localStorage |
| http://localhost:4200/juegos-json-server | CRUD persiste en `db.json` |
| http://localhost:4200/catalogo | Catálogo desde json-server |
| http://localhost:4200/admin | Panel admin (login: `admin` / `Admin123`) |

---

## 5. JSON estático (GitHub Pages)

1. Publicar `public/data/juegos.json` en un repositorio con GitHub Pages activo.
2. Actualizar `src/environments/environment.ts`:

```typescript
githubPagesJuegosUrl: 'https://TU-USUARIO.github.io/TU-REPO/data/juegos.json',
```

3. En `/juegos-storage`, el GET lee esa URL; POST/PUT/DELETE siguen en localStorage.

En local y Docker se usa `/data/juegos.json`, servido por Nginx desde `public/data/`.

---

## 6. Servicios Angular

### `JuegosApi` — REST (json-server)

| Método servicio | HTTP | Endpoint |
|-----------------|------|----------|
| `obtenerJuegos()` | GET | `/juegos` |
| `obtenerJuegoPorId(id)` | GET | `/juegos/:id` |
| `crearJuego(juego)` | POST | `/juegos` |
| `actualizarJuego(juego)` | PUT | `/juegos/:id` |
| `eliminarJuego(id)` | DELETE | `/juegos/:id` |

Configuración: `environment.jsonServerUrl` → `http://localhost:3000`

### `JuegosGithub` — CRUD simulado

| Método servicio | Comportamiento |
|-----------------|----------------|
| `obtenerJuegos()` | GET remoto (1ª vez) → guarda en localStorage |
| `crearJuego()` | POST simulado → localStorage |
| `actualizarJuego()` | PUT simulado → localStorage |
| `eliminarJuego()` | DELETE simulado → localStorage |
| `resetearDesdeRemoto()` | Borra localStorage y vuelve a hacer GET |

Clave localStorage: `mesamaestra_juegos_github`

---

## 7. Docker Compose

Requiere Docker Desktop en ejecución.

```bash
cd mesa-maestra
npm run docker:up
```

| Servicio | Contenedor | URL |
|----------|------------|-----|
| Angular + Nginx | mesamaestra-web | http://localhost:8080 |
| json-server | mesamaestra-api | http://localhost:3000/juegos |

Detener:

```bash
npm run docker:down
```

### Arquitectura

```
┌─────────────────────┐     GET/POST/PUT/DELETE     ┌─────────────────────┐
│  Navegador          │ ──────────────────────────► │  json-server :3000  │
│  localhost:8080     │                             │  db.json            │
└─────────────────────┘                             └─────────────────────┘
         │
         ▼
┌─────────────────────┐
│  Nginx :80          │  Sirve Angular compilado + /data/juegos.json
│  (contenedor web)   │
└─────────────────────┘
```

---

## 8. Docker (solo frontend)

Si json-server corre por separado:

```bash
npm run docker:build
npm run docker:run
```

Imagen publicada (opcional): `matvergarai/mesa-maestra:latest`

---

## 9. Roles y autenticación

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| admin | Admin123 | admin — acceso a `/admin` |
| cliente | Cliente123 | cliente |

Las rutas `/juegos-storage` y `/juegos-json-server` son de acceso público.

---

## 10. Solución de problemas

| Problema | Solución |
|----------|----------|
| json-server no conecta | Ejecutar `npm run api` o `docker compose up` |
| Puerto 3000 ocupado | No ejecutar `npm run api` y Docker Compose a la vez |
| CORS | json-server permite CORS por defecto |
| Catálogo vacío | Verificar http://localhost:3000/juegos |
| Storage no carga | Verificar `/data/juegos.json` en el navegador |
| Docker build falla | Dockerfile usa `node:22-alpine` |
| Cambios no persisten en Docker | El volumen `./db.json:/data/db.json` en compose guarda en disco local |

---

## 11. Scripts npm

| Comando | Descripción |
|---------|-------------|
| `npm start` | Angular dev server (:4200) |
| `npm run api` | json-server (:3000) |
| `npm run build` | Build producción |
| `npm run docker:up` | Docker Compose completo |
| `npm run docker:down` | Detener contenedores |
| `npm run docker:build` | Solo imagen frontend |
| `npm run docker:run` | Contenedor frontend (:8080) |
| `npm run firebase:seed` | Generar seed Firebase |
| `npm run firebase:deploy-rules` | Desplegar reglas Firebase |
| `npm run firebase:import-seed` | Importar seed a Firebase |
