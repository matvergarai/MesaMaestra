import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardJuego } from '../../componentes/card-juego/card-juego';
import { CardCategoria } from '../../componentes/card-categoria/card-categoria';
import { Juego } from '../../models/juego.model';
import { Productos } from '../../servicios/productos';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, CardJuego, CardCategoria],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
/** Página de inicio: sección principal, categorías y juegos destacados en oferta. */
export class Home implements OnInit {
  private productos = inject(Productos);

  categorias = signal(this.productos.obtenerCategorias());
  destacados = signal<Juego[]>([]);
  cargando = signal(true);

  ngOnInit(): void {
    this.productos.cargarCatalogo().subscribe({
      next: () => {
        this.categorias.set(this.productos.obtenerCategorias());
        this.destacados.set(this.productos.obtenerJuegosEnOferta().slice(0, 3));
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
      },
    });
  }

  /** Ejemplo de salida (@Output): el padre puede reaccionar al agregar desde destacados. */
  onJuegoAgregado(juego: Juego): void {
    console.log('Juego agregado desde home:', juego.nombre);
  }
}
