import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Categoria } from '../models/categoria.model';
import { Juego } from '../models/juego.model';

/**
 * Cliente HTTP para json-server (API REST real).
 * Endpoints: GET /juegos, POST /juegos, PUT /juegos/:id, DELETE /juegos/:id
 */
@Service()
export class JuegosApi {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.jsonServerUrl;

  /** GET — Lista todos los juegos. */
  obtenerJuegos(): Observable<Juego[]> {
    return this.http.get<Juego[]>(`${this.baseUrl}/juegos`);
  }

  /** GET — Obtiene un juego por id. */
  obtenerJuegoPorId(id: number): Observable<Juego | null> {
    return this.http.get<Juego>(`${this.baseUrl}/juegos/${id}`).pipe(
      map((j) => j ?? null),
      catchError(() => of(null)),
    );
  }

  /** GET — Lista todas las categorías. */
  obtenerCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.baseUrl}/categorias`);
  }

  /** POST — Crea un juego en db.json vía json-server. */
  crearJuego(juego: Juego): Observable<Juego> {
    return this.http.post<Juego>(`${this.baseUrl}/juegos`, juego);
  }

  /** PUT — Actualiza un juego existente. */
  actualizarJuego(juego: Juego): Observable<Juego> {
    return this.http.put<Juego>(`${this.baseUrl}/juegos/${juego.id}`, juego);
  }

  /** DELETE — Elimina un juego por id. */
  eliminarJuego(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/juegos/${id}`);
  }

  /** Indica si ya existe un juego con el id dado. */
  existeJuego(id: number): Observable<boolean> {
    return this.obtenerJuegoPorId(id).pipe(map((j) => j !== null));
  }

  obtenerProximoId(juegos: Juego[]): number {
    if (juegos.length === 0) return 1;
    return Math.max(...juegos.map((j) => j.id)) + 1;
  }
}
