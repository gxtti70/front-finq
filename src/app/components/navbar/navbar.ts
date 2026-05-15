import { Component, signal, OnInit } from '@angular/core'; 
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true, 
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html'
})
export class NavbarComponent implements OnInit { 
  isProfileMenuOpen = signal(false);
  isMobileMenuOpen = signal(false);

  //Variables para guardar la identidad
  nombreUsuario: string = 'Usuario';
  correoUsuario: string = 'cargando...';

  //Esto se ejecuta apenas el Navbar aparece en pantalla
  ngOnInit() {
    this.extraerInfoDelToken();
  }

  // Funciones para alternar (abrir/cerrar) los menús
  toggleProfileMenu() {
    this.isProfileMenuOpen.update(val => !val);
    if (this.isProfileMenuOpen()) this.isMobileMenuOpen.set(false);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(val => !val);
    if (this.isMobileMenuOpen()) this.isProfileMenuOpen.set(false);
  }

  //Función para descifrar el Token y sacar los datos
  extraerInfoDelToken() {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        const payloadDecoded = atob(payloadBase64);
        const payloadJson = JSON.parse(payloadDecoded);
        
        // El correo original viene en la propiedad "sub"
        const email = payloadJson.sub; 
        
        if (email) {
          this.correoUsuario = email; // Guardamos el correo completo
          
          let nombreCortado = email.split('@')[0];
          this.nombreUsuario = nombreCortado.charAt(0).toUpperCase() + nombreCortado.slice(1);
        }
      } catch (e) { 
        console.error('Error leyendo el token en el navbar:', e);
        this.nombreUsuario = 'Usuario';
        this.correoUsuario = 'sin_correo@finq.com';
      }
    } else {
      this.nombreUsuario = 'Usuario';
      this.correoUsuario = 'sin_correo@finq.com';
    }
  }
}