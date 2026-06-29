import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Categoria } from '../../models/categoria.model';

@Component({
  selector: 'app-card-categoria',
  imports: [RouterLink],
  templateUrl: './card-categoria.html',
  styleUrl: './card-categoria.css',
})
/** Tarjeta visual de categoría con enlace a /categoria/:id. */
export class CardCategoria {
  /** Datos de la categoría a mostrar (obligatorio). */
  @Input({ required: true }) categoria!: Categoria;
  /** Retardo escalonado de la animación según posición en la fila. */
  @Input() indice = 0;
  /** Marcado HTML opcional debajo de la descripción (p. ej. contador de juegos). */
  @Input() extraHtml = '';

  imagenOk = false;
  imagenFallo = false;

  get delayAnim(): string {
    return this.indice * 0.08 + 's';
  }

  onLoadImagen(event: Event): void {
    this.imagenOk = true;
    (event.target as HTMLElement).closest('.categoria-img-wrap')?.classList.add('tiene-imagen');
  }

  onErrorImagen(img: HTMLImageElement): void {
    if (img.dataset['respaldo'] && !img.dataset['fb']) {
      img.dataset['fb'] = '1';
      img.src = img.dataset['respaldo'];
    } else {
      img.classList.add('sin-imagen');
      this.imagenFallo = true;
    }
  }
}
