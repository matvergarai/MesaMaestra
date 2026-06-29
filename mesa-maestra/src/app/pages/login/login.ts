import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../servicios/auth';
import { Carrito } from '../../servicios/carrito';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
/** Formulario reactivo de inicio de sesión con opción «recordar usuario» (enlace bidireccional ngModel). */
export class Login implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private carrito = inject(Carrito);
  private router = inject(Router);

  mensajeError = signal('');
  mostrarPassword = signal(false);
  /** Casilla independiente del formulario reactivo; usa enlace bidireccional [(ngModel)] en la plantilla. */
  recordarUsuario = false;

  formulario = this.fb.group({
    usuario: ['', Validators.required],
    password: ['', Validators.required],
  });

  ngOnInit(): void {
    const recordado = localStorage.getItem('mesamaestra_usuario_recordado');
    if (recordado) {
      this.formulario.patchValue({ usuario: recordado });
      this.recordarUsuario = true;
    }
  }

  get usuarioInvalido(): boolean {
    const c = this.formulario.get('usuario');
    return !!(c?.invalid && c.touched);
  }

  get passwordInvalido(): boolean {
    const c = this.formulario.get('password');
    return !!(c?.invalid && c.touched);
  }

  alternarPassword(): void {
    this.mostrarPassword.update((v) => !v);
  }

  onSubmit(): void {
    this.mensajeError.set('');

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const { usuario, password } = this.formulario.getRawValue();
    const resultado = this.auth.iniciarSesion(usuario!.trim(), password!);

    if (!resultado.exito || !resultado.sesion) {
      this.mensajeError.set(resultado.mensaje ?? 'Error al iniciar sesión.');
      return;
    }

    if (this.recordarUsuario) {
      localStorage.setItem('mesamaestra_usuario_recordado', usuario!.trim());
    } else {
      localStorage.removeItem('mesamaestra_usuario_recordado');
    }

    this.carrito.sincronizarAlIniciarSesion(resultado.sesion.usuario);

    if (resultado.sesion.rol === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/']);
    }
  }
}
