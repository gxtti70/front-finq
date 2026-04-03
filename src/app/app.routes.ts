import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard'; 

export const routes: Routes = [
  { path: '', component: Dashboard }, // Ruta principal carga el Dashboard
  { path: '**', redirectTo: '' }      // Cualquier ruta inválida te regresa al inicio
];