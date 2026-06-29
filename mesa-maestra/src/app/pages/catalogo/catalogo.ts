import { Component, ElementRef, inject, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardJuego } from '../../componentes/card-juego/card-juego';
import { Juego } from '../../models/juego.model';
import { JuegoNubeService } from '../../servicios/juego-nube';
import { Productos } from '../../servicios/productos';

@Component({
  selector: 'app-catalogo',
  imports: [FormsModule, CardJuego],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
})
/** Catálogo con búsqueda, filtro por categoría y desplazamiento por filas de tarjetas. */
export class Catalogo implements OnInit, OnDestroy {
  private productos = inject(Productos);
  private nube = inject(JuegoNubeService);

  scrollEl = viewChild<ElementRef<HTMLElement>>('scrollJuegos');

  busqueda = signal('');
  categoriaFiltro = signal('');
  categoriaTexto = signal('Todas las categorías');
  dropdownAbierto = signal(false);
  juegosFiltrados = signal<Juego[]>([]);
  primeraCarga = true;
  scrollArribaDisabled = signal(true);
  scrollAbajoDisabled = signal(true);
  controlesOcultos = signal(true);

  categorias = this.productos.obtenerCategorias();

  opcionesCategoria = [
    { value: '', label: 'Todas las categorías' },
    ...this.categorias.map((c) => ({ value: c.id, label: c.icono + ' ' + c.nombre })),
  ];

  /** Retraso de 200 ms antes de filtrar al escribir en el buscador. */
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    document.body.classList.add('pagina-catalogo');
    this.renderizar(true);
  }

  ngOnDestroy(): void {
    document.body.classList.remove('pagina-catalogo');
    this.nube.cerrar();
  }

  onBusquedaInput(valor: string): void {
    this.busqueda.set(valor);
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => this.renderizar(false), 200);
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.dropdownAbierto.update((v) => !v);
  }

  cerrarDropdown(): void {
    this.dropdownAbierto.set(false);
  }

  seleccionarCategoria(valor: string, etiqueta: string): void {
    this.categoriaFiltro.set(valor);
    this.categoriaTexto.set(etiqueta);
    this.cerrarDropdown();
    this.renderizar(true);
  }

  renderizar(conAnimacion: boolean): void {
    this.nube.cerrar();
    let juegos = this.productos.obtenerJuegos();
    const cat = this.categoriaFiltro();
    const busq = this.busqueda().toLowerCase();

    if (cat) juegos = juegos.filter((j) => j.categoria === cat);
    if (busq) juegos = juegos.filter((j) => j.nombre.toLowerCase().includes(busq));

    this._animarProxima = conAnimacion !== false && (this.primeraCarga || conAnimacion === true);
    this.juegosFiltrados.set(juegos);
    this.primeraCarga = false;

    const el = this.scrollEl()?.nativeElement;
    if (el) {
      el.scrollTop = 0;
      setTimeout(() => this.actualizarControlesScroll(), 0);
    }
  }

  /** Indica si la próxima renderización debe animar las tarjetas. */
  private _animarProxima = true;

  get animarCards(): boolean {
    return this._animarProxima;
  }

  actualizarControlesScroll(): void {
    const el = this.scrollEl()?.nativeElement;
    if (!el) return;

    const conResultados = this.juegosFiltrados().length > 0;
    const maxScroll = el.scrollHeight - el.clientHeight;
    const necesitaScroll = conResultados && maxScroll > 4;

    this.controlesOcultos.set(!necesitaScroll);
    this.scrollArribaDisabled.set(!conResultados || el.scrollTop <= 0);
    this.scrollAbajoDisabled.set(!conResultados || el.scrollTop >= maxScroll - 1);
  }

  /** Desplaza el contenedor a la fila anterior o siguiente de productos. */
  desplazarJuegos(direccion: number): void {
    const el = this.scrollEl()?.nativeElement;
    if (!el) return;

    const cards = Array.from(el.querySelectorAll('#catalogo-juegos > app-card-juego')) as HTMLElement[];
    const filas = new Map<number, HTMLElement>();
    cards.forEach((card) => {
      if (!filas.has(card.offsetTop)) filas.set(card.offsetTop, card);
    });
    const tops = Array.from(filas.keys()).sort((a, b) => a - b);
    const scrollActual = el.scrollTop;
    const margen = 8;

    if (direccion > 0) {
      const siguiente = tops.find((top) => top > scrollActual + margen);
      if (siguiente !== undefined) el.scrollTo({ top: siguiente, behavior: 'auto' });
    } else {
      let anterior: number | null = null;
      tops.forEach((top) => {
        if (top < scrollActual - margen) anterior = top;
      });
      if (anterior !== null) el.scrollTo({ top: anterior, behavior: 'auto' });
    }
  }
}
