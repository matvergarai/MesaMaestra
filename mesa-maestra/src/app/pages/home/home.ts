import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
export class Home {
  private productos = inject(Productos);

  categorias = this.productos.obtenerCategorias();
  destacados = this.productos.obtenerJuegosEnOferta().slice(0, 3);

  /** Ejemplo de salida (@Output): el padre puede reaccionar al agregar desde destacados. */
  onJuegoAgregado(juego: Juego): void {
    console.log('Juego agregado desde home:', juego.nombre);
  }
}
