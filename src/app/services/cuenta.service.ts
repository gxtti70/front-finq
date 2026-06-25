import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cuenta } from '../models/cuenta';
import { BASE_URL } from './api.config'; 
// Ahora apunta dinámicamente 
const API_URL = `${BASE_URL}/api/cuentas`;

@Injectable({
  providedIn: 'root'
})
export class CuentaService {
  private http = inject(HttpClient);

  // Método para obtener las cuentas desde producción
  getCuentas(): Observable<Cuenta[]> {
    return this.http.get<Cuenta[]>(API_URL);
  }

  // Método para crear una cuenta nueva en producción
  crearCuenta(cuenta: Cuenta): Observable<Cuenta> {
    return this.http.post<Cuenta>(API_URL, cuenta);
  }
}
