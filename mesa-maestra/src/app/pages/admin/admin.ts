import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Juego } from '../../models/juego.model';
import { Usuario } from '../../models/usuario.model';
import { Auth } from '../../servicios/auth';
import { Productos } from '../../servicios/productos';

@Component({
  selector: 'app-admin',
  imports: [FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
/** Panel de administración: inventario, usuarios y gestión de ofertas. */
export class Admin implements OnInit {
  private auth = inject(Auth);
  private productos = inject(Productos);

  usuarios: Usuario[] = [];
  juegosInventario = signal<Juego[]>([]);
  juegosPicker = signal<Juego[]>([]);
  juegosOfertas = signal<Juego[]>([]);

  totalProductosTexto = signal('0');
  totalOfertasTexto = signal('0');

  buscarInventario = '';
  buscarPicker = '';
  buscarOfertas = '';

  pickerVisible = signal(false);
  editorVisible = signal(false);
  inventarioResaltado = signal(false);
  mensajeExitoOferta = signal('');

  juegoFormVisible = signal(false);
  juegoFormModo: 'crear' | 'editar' = 'crear';
  juegoForm: Juego = this.nuevoJuegoPlantilla();
  mensajeCrud = signal('');
  errorCrud = signal('');
  guardandoCrud = signal(false);

  juegoOfertaSeleccionado: number | null = null;
  ofertaJuegoNombre = '';
  ofertaActivaSi = true;
  ofertaPorcentaje = 10;
  previewHtml = signal('');

  get ofertaActiva(): boolean {
    return this.ofertaActivaSi;
  }

  setOfertaActiva(activa: boolean): void {
    this.ofertaActivaSi = activa;
    this.onOfertaActivaChange();
  }

  ngOnInit(): void {
    this.usuarios = this.auth.obtenerUsuarios();
    this.productos.cargarCatalogo().subscribe({
      next: () => {
        this.renderizarInventario('');
        this.renderizarTablaOfertas('');
      },
      error: () => {
        this.errorCrud.set('No se pudo cargar el inventario desde json-server.');
      },
    });
  }

  categoriasDisponibles() {
    return this.productos.obtenerCategorias();
  }

  private nuevoJuegoPlantilla(): Juego {
    return {
      id: this.productos.obtenerProximoId(),
      nombre: 'Nuevo juego',
      autor: 'Autor demo',
      anio: 2024,
      marca: 'Editorial demo',
      categoria: 'familiar',
      descripcion: 'Descripción del juego de mesa.',
      recomendacion: 'Ideal para partidas en familia.',
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

  abrirFormularioCrear(): void {
    this.cerrarEditor();
    this.juegoFormModo = 'crear';
    this.juegoForm = this.nuevoJuegoPlantilla();
    this.juegoForm.id = this.productos.obtenerProximoId();
    this.mensajeCrud.set('');
    this.errorCrud.set('');
    this.juegoFormVisible.set(true);
  }

  abrirFormularioEditar(juego: Juego): void {
    this.cerrarEditor();
    this.juegoFormModo = 'editar';
    this.juegoForm = { ...this.productos.juegosBase.find((j) => j.id === juego.id) ?? juego };
    this.mensajeCrud.set('');
    this.errorCrud.set('');
    this.juegoFormVisible.set(true);
  }

  cerrarFormularioJuego(): void {
    this.juegoFormVisible.set(false);
    this.mensajeCrud.set('');
    this.errorCrud.set('');
  }

  guardarFormularioJuego(): void {
    const juego = { ...this.juegoForm };
    if (!juego.nombre.trim()) {
      this.errorCrud.set('El nombre del juego es obligatorio.');
      return;
    }

    this.guardandoCrud.set(true);
    this.errorCrud.set('');

    if (this.juegoFormModo === 'crear') {
      this.productos.existeJuego(juego.id).subscribe({
        next: (existe) => {
          if (existe) {
            this.errorCrud.set('Ya existe un juego con el id ' + juego.id + '.');
            this.guardandoCrud.set(false);
            return;
          }
          this.productos.crearJuego(juego).subscribe({
            next: () => {
              this.mensajeCrud.set('Juego creado correctamente (POST).');
              this.guardandoCrud.set(false);
              this.renderizarInventario(this.buscarInventario);
              this.renderizarTablaOfertas();
            },
            error: () => {
              this.errorCrud.set('Error al crear el juego en json-server.');
              this.guardandoCrud.set(false);
            },
          });
        },
        error: () => {
          this.errorCrud.set('No se pudo validar el id del juego.');
          this.guardandoCrud.set(false);
        },
      });
      return;
    }

    this.productos.actualizarJuego(juego).subscribe({
      next: () => {
        this.mensajeCrud.set('Juego actualizado correctamente (PUT).');
        this.guardandoCrud.set(false);
        this.renderizarInventario(this.buscarInventario);
        this.renderizarTablaOfertas();
      },
      error: () => {
        this.errorCrud.set('Error al actualizar el juego en json-server.');
        this.guardandoCrud.set(false);
      },
    });
  }

  eliminarJuego(juego: Juego): void {
    const confirmar = confirm('¿Eliminar "' + juego.nombre + '" del inventario?');
    if (!confirmar) return;

    this.productos.eliminarJuego(juego.id).subscribe({
      next: () => {
        this.mensajeCrud.set('Juego eliminado correctamente (DELETE).');
        this.renderizarInventario(this.buscarInventario);
        this.renderizarTablaOfertas();
      },
      error: () => {
        this.errorCrud.set('Error al eliminar el juego en json-server.');
      },
    });
  }

  formatearPrecio(precio: number): string {
    return this.productos.formatearPrecio(precio);
  }

  nombreCategoria(juego: Juego): string {
    return this.productos.obtenerCategoria(juego.categoria)?.nombre ?? juego.categoria;
  }

  precioHtml(j: Juego): string {
    if (j.descuento && j.precioOferta) {
      return `<div class="admin-precio-celda"><span class="admin-precio-normal">${this.formatearPrecio(j.precio)}</span><span class="admin-precio-oferta">${this.formatearPrecio(j.precioOferta)}</span></div>`;
    }
    return `<span class="admin-precio-unico">${this.formatearPrecio(j.precio)}</span>`;
  }

  renderizarInventario(busqueda: string): void {
    this.buscarInventario = busqueda;
    const filtrados = this.productos.filtrarJuegos(this.productos.obtenerJuegosOrdenados(), busqueda);
    this.juegosInventario.set(filtrados);
    this.totalProductosTexto.set(
      busqueda.trim()
        ? filtrados.length + ' de ' + this.productos.juegosBase.length
        : String(this.productos.juegosBase.length),
    );
  }

  renderizarPicker(busqueda: string): void {
    this.buscarPicker = busqueda;
    const filtrados = this.productos.filtrarJuegos(this.productos.obtenerJuegosOrdenados(), busqueda);
    this.juegosPicker.set(filtrados);
  }

  renderizarTablaOfertas(busqueda?: string): void {
    if (busqueda !== undefined) this.buscarOfertas = busqueda;
    const enOferta = this.productos
      .obtenerJuegosEnOferta()
      .slice()
      .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
    const filtrados = this.productos.filtrarJuegos(enOferta, this.buscarOfertas);

    this.juegosOfertas.set(filtrados);
    this.totalOfertasTexto.set(
      this.buscarOfertas.trim()
        ? filtrados.length + ' de ' + enOferta.length
        : String(enOferta.length),
    );
  }

  abrirPicker(): void {
    this.editorVisible.set(false);
    this.mensajeExitoOferta.set('');
    this.pickerVisible.set(true);
    this.inventarioResaltado.set(true);
    this.buscarPicker = '';
    this.renderizarPicker('');
  }

  cerrarPicker(): void {
    this.pickerVisible.set(false);
    this.inventarioResaltado.set(false);
  }

  cerrarEditor(): void {
    this.juegoOfertaSeleccionado = null;
    this.editorVisible.set(false);
    this.mensajeExitoOferta.set('');
    this.cerrarPicker();
    this.renderizarInventario(this.buscarInventario);
    this.renderizarTablaOfertas();
  }

  abrirEditorOferta(juegoId: number, preferirNuevaOferta: boolean): void {
    const juego = this.productos.juegosBase.find((j) => j.id === juegoId);
    if (!juego) return;

    this.juegoOfertaSeleccionado = juegoId;
    const config = this.productos.obtenerConfigOferta(juegoId);

    this.cerrarPicker();
    this.ofertaJuegoNombre = '"' + juego.nombre + '"';
    this.editorVisible.set(true);
    this.mensajeExitoOferta.set('');

    this.ofertaActivaSi = preferirNuevaOferta ? true : config.activa;
    this.ofertaPorcentaje = preferirNuevaOferta && !config.activa ? 10 : config.porcentaje;

    this.actualizarPreviewOferta();
    this.renderizarInventario(this.buscarInventario);
    this.renderizarTablaOfertas();
  }

  actualizarPreviewOferta(): void {
    if (!this.juegoOfertaSeleccionado) return;
    const juegoBase = this.productos.juegosBase.find((j) => j.id === this.juegoOfertaSeleccionado);
    if (!juegoBase) return;

    if (!this.ofertaActiva) {
      this.previewHtml.set(
        `<p class="admin-oferta-preview-texto">Precio en tienda: <strong>${this.formatearPrecio(juegoBase.precio)}</strong> <span class="admin-oferta-preview-nota">(sin descuento)</span></p>`,
      );
      return;
    }

    const pct = Math.max(1, Math.min(90, this.ofertaPorcentaje || 10));
    const precioFinal = this.productos.calcularPrecioConDescuento(juegoBase.precio, pct);
    this.previewHtml.set(
      `<p class="admin-oferta-preview-texto"><span class="admin-precio-normal">${this.formatearPrecio(juegoBase.precio)}</span> → <strong class="admin-precio-oferta">${this.formatearPrecio(precioFinal)}</strong> <span class="admin-oferta-preview-pct">(-${pct}%)</span></p>`,
    );
  }

  onOfertaActivaChange(): void {
    this.actualizarPreviewOferta();
  }

  guardarOferta(): void {
    if (!this.juegoOfertaSeleccionado) return;

    this.productos.guardarOfertaJuego(this.juegoOfertaSeleccionado, {
      activa: this.ofertaActiva,
      porcentaje: this.ofertaPorcentaje,
    });

    this.mensajeExitoOferta.set('Oferta guardada correctamente.');
    this.renderizarInventario(this.buscarInventario);
    this.renderizarTablaOfertas();
    this.actualizarPreviewOferta();
  }

  filaSeleccionada(juegoId: number): boolean {
    return this.juegoOfertaSeleccionado === juegoId;
  }

  porcentajeOferta(j: Juego): number {
    return j.porcentajeDescuento ?? this.productos.inferirPorcentajeDescuento(j);
  }
}
