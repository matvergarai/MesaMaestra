import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Juego } from '../../models/juego.model';
import { JuegosGithub } from '../../servicios/juegos-github';

@Component({
  selector: 'app-juegos-storage',
  imports: [FormsModule],
  templateUrl: './juegos-storage.html',
  styleUrl: './juegos-storage.css',
})
export class JuegosStorage implements OnInit {
  private github = inject(JuegosGithub);

  juegos = signal<Juego[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);
  mensaje = signal('');
  formVisible = signal(false);
  formModo: 'crear' | 'editar' = 'crear';
  guardando = signal(false);

  juegoForm: Juego = this.plantilla();

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.github.obtenerJuegos().subscribe({
      next: (lista) => {
        this.juegos.set(lista);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo leer el JSON remoto. Verifica githubPagesJuegosUrl en environment.ts');
        this.cargando.set(false);
      },
    });
  }

  resetearRemoto(): void {
    this.github.resetearDesdeRemoto().subscribe({
      next: (lista) => {
        this.juegos.set(lista);
        this.mensaje.set('Datos restablecidos desde el JSON remoto (GET).');
      },
      error: () => this.error.set('Error al restablecer desde remoto.'),
    });
  }

  abrirCrear(): void {
    this.formModo = 'crear';
    this.formVisible.set(true);
    this.mensaje.set('');
    this.github.obtenerProximoId().subscribe((id) => {
      this.juegoForm = { ...this.plantilla(), id };
    });
  }

  abrirEditar(j: Juego): void {
    this.formModo = 'editar';
    this.juegoForm = { ...j };
    this.formVisible.set(true);
    this.mensaje.set('');
  }

  cerrarForm(): void {
    this.formVisible.set(false);
  }

  guardar(): void {
    this.guardando.set(true);
    this.error.set(null);
    const op =
      this.formModo === 'crear'
        ? this.github.crearJuego(this.juegoForm)
        : this.github.actualizarJuego(this.juegoForm);

    op.subscribe({
      next: () => {
        this.mensaje.set(
          this.formModo === 'crear'
            ? 'Juego creado (POST simulado → localStorage).'
            : 'Juego actualizado (PUT simulado → localStorage).',
        );
        this.guardando.set(false);
        this.formVisible.set(false);
        this.cargar();
      },
      error: (e: Error) => {
        this.error.set(e.message || 'Error al guardar.');
        this.guardando.set(false);
      },
    });
  }

  eliminar(j: Juego): void {
    if (!confirm('¿Eliminar "' + j.nombre + '" del storage local?')) return;
    this.github.eliminarJuego(j.id).subscribe({
      next: () => {
        this.mensaje.set('Juego eliminado (DELETE simulado → localStorage).');
        this.cargar();
      },
      error: (e: Error) => this.error.set(e.message || 'Error al eliminar.'),
    });
  }

  formatearPrecio(p: number): string {
    return '$' + p.toLocaleString('es-CL');
  }

  private plantilla(): Juego {
    return {
      id: 1,
      nombre: 'Nuevo juego',
      autor: 'Autor',
      anio: 2024,
      marca: 'Editorial',
      categoria: 'familiar',
      descripcion: 'Descripción.',
      recomendacion: 'Recomendación.',
      precio: 19990,
      descuento: false,
      imagen: 'img/juegos/dobble.webp',
      jugadoresMin: 2,
      jugadoresMax: 4,
      edadMin: 8,
      duracion: '30 min',
      stock: 10,
    };
  }
}
