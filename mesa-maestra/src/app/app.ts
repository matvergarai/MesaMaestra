import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './componentes/footer/footer';
import { JuegoNube } from './componentes/juego-nube/juego-nube';
import { Navbar } from './componentes/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, JuegoNube],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
/** Componente raíz: diseño global con barra de navegación, pie de página, nube y salida del enrutador. */
export class App {}
