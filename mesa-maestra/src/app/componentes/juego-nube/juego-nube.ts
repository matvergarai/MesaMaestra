import { Component, HostListener, inject } from '@angular/core';
import { JuegoNubeService } from '../../servicios/juego-nube';

@Component({
  selector: 'app-juego-nube',
  imports: [],
  templateUrl: './juego-nube.html',
  styleUrl: './juego-nube.css',
})
/** Contenedor global de la nube informativa; cierra al redimensionar o pulsar la tecla Escape. */
export class JuegoNube {
  nube = inject(JuegoNubeService);

  @HostListener('window:resize')
  onResize(): void {
    this.nube.cerrar();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.nube.cerrar();
  }

  cerrar(): void {
    this.nube.cerrar();
  }
}
