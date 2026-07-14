/** Configuración de entorno — desarrollo local. */
export const environment = {
  production: false,
  /** API REST json-server (CRUD real: GET, POST, PUT, DELETE). */
  jsonServerUrl: 'http://localhost:3000',
  /**
   * JSON estático (solo GET real). En local usa /data/juegos.json servido por Angular/Nginx.
   * En GitHub Pages reemplazar por: https://TU-USUARIO.github.io/TU-REPO/data/juegos.json
   */
  githubPagesJuegosUrl: '/data/juegos.json',
};
