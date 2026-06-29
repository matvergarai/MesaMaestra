import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../servicios/auth';
import { Carrito } from '../../servicios/carrito';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
/** Barra de navegación: sesión, carrito y menú según rol del usuario. */
export class Navbar {
  private auth = inject(Auth);
  private carrito = inject(Carrito);
  private router = inject(Router);

  /** Lee la señal del servicio Auth para reaccionar al iniciar o cerrar sesión. */
  readonly sesion = this.auth.sesionActiva;

  /** Reacciona a cambios del carrito mediante la señal version del servicio. */
  totalCarrito = computed(() => {
    this.carrito.version();
    return this.carrito.contarItems();
  });

  badgeCarrito = computed(() => {
    const total = this.totalCarrito();
    if (total <= 0) return '';
    return total > 9 ? '9+' : String(total);
  });

  primerNombre = computed(() => this.sesion()?.nombreCompleto.split(' ')[0] ?? '');

  cerrarSesion(event: Event): void {
    event.preventDefault();
    this.auth.cerrarSesion();
    this.router.navigate(['/']);
  }
}
