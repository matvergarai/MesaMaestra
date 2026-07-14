/**
 * Reescribe solo el nodo /juegos en Firebase con el formato objeto correcto.
 * Ejecutar si juegos.json devuelve un array en lugar de {"1": {...}, "2": {...}}.
 *
 * Uso: node scripts/reparar-juegos-firebase.mjs
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const seed = JSON.parse(readFileSync(join(__dirname, '../firebase/database.seed.json'), 'utf8'));
const url = 'https://mesamaestra-default-rtdb.firebaseio.com/juegos.json';

const res = await fetch(url, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(seed.juegos),
});

if (!res.ok) {
  console.error('Error', res.status, await res.text());
  process.exit(1);
}

console.log('Nodo /juegos reparado con formato objeto (' + Object.keys(seed.juegos).length + ' juegos).');
console.log('Verifica: https://mesamaestra-default-rtdb.firebaseio.com/juegos.json');
