import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../models/categoria';
import { BASE_URL } from './api.config'; 

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  // Ahora apunta dinámicamente 
  private apiUrl = `${BASE_URL}/api/categorias`;

  // Inyectamos el HttpClient por constructor
  constructor(private http: HttpClient) { }

  // Método para traer todas las categorías desde producción
  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }
}
