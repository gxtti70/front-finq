import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Suscripcion } from '../models/suscripcion';
import { BASE_URL } from './api.config'; 

@Injectable({
  providedIn: 'root'
})
export class SuscripcionService {

  // Ahora apunta dinámicamente 
  private apiUrl = `${BASE_URL}/api/suscripciones`;

  constructor(private http: HttpClient) { }

  // GET: Obtener todas las suscripciones activas en producción
  getSuscripciones(): Observable<Suscripcion[]> {
    return this.http.get<Suscripcion[]>(this.apiUrl);
  }

  // POST: Registrar una nueva suscripción en producción
  crearSuscripcion(suscripcion: Suscripcion): Observable<Suscripcion> {
    return this.http.post<Suscripcion>(this.apiUrl, suscripcion);
  }
}
