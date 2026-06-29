import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pago-exitoso',
  imports: [RouterLink],
  templateUrl: './pago-exitoso.html',
  styleUrl: './pago-exitoso.css',
})
/** Confirmación visual tras completar el flujo de pago simulado. */
export class PagoExitoso {}
