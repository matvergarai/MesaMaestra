import { Service, signal } from '@angular/core';

/**
 * Estado compartido de la nube informativa flotante (descripción / recomendación).
 * Se posiciona junto al botón que la activa dentro de cada tarjeta de juego.
 */
@Service()
export class JuegoNubeService {  visible = signal(false);
  texto = signal('');
  abajo = signal(false);
  top = signal(0);
  left = signal(0);
  width = signal(320);
  flechaLeft = signal(18);
  ariaLabel = signal('Información del juego');
  botonActivoId = signal<string | null>(null);

  abrir(
    boton: HTMLElement,
    texto: string,
    botonId: string,
    etiqueta: string,
    yaVisible: boolean,
  ): void {
    this.texto.set(texto);
    this.ariaLabel.set(etiqueta);
    this.botonActivoId.set(botonId);
    this.posicionar(boton, yaVisible);
    this.visible.set(true);
  }

  cerrar(): void {
    this.visible.set(false);
    this.botonActivoId.set(null);
  }

  /** Calcula posición en pantalla; invierte arriba/abajo si no hay espacio. */
  private posicionar(boton: HTMLElement, medirFuera: boolean): void {
    const rect = boton.getBoundingClientRect();
    const nubeAncho = Math.min(320, window.innerWidth - 24);
    this.width.set(nubeAncho);
    this.abajo.set(false);

    let top = rect.top - 120;
    let left = rect.left + rect.width / 2 - nubeAncho / 2;

    if (top < 12) {
      top = rect.bottom + 14;
      this.abajo.set(true);
    }

    left = Math.max(12, Math.min(left, window.innerWidth - nubeAncho - 12));
    this.top.set(top);
    this.left.set(left);

    const flecha = rect.left + rect.width / 2 - left;
    this.flechaLeft.set(Math.max(18, Math.min(flecha, nubeAncho - 18)));
  }
}
