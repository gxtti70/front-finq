import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Suscripcion } from '../models/suscripcion';

@Injectable({
  providedIn: 'root'
})
export class SuscripcionService {

  private apiUrl = 'http://localhost:8080/api/suscripciones';

  constructor(private http: HttpClient) { }

  // GET: Obtener todas las suscripciones activas
  getSuscripciones(): Observable<Suscripcion[]> {
    return this.http.get<Suscripcion[]>(this.apiUrl);
  }

  // POST: Registrar una nueva suscripción
  crearSuscripcion(suscripcion: Suscripcion): Observable<Suscripcion> {
    return this.http.post<Suscripcion>(this.apiUrl, suscripcion);
  }
}