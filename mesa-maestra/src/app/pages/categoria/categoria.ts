import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CardJuego } from '../../componentes/card-juego/card-juego';
import { Categoria as CategoriaModel } from '../../models/categoria.model';
import { Juego } from '../../models/juego.model';
import { Productos } from '../../servicios/productos';

@Component({
  selector: 'app-categoria',
  imports: [RouterLink, CardJuego],
  templateUrl: './categoria.html',
  styleUrl: './categoria.css',
})
/** Listado de juegos filtrado por categoría (parámetro :id en la ruta). */
export class Categoria implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private productos = inject(Productos);

  categoria = signal<CategoriaModel | null>(null);
  juegos = signal<Juego[]>([]);
  cargando = signal(true);

  ngOnInit(): void {
    document.body.classList.add('pagina-listado');
    const catId = this.route.snapshot.paramMap.get('id') ?? '';

    this.productos.cargarCatalogo().subscribe({
      next: () => {
        this.categoria.set(this.productos.obtenerCategoria(catId) ?? null);
        if (this.categoria()) {
          this.juegos.set(this.productos.obtenerJuegosPorCategoria(catId));
        }
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
      },
    });
  }

  ngOnDestroy(): void {
    document.body.classList.remove('pagina-listado');
  }
}
