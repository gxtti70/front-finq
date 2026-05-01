import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cuenta } from '../models/cuenta';
// Ojo: Asegúrese de importar su environment o usar la URL correcta
const API_URL = 'http://localhost:8080/api/cuentas';

@Injectable({
  providedIn: 'root'
})
export class CuentaService {
  private http = inject(HttpClient);

  getCuentas(): Observable<Cuenta[]> {
    return this.http.get<Cuenta[]>(API_URL);
  }

  crearCuenta(cuenta: Cuenta): Observable<Cuenta> {
    return this.http.post<Cuenta>(API_URL, cuenta);
  }
}