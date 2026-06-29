import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../servicios/auth';
import {
  edadMinima,
  emailValido,
  mensajePasswordDebil,
  passwordFuerte,
  passwordsCoinciden,
} from '../../utilidades/validadores';

@Component({
  selector: 'app-perfil',
  imports: [ReactiveFormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
/** Edición del perfil del usuario logueado (requiere protección authGuard). */
export class Perfil implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);

  mensajeExito = signal('');
  mostrarPassword = signal(false);
  mostrarConfirmar = signal(false);

  formulario = this.fb.group({
    nombreCompleto: ['', Validators.required],
    email: ['', [Validators.required, emailValido()]],
    fechaNacimiento: ['', [Validators.required, edadMinima(13)]],
    direccion: [''],
    password: ['', passwordFuerte()],
    confirmarPassword: ['', passwordsCoinciden('password')],
  });

  usuarioDisplay = '';

  ngOnInit(): void {
    const usuario = this.auth.obtenerUsuarioPorSesion();
    if (!usuario) return;

    this.usuarioDisplay = usuario.usuario;
    this.formulario.patchValue({
      nombreCompleto: usuario.nombreCompleto,
      email: usuario.email,
      fechaNacimiento: usuario.fechaNacimiento,
      direccion: usuario.direccion || '',
    });

    this.formulario.get('password')?.valueChanges.subscribe(() => {
      this.formulario.get('confirmarPassword')?.updateValueAndValidity();
    });
  }

  campoInvalido(nombre: string): boolean {
    const c = this.formulario.get(nombre);
    if (!c?.touched) return false;

    if (nombre === 'confirmarPassword') {
      if (c.errors?.['required'] || c.errors?.['noCoincide']) return true;
      if (this.formulario.get('password')?.invalid) return false;
    }

    return !!c.invalid;
  }

  campoValido(nombre: string): boolean {
    const c = this.formulario.get(nombre);
    if (!c?.valid || !c.touched || !c.value) return false;

    if (nombre === 'confirmarPassword') {
      return !!this.formulario.get('password')?.valid;
    }

    return true;
  }

  mensajeError(nombre: string): string {
    const c = this.formulario.get(nombre);
    if (!c?.errors || !c.touched) return '';
    if (c.errors['required']) return 'Este campo es obligatorio.';
    if (c.errors['emailInvalido']) return 'Ingrese un correo electrónico válido.';
    if (c.errors['passwordDebil']) return mensajePasswordDebil(c.errors['passwordDebil']);
    if (c.errors['noCoincide']) return 'Las contraseñas no coinciden.';
    if (c.errors['edadMinima']) return 'Debes tener al menos 13 años.';
    return '';
  }

  alternarPassword(): void {
    this.mostrarPassword.update((v) => !v);
  }

  alternarConfirmar(): void {
    this.mostrarConfirmar.update((v) => !v);
  }

  onSubmit(): void {
    this.mensajeExito.set('');
    const pwd = this.formulario.get('password')?.value;
    const confirmar = this.formulario.get('confirmarPassword')?.value;

    // La contraseña solo es obligatoria si el usuario desea cambiarla.
    if (pwd || confirmar) {
      this.formulario.get('password')?.setValidators([Validators.required, passwordFuerte()]);
      this.formulario.get('confirmarPassword')?.setValidators([Validators.required, passwordsCoinciden('password')]);
    } else {
      this.formulario.get('password')?.setValidators([passwordFuerte()]);
      this.formulario.get('confirmarPassword')?.setValidators([passwordsCoinciden('password')]);
    }
    this.formulario.get('password')?.updateValueAndValidity();
    this.formulario.get('confirmarPassword')?.updateValueAndValidity();

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const datos = this.formulario.getRawValue();
    const ok = this.auth.actualizarPerfil({
      nombreCompleto: datos.nombreCompleto!,
      email: datos.email!,
      fechaNacimiento: datos.fechaNacimiento!,
      direccion: datos.direccion ?? '',
      password: pwd || undefined,
    });

    if (ok) {
      this.mensajeExito.set('Perfil actualizado correctamente.');
      this.formulario.patchValue({ password: '', confirmarPassword: '' });
    }
  }
}
