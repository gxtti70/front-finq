import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaccion } from '../models/transaccion';
import { BASE_URL } from './api.config'; 

@Injectable({
  providedIn: 'root'
})
export class TransaccionService {
  
  // Ahora apunta dinámicamente 
  private apiUrl = `${BASE_URL}/api/transacciones`;

  constructor(private http: HttpClient) { }

  // GET: Obtener todas las transacciones (historial) en producción
  getTransacciones(): Observable<Transaccion[]> {
    return this.http.get<Transaccion[]>(this.apiUrl);
  }

  // POST: Enviar una nueva transacción al backend en producción
  crearTransaccion(transaccion: Transaccion): Observable<Transaccion> {
    return this.http.post<Transaccion>(this.apiUrl, transaccion);
  }
}
