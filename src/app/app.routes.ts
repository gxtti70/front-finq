import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { Movimientos } from './components/movimientos/movimientos'; 

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'movimientos', component: Movimientos },
  { path: '**', redirectTo: 'dashboard' }
];