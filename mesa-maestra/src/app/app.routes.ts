import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin-guard';
import { authGuard } from './guards/auth-guard';
import { Admin } from './pages/admin/admin';
import { CarritoPage } from './pages/carrito/carrito';
import { Catalogo } from './pages/catalogo/catalogo';
import { Categoria } from './pages/categoria/categoria';
import { Categorias } from './pages/categorias/categorias';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { PagoExitoso } from './pages/pago-exitoso/pago-exitoso';
import { Perfil } from './pages/perfil/perfil';
import { Recuperar } from './pages/recuperar/recuperar';
import { Registro } from './pages/registro/registro';

/** Rutas principales de la aplicación de una sola página MesaMaestra. */
export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: 'recuperar', component: Recuperar },
  { path: 'perfil', component: Perfil, canActivate: [authGuard] },
  { path: 'categorias', component: Categorias },
  { path: 'categoria/:id', component: Categoria },
  { path: 'catalogo', component: Catalogo },
  { path: 'carrito', component: CarritoPage },
  { path: 'pago-exitoso', component: PagoExitoso },
  { path: 'admin', component: Admin, canActivate: [adminGuard] },
  { path: '**', redirectTo: '' },
];
