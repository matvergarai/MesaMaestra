/**
 * Validadores personalizados para formularios reactivos.
 * Equivalente a la lógica de js/validaciones.js del proyecto original.
 */
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Expresiones regulares reutilizadas en validaciones de correo y contraseña. */
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGEX_ESPECIAL = /[!@#$%^&*(),.?":{}|<>]/;

/** Devuelve la lista de reglas de contraseña que aún no se cumplen. */
export function obtenerErroresPassword(password: string): string[] {  const errores: string[] = [];

  if (password.length < 6 || password.length > 18) {
    errores.push('entre 6 y 18 caracteres');
  }
  if (!/[0-9]/.test(password)) {
    errores.push('al menos un número');
  }
  if (!/[A-Z]/.test(password)) {
    errores.push('al menos una mayúscula');
  }
  if (!/[a-z]/.test(password)) {
    errores.push('al menos una minúscula');
  }
  if (!REGEX_ESPECIAL.test(password)) {
    errores.push('al menos un carácter especial');
  }

  return errores;
}

/** Valida formato de correo electrónico. */
export function emailValido(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = (control.value ?? '').trim();
    if (!valor) return null;
    return REGEX_EMAIL.test(valor) ? null : { emailInvalido: true };
  };
}

/** Exige contraseña con las 5 reglas definidas en obtenerErroresPassword. */
export function passwordFuerte(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value ?? '';
    if (!valor) return null;
    const errores = obtenerErroresPassword(valor);
    return errores.length > 0 ? { passwordDebil: errores } : null;
  };
}

/** Compara la confirmación con el campo de contraseña del mismo grupo de formulario. */
export function passwordsCoinciden(campoPassword: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.parent) return null;
    const password = control.parent.get(campoPassword)?.value ?? '';
    const confirmar = control.value ?? '';
    if (!confirmar) return null;
    return password === confirmar ? null : { noCoincide: true };
  };
}

/** Rechaza fechas de nacimiento de menores de edad mínima (p. ej. 13 años). */
export function edadMinima(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;
    if (!valor) return null;

    const fecha = new Date(valor);
    if (Number.isNaN(fecha.getTime())) {
      return { fechaInvalida: true };
    }

    const hoy = new Date();
    let edad = hoy.getFullYear() - fecha.getFullYear();
    const mes = hoy.getMonth() - fecha.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) {
      edad--;
    }

    return edad < min ? { edadMinima: { min, edad } } : null;
  };
}

export function mensajePasswordDebil(errores: string[]): string {
  return 'La contraseña debe tener ' + errores.join(', ') + '.';
}
