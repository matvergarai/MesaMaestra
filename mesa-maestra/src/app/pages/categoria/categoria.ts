import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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

  categoria: CategoriaModel | null = null;
  juegos: Juego[] = [];

  ngOnInit(): void {
    document.body.classList.add('pagina-listado');
    const catId = this.route.snapshot.paramMap.get('id') ?? '';
    this.categoria = this.productos.obtenerCategoria(catId) ?? null;
    if (this.categoria) {
      this.juegos = this.productos.obtenerJuegosPorCategoria(catId);
    }
  }

  ngOnDestroy(): void {
    document.body.classList.remove('pagina-listado');
  }
}
