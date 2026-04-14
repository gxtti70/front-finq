import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar';
import { CommonModule } from '@angular/common'; // Necesario para el @if
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('front-finq');
  
  // Inyectamos el Router
  private router = inject(Router);
  
  // Variable (signal) para controlar la visibilidad del Navbar
  mostrarNavbar = signal(true);

  constructor() {
    // Nos suscribimos a los eventos de navegación
    this.router.events.pipe(
      // Solo nos interesa cuando la navegación termina
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Si la URL actual es '/auth', ocultamos el navbar (false)
      // Si es cualquier otra, lo mostramos (true)
      this.mostrarNavbar.set(event.urlAfterRedirects !== '/auth');
    });
  }
}