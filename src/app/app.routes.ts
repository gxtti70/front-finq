import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { Movimientos } from './components/movimientos/movimientos'; 
import { Billetera } from './components/billetera/billetera';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'movimientos', component: Movimientos },
  { path: 'billetera', component: Billetera }, 
  { path: '**', redirectTo: 'dashboard' } 
];