import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar'; // <-- Cambiamos Navbar por NavbarComponent

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent], // <-- Y aquí también
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('front-finq');
}