import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router'; // <-- Esta es la única que necesitamos

@Component({
  selector: 'app-navbar',
  standalone: true, // Importante para Angular 19
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html'
})
export class NavbarComponent {
  // Signals para controlar el estado de los menús
  isProfileMenuOpen = signal(false);
  isMobileMenuOpen = signal(false);

  // Funciones para alternar (abrir/cerrar) los menús
  toggleProfileMenu() {
    this.isProfileMenuOpen.update(val => !val);
    if (this.isProfileMenuOpen()) this.isMobileMenuOpen.set(false);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(val => !val);
    if (this.isMobileMenuOpen()) this.isProfileMenuOpen.set(false);
  }
}