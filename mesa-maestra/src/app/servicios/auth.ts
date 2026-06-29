import { Service, signal } from '@angular/core';
import { Sesion, Usuario } from '../models/usuario.model';

/** Claves de almacenamiento en localStorage. */
const USUARIOS_KEY = 'mesamaestra_usuarios';
const SESION_KEY = 'mesamaestra_sesion';

/**
 * Servicio de autenticación simulada.
 * Persiste usuarios y sesión en localStorage (sin backend).
 */
@Service()
export class Auth {
  /** Señal reactiva para que la barra de navegación detecte inicio y cierre de sesión. */
  private readonly _sesion = signal<Sesion | null>(this.cargarSesionDesdeStorage());
  readonly sesionActiva = this._sesion.asReadonly();

  constructor() {
    this.inicializarUsuarios();
  }

  private cargarSesionDesdeStorage(): Sesion | null {
    try {
      const sesion = localStorage.getItem(SESION_KEY);
      return sesion ? JSON.parse(sesion) : null;
    } catch {
      return null;
    }
  }

  /** Crea las cuentas demo (admin y cliente) si no hay usuarios guardados. */
  private inicializarUsuarios(): void {
    if (localStorage.getItem(USUARIOS_KEY)) return;

    const usuariosDefault: Usuario[] = [
      {
        nombreCompleto: 'Admin MesaMaestra',
        usuario: 'admin',
        email: 'admin@mesamaestra.cl',
        password: 'Admin123',
        fechaNacimiento: '1990-01-15',
        direccion: 'Av. Providencia 123, Santiago',
        rol: 'admin',
      },
      {
        nombreCompleto: 'Cliente Demo',
        usuario: 'cliente',
        email: 'cliente@mesamaestra.cl',
        password: 'Cliente123',
        fechaNacimiento: '2000-06-20',
        direccion: 'Calle Los Juegos 456, Valparaíso',
        rol: 'cliente',
      },
    ];

    localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuariosDefault));
  }

  obtenerUsuarios(): Usuario[] {
    try {
      return JSON.parse(localStorage.getItem(USUARIOS_KEY) || '[]');
    } catch {
      return [];
    }
  }

  guardarUsuarios(usuarios: Usuario[]): void {
    localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));
  }

  obtenerSesion(): Sesion | null {
    return this._sesion();
  }

  iniciarSesion(
    usuario: string,
    password: string,
  ): { exito: boolean; sesion?: Sesion; mensaje?: string } {
    const usuarios = this.obtenerUsuarios();
    const encontrado = usuarios.find(
      (u) => (u.usuario === usuario || u.email === usuario) && u.password === password,
    );

    if (!encontrado) {
      return { exito: false, mensaje: 'Usuario o contraseña incorrectos.' };
    }

    const sesion: Sesion = {
      usuario: encontrado.usuario,
      nombreCompleto: encontrado.nombreCompleto,
      email: encontrado.email,
      rol: encontrado.rol,
    };

    localStorage.setItem(SESION_KEY, JSON.stringify(sesion));
    this._sesion.set(sesion);
    return { exito: true, sesion };
  }

  cerrarSesion(): void {
    localStorage.removeItem(SESION_KEY);
    this._sesion.set(null);
    this._alCerrarSesion?.();
  }

  /** Permite al carrito refrescar la interfaz (p. ej. contador) al cerrar sesión. */
  registrarAlCerrarSesion(callback: () => void): void {
    this._alCerrarSesion = callback;
  }

  private _alCerrarSesion?: () => void;

  estaLogeado(): boolean {
    return this.obtenerSesion() !== null;
  }

  registrarUsuario(
    datos: Omit<Usuario, 'rol'>,
  ): { exito: boolean; mensaje?: string; campo?: 'usuario' | 'email' } {
    const usuarios = this.obtenerUsuarios();

    if (usuarios.some((u) => u.usuario === datos.usuario)) {
      return { exito: false, mensaje: 'Este nombre de usuario ya existe.', campo: 'usuario' };
    }

    if (usuarios.some((u) => u.email === datos.email)) {
      return { exito: false, mensaje: 'Este correo ya está registrado.', campo: 'email' };
    }

    usuarios.push({ ...datos, rol: 'cliente' });
    this.guardarUsuarios(usuarios);
    return { exito: true };
  }

  obtenerUsuarioPorSesion(): Usuario | null {
    const sesion = this.obtenerSesion();
    if (!sesion) return null;
    return this.obtenerUsuarios().find((u) => u.usuario === sesion.usuario) ?? null;
  }

  emailExiste(email: string): boolean {
    return this.obtenerUsuarios().some((u) => u.email === email.trim());
  }

  actualizarPerfil(datos: {
    nombreCompleto: string;
    email: string;
    fechaNacimiento: string;
    direccion: string;
    password?: string;
  }): boolean {
    const sesion = this.obtenerSesion();
    if (!sesion) return false;

    const usuarios = this.obtenerUsuarios();
    const index = usuarios.findIndex((u) => u.usuario === sesion.usuario);
    if (index === -1) return false;

    usuarios[index].nombreCompleto = datos.nombreCompleto.trim();
    usuarios[index].email = datos.email.trim();
    usuarios[index].fechaNacimiento = datos.fechaNacimiento;
    usuarios[index].direccion = datos.direccion.trim();
    if (datos.password) {
      usuarios[index].password = datos.password;
    }

    this.guardarUsuarios(usuarios);

    sesion.nombreCompleto = datos.nombreCompleto.trim();
    sesion.email = datos.email.trim();
    localStorage.setItem(SESION_KEY, JSON.stringify(sesion));
    this._sesion.set({ ...sesion });
    return true;
  }
}
