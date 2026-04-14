import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './auth.html'
})
export class AuthComponent {
  isLogin = signal(true);

  authData = {
    nombre: '',
    correo: '',
    password: '',
    confirmPassword: ''
  };

  toggleMode() {
    this.isLogin.set(!this.isLogin());
    this.authData = { nombre: '', correo: '', password: '', confirmPassword: '' };
  }

  onSubmit() {
    if (this.isLogin()) {
      console.log('Iniciando sesión con:', this.authData.correo, this.authData.password);
    } else {
      if (this.authData.password !== this.authData.confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
      }
      console.log('Registrando usuario:', this.authData);
    }
  }
}