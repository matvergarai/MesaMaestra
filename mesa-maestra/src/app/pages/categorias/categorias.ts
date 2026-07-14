import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Productos } from '../../servicios/productos';
import { CardCategoria } from '../../componentes/card-categoria/card-categoria';

@Component({
  selector: 'app-categorias',
  imports: [CardCategoria],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css',
})
/** Página con las cuatro categorías y contador de juegos por cada una. */
export class Categorias implements OnInit, OnDestroy {
  private productos = inject(Productos);

  /** Señal reactiva: Angular 22 actualiza la vista al cargar desde la API. */
  categorias = signal(this.productos.obtenerCategorias());
  cargando = signal(true);
  error = signal<string | null>(null);

  contarJuegos(categoriaId: string): number {
    return this.productos.obtenerJuegosPorCategoria(categoriaId).length;
  }

  badgeHtml(categoriaId: string): string {
    return `<span class="badge bg-secondary mt-2">${this.contarJuegos(categoriaId)} juegos</span>`;
  }

  ngOnInit(): void {
    document.body.classList.add('pagina-listado');
    this.productos.cargarCatalogo().subscribe({
      next: () => {
        this.categorias.set(this.productos.obtenerCategorias());
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las categorías.');
        this.cargando.set(false);
      },
    });
  }

  ngOnDestroy(): void {
    document.body.classList.remove('pagina-listado');
  }
}
