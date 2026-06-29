import { Service } from '@angular/core';
import { Categoria } from '../models/categoria.model';
import { Juego } from '../models/juego.model';
import { CATEGORIAS, JUEGOS } from '../datos/productos.data';

const CLAVE_OFERTAS_ADMIN = 'mesamaestra_ofertas';

/** Configuración de descuento guardada por el administrador. */
export interface ConfigOferta {
  activa: boolean;
  porcentaje: number;
}

/**
 * Servicio del catálogo de juegos y categorías.
 * Combina datos estáticos con ofertas configuradas desde el panel de administración.
 */
@Service()
export class Productos {
  readonly juegosBase = JUEGOS;

  obtenerCategorias(): Categoria[] {
    return CATEGORIAS;
  }

  obtenerCategoria(categoriaId: string): Categoria | undefined {
    return CATEGORIAS.find((c) => c.id === categoriaId);
  }

  obtenerIconoCategoria(categoriaId: string): string {
    return this.obtenerCategoria(categoriaId)?.icono ?? '🎲';
  }

  obtenerJuegos(): Juego[] {
    return JUEGOS.map((j) => this.resolverOfertaJuego(j));
  }

  obtenerJuegosOrdenados(): Juego[] {
    return this.obtenerJuegos().slice().sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  }

  obtenerJuegoPorId(juegoId: number): Juego | null {
    const juego = JUEGOS.find((j) => j.id === juegoId);
    return juego ? this.resolverOfertaJuego(juego) : null;
  }

  obtenerJuegosEnOferta(): Juego[] {
    return this.obtenerJuegos().filter((j) => j.descuento);
  }

  obtenerJuegosPorCategoria(categoriaId: string): Juego[] {
    return this.obtenerJuegos().filter((j) => j.categoria === categoriaId);
  }

  filtrarJuegos(juegos: Juego[], termino: string): Juego[] {
    const t = (termino || '').toLowerCase().trim();
    if (!t) return juegos;
    return juegos.filter((j) => {
      const cat = this.obtenerCategoria(j.categoria);
      const catNombre = cat ? cat.nombre : j.categoria;
      return (
        j.nombre.toLowerCase().includes(t) ||
        j.autor.toLowerCase().includes(t) ||
        j.marca.toLowerCase().includes(t) ||
        catNombre.toLowerCase().includes(t)
      );
    });
  }

  formatearPrecio(precio: number): string {
    return '$' + precio.toLocaleString('es-CL');
  }

  formatearJugadores(juego: Juego): string {
    if (juego.jugadoresMin === juego.jugadoresMax) {
      return String(juego.jugadoresMin);
    }
    return juego.jugadoresMin + '-' + juego.jugadoresMax;
  }

  calcularPrecioConDescuento(precio: number, porcentaje: number): number {
    return Math.round(precio * (1 - porcentaje / 100));
  }

  inferirPorcentajeDescuento(juego: Juego): number {
    if (!juego.descuento || !juego.precioOferta || !juego.precio) return 10;
    return Math.max(1, Math.min(90, Math.round((1 - juego.precioOferta / juego.precio) * 100)));
  }

  obtenerConfigOferta(juegoId: number): ConfigOferta {
    const override = this.obtenerOfertasGuardadas()[String(juegoId)];
    const juego = JUEGOS.find((j) => j.id === juegoId);
    if (!juego) return { activa: false, porcentaje: 10 };

    if (override) {
      return { activa: !!override.activa, porcentaje: override.porcentaje || 10 };
    }

    return { activa: !!juego.descuento, porcentaje: this.inferirPorcentajeDescuento(juego) };
  }

  guardarOfertaJuego(juegoId: number, config: { activa: boolean; porcentaje: number }): void {
    const ofertas = this.obtenerOfertasGuardadas();
    ofertas[String(juegoId)] = {
      activa: !!config.activa,
      porcentaje: Math.max(1, Math.min(90, parseInt(String(config.porcentaje), 10) || 10)),
    };
    localStorage.setItem(CLAVE_OFERTAS_ADMIN, JSON.stringify(ofertas));
  }

  private obtenerOfertasGuardadas(): Record<string, { activa: boolean; porcentaje: number }> {
    try {
      return JSON.parse(localStorage.getItem(CLAVE_OFERTAS_ADMIN) || '{}');
    } catch {
      return {};
    }
  }

  /** Aplica descuentos del administrador o los precios por defecto del catálogo estático. */
  private resolverOfertaJuego(juego: Juego): Juego {
    const copia = { ...juego };
    const override = this.obtenerOfertasGuardadas()[String(juego.id)];

    if (override) {
      if (override.activa) {
        const porcentaje = override.porcentaje || 10;
        copia.descuento = true;
        copia.porcentajeDescuento = porcentaje;
        copia.precioOferta = this.calcularPrecioConDescuento(copia.precio, porcentaje);
      } else {
        copia.descuento = false;
        delete copia.precioOferta;
        delete copia.porcentajeDescuento;
      }
      return copia;
    }

    if (copia.descuento && copia.precioOferta) {
      copia.porcentajeDescuento = this.inferirPorcentajeDescuento(copia);
    }

    return copia;
  }
}
