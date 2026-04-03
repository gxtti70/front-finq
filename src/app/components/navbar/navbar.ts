import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-navbar',
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