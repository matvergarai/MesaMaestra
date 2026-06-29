import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
/** Pie de página con datos de contacto y copiado simulado al portapapeles. */
export class Footer {
  avisoContacto = signal('');

  copiarContacto(dato: string): void {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(dato).catch(() => undefined);
    }
    this.avisoContacto.set('Contacto simulado: ' + dato + ' (copiado al portapapeles)');
    setTimeout(() => this.avisoContacto.set(''), 3500);
  }
}
