# MesaMaestra

<p align="center">
  <img src="img/logo.svg" alt="Logo MesaMaestra" width="120">
</p>

> Aplicación web estática de una tienda ficticia de juegos de mesa en Chile. Incluye catálogo, carrito de compras, autenticación simulada con `localStorage` y panel de administración.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.3-7952B3?logo=bootstrap&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## Índice

- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Cómo ejecutar](#cómo-ejecutar)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Cuentas de prueba](#cuentas-de-prueba)
- [Páginas principales](#páginas-principales)
- [Características principales](#características-principales)
- [Notas técnicas](#notas-técnicas)
- [Autor](#autor)

## Descripción

MesaMaestra simula la experiencia de una PYME chilena dedicada a la venta de juegos de mesa. Los usuarios pueden explorar categorías, agregar productos al carrito y completar un flujo de compra simulado. Los administradores gestionan inventario, usuarios y ofertas desde un panel dedicado.

## Tecnologías

- **HTML5** — Estructura semántica de las páginas
- **CSS3** — Variables, animaciones y media queries
- **Bootstrap 5.3.3** — Componentes y sistema de grillas
- **JavaScript** — Validaciones, manipulación del DOM y persistencia con `localStorage`

## Cómo ejecutar

No requiere instalación de dependencias.

1. Clona el repositorio
2. Abre `index.html` en el navegador o usa una extensión tipo Live Server en tu editor

```bash
git clone https://github.com/matvergarai/MesaMaestra.git
cd MesaMaestra
```

Luego abre `index.html` directamente o inicia Live Server desde la raíz del proyecto.

## Estructura del proyecto

```
MesaMaestra/
├── index.html          → Página principal
├── css/                → Estilos
├── js/                 → Lógica de la aplicación
├── pages/              → Páginas internas
└── img/                → Logo e imágenes
```

## Cuentas de prueba

Usa estas credenciales para probar los distintos roles de la aplicación:

| Usuario | Contraseña | Rol     | Acceso                           |
|---------|------------|---------|----------------------------------|
| admin   | Admin123   | Admin   | Panel admin, inventario, ofertas |
| cliente | Cliente123 | Cliente | Catálogo, carrito, perfil        |

También puedes crear cuentas con la opción de registro integrada; estas se asignan con el rol **cliente** por defecto.

## Páginas principales

| Página           | Ruta                    |
|------------------|-------------------------|
| Inicio           | `index.html`            |
| Inicio de sesión | `pages/login.html`      |
| Registro         | `pages/registro.html`   |
| Recuperar clave  | `pages/recuperar.html`  |
| Perfil           | `pages/perfil.html`     |
| Categorías       | `pages/categorias.html` |
| Catálogo         | `pages/catalogo.html`   |
| Carrito          | `pages/carrito.html`    |
| Pago simulado    | `pages/pago-exitoso.html` |
| Panel admin      | `pages/admin.html`      |

## Características principales

- 4 categorías: Estrategia, Familiar, Party y Rol
- 12 juegos (3 por categoría) con imagen, precio y ofertas
- Validaciones JS en formularios (contraseña con 5 reglas)
- Diseño responsivo: móvil, tablet y escritorio
- Carrito independiente por usuario (invitado, cliente, admin)
- Panel admin: inventario, usuarios registrados y gestión de ofertas

## Notas técnicas

- La autenticación y el carrito persisten en `localStorage`; no hay backend ni base de datos.
- Los datos de productos y usuarios se gestionan desde JavaScript en el cliente.

## Autor

**matvergarai**  
Duoc UC — Desarrollo Full Stack 2 — 2026

Repositorio: [github.com/matvergarai/MesaMaestra](https://github.com/matvergarai/MesaMaestra)
