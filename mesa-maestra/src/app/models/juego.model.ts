/** Modelo de un juego de mesa en el catálogo. */
export interface Juego {
  id: number;
  nombre: string;
  autor: string;
  anio: number;
  marca: string;
  categoria: string;
  descripcion: string;
  recomendacion: string;
  precio: number;
  descuento: boolean;
  precioOferta?: number;
  porcentajeDescuento?: number;
  imagen: string;
  jugadoresMin: number;
  jugadoresMax: number;
  edadMin: number;
  duracion: string;
  stock?: number;
}
