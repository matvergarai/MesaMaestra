import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Auth } from '../../servicios/auth';
import { emailValido } from '../../utilidades/validadores';

@Component({
  selector: 'app-recuperar',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './recuperar.html',
  styleUrl: './recuperar.css',
})
/** Recuperación simulada de contraseña por correo electrónico. */
export class Recuperar {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);

  mensaje = signal('');
  mensajeEsExito = signal(false);

  formulario = this.fb.group({
    email: ['', [Validators.required, emailValido()]],
  });

  campoInvalido(): boolean {
    const c = this.formulario.get('email');
    return !!(c?.invalid && c.touched);
  }

  onSubmit(): void {
    this.mensaje.set('');
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const email = this.formulario.get('email')!.value!.trim();
    const existe = this.auth.emailExiste(email);

    if (existe) {
      this.mensaje.set('Se ha enviado un enlace de recuperación a ' + email + ' (simulado).');
      this.mensajeEsExito.set(true);
    } else {
      this.mensaje.set('No existe una cuenta con ese correo electrónico.');
      this.mensajeEsExito.set(false);
    }
  }
}
