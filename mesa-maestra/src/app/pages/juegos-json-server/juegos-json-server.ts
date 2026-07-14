import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Juego } from '../../models/juego.model';
import { JuegosApi } from '../../servicios/juegos-api';

@Component({
  selector: 'app-juegos-json-server',
  imports: [FormsModule],
  templateUrl: './juegos-json-server.html',
  styleUrl: './juegos-json-server.css',
})
export class JuegosJsonServer implements OnInit {
  private api = inject(JuegosApi);

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
    this.api.obtenerJuegos().subscribe({
      next: (lista) => {
        this.juegos.set(lista);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set(
          'No se pudo conectar a json-server. Ejecuta: npm run api (puerto 3000) o docker compose up',
        );
        this.cargando.set(false);
      },
    });
  }

  abrirCrear(): void {
    this.formModo = 'crear';
    this.formVisible.set(true);
    this.mensaje.set('');
    this.juegoForm = {
      ...this.plantilla(),
      id: this.api.obtenerProximoId(this.juegos()),
    };
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

    if (this.formModo === 'crear') {
      this.api.existeJuego(this.juegoForm.id).subscribe({
        next: (existe) => {
          if (existe) {
            this.error.set('Ya existe un juego con id ' + this.juegoForm.id);
            this.guardando.set(false);
            return;
          }
          this.api.crearJuego(this.juegoForm).subscribe({
            next: () => this.finalizarGuardado('POST'),
            error: () => this.falloGuardado(),
          });
        },
      });
      return;
    }

    this.api.actualizarJuego(this.juegoForm).subscribe({
      next: () => this.finalizarGuardado('PUT'),
      error: () => this.falloGuardado(),
    });
  }

  eliminar(j: Juego): void {
    if (!confirm('¿Eliminar "' + j.nombre + '" de db.json?')) return;
    this.api.eliminarJuego(j.id).subscribe({
      next: () => {
        this.mensaje.set('Juego eliminado (DELETE → db.json).');
        this.cargar();
      },
      error: () => this.error.set('Error DELETE. ¿Está json-server en ejecución?'),
    });
  }

  formatearPrecio(p: number): string {
    return '$' + p.toLocaleString('es-CL');
  }

  private finalizarGuardado(metodo: string): void {
    this.mensaje.set('Juego guardado (' + metodo + ' → db.json).');
    this.guardando.set(false);
    this.formVisible.set(false);
    this.cargar();
  }

  private falloGuardado(): void {
    this.error.set('Error al guardar. ¿Está json-server en ejecución?');
    this.guardando.set(false);
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
