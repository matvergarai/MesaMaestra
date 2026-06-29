/** Roles disponibles en la aplicación. */
export type RolUsuario = 'admin' | 'cliente';

/** Usuario registrado con credenciales completas (almacenado en localStorage). */
export interface Usuario {  nombreCompleto: string;
  usuario: string;
  email: string;
  password: string;
  fechaNacimiento: string;
  direccion: string;
  rol: RolUsuario;
}

/** Datos mínimos de la sesión activa (sin contraseña). */
export interface Sesion {  usuario: string;
  nombreCompleto: string;
  email: string;
  rol: RolUsuario;
}
