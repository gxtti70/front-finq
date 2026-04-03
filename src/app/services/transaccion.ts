import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaccion } from '../models/transaccion';

@Injectable({
  providedIn: 'root'
})

export class TransaccionService { // <-- ¡Aquí está el nombre exacto que el Dashboard estaba buscando!
  
  private apiUrl = 'http://localhost:8080/api/transacciones';

  constructor(private http: HttpClient) { }

  // GET: Obtener todas las transacciones (historial)
  getTransacciones(): Observable<Transaccion[]> {
    return this.http.get<Transaccion[]>(this.apiUrl);
  }

  // POST: Enviar una nueva transacción al backend
  crearTransaccion(transaccion: Transaccion): Observable<Transaccion> {
    return this.http.post<Transaccion>(this.apiUrl, transaccion);
  }
}