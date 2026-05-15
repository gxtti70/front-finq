import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  templateUrl: './configuracion.html'
})
export class ConfiguracionComponent implements OnInit {
  private router = inject(Router);

  nombreUsuario: string = 'Usuario';
  correoUsuario: string = 'cargando...';
  
  // Guardamos la pestaña activa por si luego quiere meterle más cosas
  pestanaActiva = signal<string>('perfil');

  ngOnInit() {
    this.extraerInfoDelToken();
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
        this.nombreUsuario = 'Usuario';
        this.correoUsuario = 'sin_correo@finq.com';
      }
    }
  }

  cerrarSesion() {
    // 1. Destruimos el carnet de identidad
    localStorage.removeItem('token');
    // 2. Lo pateamos pa' la calle (Login)
    this.router.navigate(['/login']);
  }
}