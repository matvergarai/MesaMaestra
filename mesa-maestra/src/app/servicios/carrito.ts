import { inject, Service, signal } from '@angular/core';
import { ItemCarrito } from '../models/item-carrito.model';
import { Juego } from '../models/juego.model';
import { Auth } from './auth';

const CARRITO_PREFIX = 'mesamaestra_carrito_';
const CARRO_INVITADO_KEY = 'mesamaestra_carrito_invitado';
/** Clave del carrito de la versión HTML/JavaScript original. */
const CARRO_LEGACY_KEY = 'carrito';

/**
 * Servicio del carrito de compras.
 * Mantiene un carrito separado por usuario autenticado o invitado.
 */
@Service()
export class Carrito {
  private auth = inject(Auth);
  private _version = signal(0);
  readonly version = this._version.asReadonly();

  constructor() {
    this.migrarCarritoLegacy();
    this.auth.registrarAlCerrarSesion(() => this.notificarCambio());
  }

  private notificarCambio(): void {
    this._version.update((v) => v + 1);
  }

  private claveCarrito(): string {
    const sesion = this.auth.obtenerSesion();
    return sesion ? CARRITO_PREFIX + sesion.usuario : CARRO_INVITADO_KEY;
  }

  private leerCarritoDeClave(clave: string): ItemCarrito[] {
    try {
      const datos = JSON.parse(localStorage.getItem(clave) || '[]');
      return Array.isArray(datos) ? datos : [];
    } catch {
      return [];
    }
  }

  private guardarCarritoEnClave(clave: string, carrito: ItemCarrito[]): void {
    localStorage.setItem(clave, JSON.stringify(carrito));
  }

  private fusionarCarritos(destino: ItemCarrito[], origen: ItemCarrito[]): ItemCarrito[] {
    origen.forEach((item) => {
      const existente = destino.find((i) => i.id === item.id);
      if (existente) {
        existente.cantidad += item.cantidad || 1;
      } else {
        destino.push({ ...item, cantidad: item.cantidad || 1 });
      }
    });
    return destino;
  }

  /** Importa el carrito antiguo (clave «carrito») al formato actual por usuario. */
  migrarCarritoLegacy(): void {
    const legacy = localStorage.getItem(CARRO_LEGACY_KEY);
    if (!legacy) return;

    try {
      const items = JSON.parse(legacy);
      if (!Array.isArray(items) || items.length === 0) {
        localStorage.removeItem(CARRO_LEGACY_KEY);
        return;
      }
      const clave = this.claveCarrito();
      const actual = this.leerCarritoDeClave(clave);
      this.fusionarCarritos(actual, items);
      this.guardarCarritoEnClave(clave, actual);
      localStorage.removeItem(CARRO_LEGACY_KEY);
      this.notificarCambio();
    } catch {
      localStorage.removeItem(CARRO_LEGACY_KEY);
    }
  }

  /** Fusiona el carrito de invitado con el del usuario al iniciar sesión. */
  sincronizarAlIniciarSesion(usuario: string): void {
    this.migrarCarritoLegacy();
    const invitado = this.leerCarritoDeClave(CARRO_INVITADO_KEY);
    const claveUsuario = CARRITO_PREFIX + usuario;
    const carritoUsuario = this.leerCarritoDeClave(claveUsuario);

    if (invitado.length > 0) {
      this.fusionarCarritos(carritoUsuario, invitado);
      this.guardarCarritoEnClave(claveUsuario, carritoUsuario);
      this.guardarCarritoEnClave(CARRO_INVITADO_KEY, []);
      this.notificarCambio();
    }
  }

  obtenerCarrito(): ItemCarrito[] {
    this.migrarCarritoLegacy();
    return this.leerCarritoDeClave(this.claveCarrito());
  }

  guardarCarrito(carrito: ItemCarrito[]): void {
    this.guardarCarritoEnClave(this.claveCarrito(), carrito);
    this.notificarCambio();
  }

  vaciarCarrito(): void {
    this.guardarCarritoEnClave(this.claveCarrito(), []);
    this.notificarCambio();
  }

  contarItems(): number {
    return this.obtenerCarrito().reduce((total, item) => total + (item.cantidad || 1), 0);
  }

  agregarJuego(juego: Juego): void {
    const carrito = this.obtenerCarrito();
    const existente = carrito.find((item) => item.id === juego.id);

    if (existente) {
      existente.cantidad += 1;
    } else {
      carrito.push({
        id: juego.id,
        nombre: juego.nombre,
        marca: juego.marca,
        precio: juego.descuento && juego.precioOferta ? juego.precioOferta : juego.precio,
        cantidad: 1,
      });
    }

    this.guardarCarrito(carrito);
  }

  cambiarCantidad(index: number, delta: number): void {
    const carrito = this.obtenerCarrito();
    if (!carrito[index]) return;

    carrito[index].cantidad += delta;
    if (carrito[index].cantidad <= 0) {
      carrito.splice(index, 1);
    }
    this.guardarCarrito(carrito);
  }

  eliminarItem(index: number): void {
    const carrito = this.obtenerCarrito();
    carrito.splice(index, 1);
    this.guardarCarrito(carrito);
  }
}
