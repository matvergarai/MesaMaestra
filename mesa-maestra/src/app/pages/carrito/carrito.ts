import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ItemCarrito } from '../../models/item-carrito.model';
import { Carrito } from '../../servicios/carrito';
import { Productos } from '../../servicios/productos';

@Component({
  selector: 'app-carrito-page',
  imports: [RouterLink],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css',
})
/** Vista del carrito: cantidades, subtotal y pago simulado. */
export class CarritoPage implements OnInit {
  private carritoSvc = inject(Carrito);
  private productos = inject(Productos);
  private router = inject(Router);

  items = signal<ItemCarrito[]>([]);
  totalItems = signal(0);
  subtotal = signal(0);

  ngOnInit(): void {
    this.actualizarVista();
  }

  actualizarVista(): void {
    const carrito = this.carritoSvc.obtenerCarrito();
    this.items.set(carrito);
    let total = 0;
    let count = 0;
    carrito.forEach((item) => {
      total += item.precio * item.cantidad;
      count += item.cantidad;
    });
    this.subtotal.set(total);
    this.totalItems.set(count);
  }

  formatearPrecio(precio: number): string {
    return this.productos.formatearPrecio(precio);
  }

  editorial(item: ItemCarrito): string {
    const juego = this.productos.obtenerJuegoPorId(item.id);
    return juego ? juego.marca : item.marca || '-';
  }

  cambiarCantidad(index: number, delta: number): void {
    this.carritoSvc.cambiarCantidad(index, delta);
    this.actualizarVista();
  }

  eliminarItem(index: number): void {
    this.carritoSvc.eliminarItem(index);
    this.actualizarVista();
  }

  simularPago(): void {
    this.carritoSvc.vaciarCarrito();
    this.router.navigate(['/pago-exitoso']);
  }
}
