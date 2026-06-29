/** Protección de ruta funcional: solo permite acceso si hay sesión activa (ruta /perfil). */
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../servicios/auth';

export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (auth.estaLogeado()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
