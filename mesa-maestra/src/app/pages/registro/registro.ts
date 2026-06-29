import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../servicios/auth';
import {
  edadMinima,
  emailValido,
  mensajePasswordDebil,
  passwordFuerte,
  passwordsCoinciden,
} from '../../utilidades/validadores';

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
/** Registro de nuevos clientes con validaciones reactivas (contraseña, edad, correo). */
export class Registro {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);

  mensajeExito = signal('');
  mostrarPassword = signal(false);
  mostrarConfirmar = signal(false);

  /** Valida al salir de cada campo (validación al perder el foco). */
  formulario = this.fb.group(
    {
      nombreCompleto: ['', Validators.required],
      usuario: ['', Validators.required],
      email: ['', [Validators.required, emailValido()]],
      fechaNacimiento: ['', [Validators.required, edadMinima(13)]],
      password: ['', [Validators.required, passwordFuerte()]],
      confirmarPassword: ['', [Validators.required, passwordsCoinciden('password')]],
      direccion: [''],
    },
    { updateOn: 'blur' },
  );

  constructor() {
    this.formulario.get('password')?.valueChanges.subscribe(() => {
      this.formulario.get('confirmarPassword')?.updateValueAndValidity();
    });
  }

  campoInvalido(nombre: string): boolean {
    const c = this.formulario.get(nombre);
    if (!c?.touched) return false;

    if (nombre === 'confirmarPassword') {
      if (c.errors?.['required'] || c.errors?.['noCoincide']) return true;
      // Si coinciden pero la contraseña principal no cumple las reglas, estado neutro.
      if (this.formulario.get('password')?.invalid) return false;
    }

    return !!c.invalid;
  }

  campoValido(nombre: string): boolean {
    const c = this.formulario.get(nombre);
    if (!c?.valid || !c.touched) return false;

    if (nombre === 'confirmarPassword') {
      return !!this.formulario.get('password')?.valid;
    }

    return true;
  }

  mensajeError(nombre: string): string {
    const c = this.formulario.get(nombre);
    if (!c?.errors) return '';

    if (c.errors['required']) {
      const labels: Record<string, string> = {
        nombreCompleto: 'Nombre completo',
        usuario: 'Nombre de usuario',
        email: 'Correo electrónico',
        fechaNacimiento: 'Fecha de nacimiento',
        password: 'Contraseña',
        confirmarPassword: 'Confirmar contraseña',
      };
      return (labels[nombre] ?? 'Este campo') + ' es obligatorio.';
    }
    if (c.errors['emailInvalido']) return 'Ingrese un correo electrónico válido.';
    if (c.errors['passwordDebil']) return mensajePasswordDebil(c.errors['passwordDebil']);
    if (c.errors['noCoincide']) return 'Las contraseñas no coinciden.';
    if (c.errors['fechaInvalida']) return 'Ingrese una fecha de nacimiento válida.';
    if (c.errors['edadMinima']) return 'Debes tener al menos 13 años.';
    return '';
  }

  alternarPassword(): void {
    this.mostrarPassword.update((v) => !v);
  }

  alternarConfirmar(): void {
    this.mostrarConfirmar.update((v) => !v);
  }

  limpiarFormulario(): void {
    this.formulario.reset();
    this.mensajeExito.set('');
    this.mostrarPassword.set(false);
    this.mostrarConfirmar.set(false);
  }

  onSubmit(): void {
    this.mensajeExito.set('');

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const datos = this.formulario.getRawValue();
    const resultado = this.auth.registrarUsuario({
      nombreCompleto: datos.nombreCompleto!.trim(),
      usuario: datos.usuario!.trim(),
      email: datos.email!.trim(),
      password: datos.password!,
      fechaNacimiento: datos.fechaNacimiento!,
      direccion: datos.direccion?.trim() ?? '',
    });

    if (!resultado.exito) {
      const campo = resultado.campo;
      if (campo) {
        this.formulario.get(campo)?.setErrors({ duplicado: resultado.mensaje });
        this.formulario.get(campo)?.markAsTouched();
      }
      return;
    }

    this.mensajeExito.set('Registro exitoso. Redirigiendo al inicio de sesión...');
    setTimeout(() => this.router.navigate(['/login']), 2000);
  }

  mensajeDuplicado(nombre: string): string {
    const c = this.formulario.get(nombre);
    return c?.errors?.['duplicado'] ?? '';
  }
}
