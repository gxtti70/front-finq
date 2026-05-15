import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { Movimientos } from './components/movimientos/movimientos'; 
import { Billetera } from './components/billetera/billetera';
import { AuthComponent } from './components/auth/auth'; 
import { ConfiguracionComponent } from './components/configuracion/configuracion';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' }, 
  { path: 'auth', component: AuthComponent },
  { path: 'dashboard', component: Dashboard },
  { path: 'movimientos', component: Movimientos },
  { path: 'billetera', component: Billetera },
  { path: 'configuracion', component: ConfiguracionComponent }, 
  { path: '**', redirectTo: 'auth' } 
];