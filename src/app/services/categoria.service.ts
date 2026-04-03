import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../models/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  // La URL exacta de tu backend en Spring Boot
  private apiUrl = 'http://localhost:8080/api/categorias';

  // Inyectamos el HttpClient que configuramos en el paso 1
  constructor(private http: HttpClient) { }

  // Método para traer todas las categorías
  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }
}