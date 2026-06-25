import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth'; 

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './auth.html'
})
export class AuthComponent {
  isLogin = signal(true);
  
  errorMessage = signal('');
  isLoading = signal(false);

  // Signal para controlar si se muestra el popup de éxito
  showSuccessModal = signal(false);

  authData = {
    nombre: '',
    correo: '',
    password: '',
    confirmPassword: ''
  };

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  toggleMode() {
    this.isLogin.set(!this.isLogin());
    this.errorMessage.set(''); 
    this.authData = { nombre: '', correo: '', password: '', confirmPassword: '' };
  }

  // Función para cerrar el modal y pasarlo a iniciar sesión
  closeModalAndLogin() {
    this.showSuccessModal.set(false);
    this.toggleMode(); // Cambiamos la vista a login
  }

  onSubmit() {
    this.errorMessage.set('');
    this.isLoading.set(true);

    if (this.isLogin()) {
      // 🟢 LÓGICA DE LOGIN REAL
      this.authService.login(this.authData.correo, this.authData.password).subscribe({
        next: (respuesta) => {
          // Si Spring Boot responde OK (código 200)
          this.isLoading.set(false);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          // Si Spring Boot responde con error (código 400/403)
          this.isLoading.set(false);
          // Corregido: Manejo seguro del mensaje de error de la API
          this.errorMessage.set(err.error || err.message || 'Correo o contraseña incorrectos.');
        }
      });

    } else {
      // 🔵 LÓGICA DE REGISTRO REAL
      if (this.authData.password !== this.authData.confirmPassword) {
        this.errorMessage.set('Las contraseñas no coinciden.');
        this.isLoading.set(false);
        return; 
      }

      this.authService.registro(this.authData.nombre, this.authData.correo, this.authData.password).subscribe({
        next: (respuesta) => {
          this.isLoading.set(false);
          // Prendemos el modal de éxito
          this.showSuccessModal.set(true); 
        },
        error: (err) => {
          this.isLoading.set(false);
          // Corregido: Manejo seguro del error de duplicados en Render
          this.errorMessage.set(err.error || 'Error al registrar. Es posible que el correo ya esté en uso.');
        }
      });
    }
  }
}
