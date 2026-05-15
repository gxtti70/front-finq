import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { AuthService } from '../../services/auth'; 
import { IdiomaService } from '../../services/idioma.service'; 

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [FormsModule], 
  templateUrl: './configuracion.html'
})
export class ConfiguracionComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService); 
  public idiomaService = inject(IdiomaService); // 🟢 Inyectamos como public para usarlo en el HTML

  nombreUsuario: string = 'Usuario';
  correoUsuario: string = 'cargando...';
  pestanaActiva = signal<string>('perfil');

  notificacion = signal<{ mostrar: boolean, mensaje: string, exito: boolean }>({
    mostrar: false, mensaje: '', exito: true
  });

  preferencias = { moneda: 'COP', idioma: 'es' };

  seguridad = { passActual: '', passNuevo: '', passConfirmacion: '' };

  ngOnInit() {
    this.extraerInfoDelToken();
    this.cargarPreferenciasLocales();
  }

  extraerInfoDelToken() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payloadJson = JSON.parse(atob(token.split('.')[1]));
        if (payloadJson.sub) {
          this.correoUsuario = payloadJson.sub;
          this.nombreUsuario = this.correoUsuario.split('@')[0].charAt(0).toUpperCase() + this.correoUsuario.split('@')[0].slice(1);
        }
      } catch (e) { 
        this.nombreUsuario = 'Usuario';
      }
    }
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  cargarPreferenciasLocales() {
    const prefs = localStorage.getItem('finq_preferencias');
    if (prefs) {
      this.preferencias = JSON.parse(prefs);
      this.idiomaService.cambiarIdioma(this.preferencias.idioma);
    } else {
      // Si no hay nada, usamos el idioma por defecto del servicio
      this.preferencias.idioma = this.idiomaService.idiomaActual();
    }
  }

  guardarPreferencias() {
    // Guardamos el objeto completo de preferencias
    localStorage.setItem('finq_preferencias', JSON.stringify(this.preferencias));
    
    this.idiomaService.cambiarIdioma(this.preferencias.idioma);
    
    this.mostrarAviso(this.idiomaService.t('EXITO_GUARDAR'), true);
  }

  cambiarPassword() {
    if (!this.seguridad.passActual || !this.seguridad.passNuevo || !this.seguridad.passConfirmacion) {
      this.mostrarAviso('Por favor llena todos los campos', false);
      return;
    }

    if (this.seguridad.passNuevo !== this.seguridad.passConfirmacion) {
      this.mostrarAviso('Las contraseñas nuevas no coinciden', false);
      return;
    }

    if (this.seguridad.passNuevo.length < 6) {
      this.mostrarAviso('La contraseña debe tener al menos 6 caracteres', false);
      return;
    }

    this.authService.cambiarPassword(this.seguridad.passActual, this.seguridad.passNuevo)
      .subscribe({
        next: (res: any) => {
          this.mostrarAviso('Contraseña actualizada con éxito', true);
          this.seguridad = { passActual: '', passNuevo: '', passConfirmacion: '' };
        },
        error: (err: any) => {
          console.error('Error del backend:', err);
          this.mostrarAviso('La contraseña actual es incorrecta', false);
        }
      });
  }

  mostrarAviso(mensaje: string, exito: boolean) {
    this.notificacion.set({ mostrar: true, mensaje, exito });
    setTimeout(() => this.notificacion.update(n => ({ ...n, mostrar: false })), 3500);
  }
}