/** Protección de ruta funcional: solo permite acceso con rol administrador (ruta /admin). */
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../servicios/auth';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);
  const sesion = auth.obtenerSesion();

  if (!sesion) {
    return router.createUrlTree(['/login']);
  }

  if (sesion.rol === 'admin') {
    return true;
  }

  alert('No tienes permisos para acceder a esta sección.');
  return router.createUrlTree(['/']);
};
