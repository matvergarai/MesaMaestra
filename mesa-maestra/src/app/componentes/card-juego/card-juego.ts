import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Juego } from '../../models/juego.model';
import { Carrito } from '../../servicios/carrito';
import { JuegoNubeService } from '../../servicios/juego-nube';
import { Productos } from '../../servicios/productos';

@Component({
  selector: 'app-card-juego',
  imports: [],
  templateUrl: './card-juego.html',
  styleUrl: './card-juego.css',
  host: {
    class: 'col-md-6 col-lg-4 mb-4',
    '[class.anim-fade-in]': 'animar',
    '[class.anim-fade-in--instante]': '!animar',
    '[style.animation-delay]': 'delayAnim',
  },
})
/**
 * Tarjeta reutilizable de juego para catálogo, inicio y categorías.
 * Las clases Bootstrap van en el elemento anfitrión para que la grilla .row funcione correctamente.
 */
export class CardJuego {
  /** Datos del juego a mostrar (obligatorio). */
  @Input({ required: true }) juego!: Juego;
  /** Índice en la lista; define el retardo de la animación de entrada. */
  @Input() indice = 0;
  /** Si es false, la tarjeta aparece sin animación (filtros del catálogo). */
  @Input() animar = true;
  /** Precarga las primeras imágenes visibles del catálogo (atributo loading="eager"). */
  @Input() eagerImage = false;

  /** Notifica al componente padre cuando el usuario agrega el juego al carrito. */
  @Output() juegoAgregado = new EventEmitter<Juego>();

  private carrito = inject(Carrito);
  private productos = inject(Productos);
  private nube = inject(JuegoNubeService);

  imagenOculta = false;

  get delayAnim(): string {
    return this.animar ? Math.min(this.indice * 0.04, 0.24) + 's' : '0s';
  }

  get loadingImage(): string {
    return this.eagerImage && this.indice < 6 ? 'eager' : 'lazy';
  }

  formatearPrecio(precio: number): string {
    return this.productos.formatearPrecio(precio);
  }

  formatearJugadores(): string {
    return this.productos.formatearJugadores(this.juego);
  }

  iconoCategoria(): string {
    return this.productos.obtenerIconoCategoria(this.juego.categoria);
  }

  nombreCategoria(): string {
    return this.productos.obtenerCategoria(this.juego.categoria)?.nombre ?? this.juego.categoria;
  }

  botonNubeActivo(tipo: string): boolean {
    return this.nube.botonActivoId() === this.juego.id + '-' + tipo;
  }

  toggleNube(event: Event, tipo: 'descripcion' | 'recomendacion'): void {
    const btn = event.currentTarget as HTMLElement;
    const botonId = this.juego.id + '-' + tipo;

    if (this.nube.botonActivoId() === botonId) {
      this.nube.cerrar();
      return;
    }

    const texto = tipo === 'descripcion' ? this.juego.descripcion : this.juego.recomendacion;
    const etiqueta = tipo === 'descripcion' ? 'Acerca del juego' : '¿Por qué recomendamos?';
    this.nube.abrir(btn, texto, botonId, etiqueta, this.nube.visible());
  }

  agregarAlCarrito(): void {
    this.carrito.agregarJuego(this.juego);
    this.juegoAgregado.emit(this.juego);
    alert(this.juego.nombre + ' agregado al carrito.');
  }

  onErrorImagen(): void {
    this.imagenOculta = true;
  }
}
