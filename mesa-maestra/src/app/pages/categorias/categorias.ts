import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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

  categorias = this.productos.obtenerCategorias();

  contarJuegos(categoriaId: string): number {
    return this.productos.obtenerJuegosPorCategoria(categoriaId).length;
  }

  badgeHtml(categoriaId: string): string {
    return `<span class="badge bg-secondary mt-2">${this.contarJuegos(categoriaId)} juegos</span>`;
  }

  ngOnInit(): void {
    document.body.classList.add('pagina-listado');
  }

  ngOnDestroy(): void {
    document.body.classList.remove('pagina-listado');
  }
}
