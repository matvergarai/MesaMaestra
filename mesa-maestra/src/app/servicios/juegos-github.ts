import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Juego } from '../models/juego.model';

const CLAVE_STORAGE = 'mesamaestra_juegos_github';

/**
 * CRUD simulado: lectura inicial desde JSON estático (GitHub Pages o /data local)
 * y persistencia de cambios en localStorage del navegador.
 * POST, PUT y DELETE no modifican el archivo remoto (solo GET es real).
 */
@Service()
export class JuegosGithub {
  private http = inject(HttpClient);

  /** GET simulado: lee desde localStorage o siembra desde el JSON remoto. */
  obtenerJuegos(): Observable<Juego[]> {
    const local = this.leerLocal();
    if (local.length > 0) return of(local);

    return this.http.get<Juego[]>(environment.githubPagesJuegosUrl).pipe(
      tap((juegos) => this.guardarLocal(juegos)),
    );
  }

  /** POST simulado — agrega en localStorage. */
  crearJuego(juego: Juego): Observable<Juego> {
    const lista = this.leerLocal();
    if (lista.some((j) => j.id === juego.id)) {
      throw new Error('Ya existe un juego con id ' + juego.id);
    }
    lista.push(juego);
    this.guardarLocal(lista);
    return of(juego);
  }

  /** PUT simulado — actualiza en localStorage. */
  actualizarJuego(juego: Juego): Observable<Juego> {
    const lista = this.leerLocal();
    const idx = lista.findIndex((j) => j.id === juego.id);
    if (idx === -1) throw new Error('Juego no encontrado');
    lista[idx] = { ...juego };
    this.guardarLocal(lista);
    return of(juego);
  }

  /** DELETE simulado — elimina de localStorage. */
  eliminarJuego(id: number): Observable<void> {
    const lista = this.leerLocal().filter((j) => j.id !== id);
    if (lista.length === this.leerLocal().length) throw new Error('Juego no encontrado');
    this.guardarLocal(lista);
    return of(void 0);
  }

  /** Reinicia localStorage desde el JSON remoto (GET real). */
  resetearDesdeRemoto(): Observable<Juego[]> {
    localStorage.removeItem(CLAVE_STORAGE);
    return this.obtenerJuegos();
  }

  existeJuego(id: number): Observable<boolean> {
    return this.obtenerJuegos().pipe(map((lista) => lista.some((j) => j.id === id)));
  }

  obtenerProximoId(): Observable<number> {
    return this.obtenerJuegos().pipe(
      map((lista) => {
        if (lista.length === 0) return 1;
        return Math.max(...lista.map((j) => j.id)) + 1;
      }),
    );
  }

  private leerLocal(): Juego[] {
    try {
      const raw = localStorage.getItem(CLAVE_STORAGE);
      return raw ? (JSON.parse(raw) as Juego[]) : [];
    } catch {
      return [];
    }
  }

  private guardarLocal(juegos: Juego[]): void {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(juegos));
  }
}
