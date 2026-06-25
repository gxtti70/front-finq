import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { BASE_URL } from './api.config'; // 🚀 Importamos tu URL de Render

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Signal para saber si el usuario está logueado en cualquier parte de la app
  currentUser = signal<any>(null);

  // Ahora apunta dinámicamente a Render: https://back-finq.onrender.com/api/auth
  private apiUrl = `${BASE_URL}/api/auth`;

  // Inyectamos HttpClient por constructor
  constructor(private http: HttpClient) { 
    // Si el usuario recarga la página, buscamos si ya tenía un token guardado
    const token = localStorage.getItem('token');
    if (token) {
      this.currentUser.set({ token: token });
    }
  }

  // MÉTODO DE LOGIN REAL
  login(correo: string, password: string): Observable<any> {
    const body = { email: correo, password: password };

    return this.http.post<any>(`${this.apiUrl}/login`, body).pipe(
      tap((respuesta) => {
        // Guardamos el Token en el almacenamiento del navegador
        localStorage.setItem('token', respuesta.token);
        // Actualizamos nuestra variable global
        this.currentUser.set({ correo: correo, token: respuesta.token });
      })
    );
  }

  // MÉTODO DE REGISTRO REAL
  registro(nombre: string, correo: string, password: string): Observable<any> {
    const body = { nombre: nombre, email: correo, password: password };

    return this.http.post<any>(`${this.apiUrl}/registro`, body);
  }

  // MÉTODO PARA CAMBIAR CONTRASEÑA
  cambiarPassword(passActual: string, passNuevo: string): Observable<any> {
    const token = localStorage.getItem('token');
    
    // Armamos la cabecera de seguridad con el JWT
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.put<any>(`${this.apiUrl}/password`, 
      { passActual: passActual, passNuevo: passNuevo }, 
      { headers: headers }
    );
  }

  // MÉTODO PARA CERRAR SESIÓN
  logout() {
    localStorage.removeItem('token'); // Borramos el token de seguridad
    this.currentUser.set(null);       // Limpiamos el usuario
  }
}
