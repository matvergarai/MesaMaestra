- Proyecto "MesaMaestra"
- Descripción: Aplicación web estática de una tienda fictica con catálogo, carrito de compras, autenticación simulada con localStorage y panel de administración. 
- Temática: PYME de venta de juegos de mesa en Chile.

Tecnologías utilizadas:
- HTML5
- CSS3 (variables, animaciones, media queries)
- Bootstrap 5.3.3
- JavaScript (validaciones, DOM, localStorage)

Cómo ejecutar:

No requiere instalación de dependencias. Abre index.html en el navegador o usa una extensión tipo Live Server en tu editor de texto preferido.

Carpetas:

mesamaestra/
├── index.html          → Página principal
├── css/                → Estilos
├── js/                 → Lógica de la aplicación
├── pages/              → Páginas internas
└── img/                → Logo e imágenes


Cuentas de prueba creadas:

| Usuario  | Contraseña  | Rol     | Acceso                           |
|----------|-------------|---------|----------------------------------|
| admin    | Admin123    | Admin   | Panel admin, inventario, ofertas |
| cliente  | Cliente123  | Cliente | Catálogo, carrito, perfil        |

Se pueden crear cuentas con la opción de registro integrada en la app, estas serán designadas con el rol "cliente" por default.

Páginas principales:

| Página            | Ruta                    |
|-------------------|-------------------------|
| Inicio            | index.html              |
| Inicio de sesión  | pages/login.html        |
| Registro          | pages/registro.html     |
| Recuperar clave   | pages/recuperar.html    |
| Perfil            | pages/perfil.html       |
| Categorías        | pages/categorias.html   |
| Catálogo          | pages/catalogo.html     |
| Carrito           | pages/carrito.html      |
| Pago simulado     | pages/pago-exitoso.html |
| Panel admin       | pages/admin.html        |

Características Principales:
- 4 categorías: Estrategia, Familiar, Party, Rol.
- 12 juegos (3 por categoría) con imagen, precio y ofertas.
- Validaciones JS en formularios (contraseña con 5 reglas).
- Diseño responsivo: móvil, tablet y escritorio.
- Carrito independiente por usuario (invitado, cliente, admin).
- Panel admin: inventario, usuarios registrados y gestión de ofertas.

Repositorio:

https://github.com/matvergarai/MesaMaestra


Matías Vergara Inyelco
Duoc UC - Desarrollo Full Stack 2 - 2026