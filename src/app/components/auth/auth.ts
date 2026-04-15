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

  // 🟢 NUEVO: Signal para controlar si se muestra el popup de éxito
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

  // 🟢 NUEVO: Función para cerrar el modal y pasarlo a iniciar sesión
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
        error: (error) => {
          // Si Spring Boot responde con error (código 400/403)
          this.isLoading.set(false);
          this.errorMessage.set(error.error?.mensaje || 'Correo o contraseña incorrectos.');
        }
      });

    } else {
      // 🔵 LÓGICA DE REGISTRO REAL
      if (this.authData.password !== this.authData.confirmPassword) {
        this.errorMessage.set('Las contraseñas no coinciden.');
        this.isLoading.set(false);
        return; // Detenemos la ejecución aquí
      }

      this.authService.registro(this.authData.nombre, this.authData.correo, this.authData.password).subscribe({
        next: (respuesta) => {
          this.isLoading.set(false);
          // 🟢 MAGIA: En lugar del alert, prendemos el modal de éxito
          this.showSuccessModal.set(true); 
        },
        error: (error) => {
          this.isLoading.set(false);
          this.errorMessage.set(error.error?.mensaje || 'Error al registrar. Es posible que el correo ya esté en uso.');
        }
      });
    }
  }
}