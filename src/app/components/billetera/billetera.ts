import { Component, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-billetera',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './billetera.html'
})
export class Billetera {
  // Datos simulados de tus cuentas
  cuentas = signal([
    { nombre: 'Ahorros Bancolombia', saldo: 2500000, color: 'from-yellow-400 to-yellow-600', numero: '**** 4521' },
    { nombre: 'Efectivo / Colchón', saldo: 450000, color: 'from-emerald-500 to-teal-700', numero: 'Efectivo' },
    { nombre: 'Tarjeta de Crédito', saldo: -850000, color: 'from-slate-700 to-slate-900', numero: '**** 8802' }
  ]);
}