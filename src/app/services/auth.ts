import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Signal para saber si el usuario está logueado en cualquier parte de la app
  currentUser = signal<any>(null);

  // La URL base de tu backend en Spring Boot
  private apiUrl = 'http://localhost:8080/api/auth';

  // Inyectamos HttpClient de forma clásica por constructor para evitar errores de TypeScript
  constructor(private http: HttpClient) { 
    // Magia: Si el usuario recarga la página, buscamos si ya tenía un token guardado
    const token = localStorage.getItem('token');
    if (token) {
      this.currentUser.set({ token: token });
    }
  }

  // MÉTODO DE LOGIN REAL
  login(correo: string, password: string): Observable<any> {
    // Empaquetamos los datos. Nota: mandamos 'email' porque así lo espera Spring Boot
    const body = { email: correo, password: password };

    return this.http.post<any>(`${this.apiUrl}/login`, body).pipe(
      tap((respuesta) => {
        // Cuando Spring Boot responde con éxito, guardamos el Token en el almacenamiento del navegador
        localStorage.setItem('token', respuesta.token);
        // Actualizamos nuestra variable global
        this.currentUser.set({ correo: correo, token: respuesta.token });
      })
    );
  }

  // MÉTODO DE REGISTRO REAL
  registro(nombre: string, correo: string, password: string): Observable<any> {
    // Empaquetamos los datos para el DTO de Spring Boot
    const body = { nombre: nombre, email: correo, password: password };

    return this.http.post<any>(`${this.apiUrl}/registro`, body);
  }

  // MÉTODO PARA CERRAR SESIÓN
  logout() {
    localStorage.removeItem('token'); // Borramos el token de seguridad
    this.currentUser.set(null);       // Limpiamos el usuario
  }
}