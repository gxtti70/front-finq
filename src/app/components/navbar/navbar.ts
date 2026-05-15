import { Component, signal, OnInit, inject } from '@angular/core'; 
import { RouterLink, RouterLinkActive, Router } from '@angular/router'; // 🟢 Agregamos Router aquí

@Component({
  selector: 'app-navbar',
  standalone: true, 
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html'
})
export class NavbarComponent implements OnInit {
  
  private router = inject(Router); // 🟢 Inyectamos el Router para poder redirigir al login

  isProfileMenuOpen = signal(false);
  isMobileMenuOpen = signal(false);

  nombreUsuario: string = 'Usuario';
  correoUsuario: string = 'cargando...';

  ngOnInit() {
    this.extraerInfoDelToken();
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen.update(val => !val);
    if (this.isProfileMenuOpen()) this.isMobileMenuOpen.set(false);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(val => !val);
    if (this.isMobileMenuOpen()) this.isProfileMenuOpen.set(false);
  }

  extraerInfoDelToken() {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        const payloadDecoded = atob(payloadBase64);
        const payloadJson = JSON.parse(payloadDecoded);
        
        const email = payloadJson.sub; 
        
        if (email) {
          this.correoUsuario = email; 
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

  // 🟢 LA FUNCIÓN QUE FALTABA
  cerrarSesion() {
    localStorage.removeItem('token'); // Quemamos el carnet
    this.isProfileMenuOpen.set(false); // Cerramos el menú
    this.router.navigate(['/login']); // Lo mandamos pa' fuera
  }
}