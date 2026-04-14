import { Component, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-billetera',
  standalone: true,
  // 1. Quitamos NgIconComponent de los imports
  imports: [CurrencyPipe, FormsModule], 
  templateUrl: './billetera.html',
  // 2. Eliminamos el bloque de providers e iconos de npm
  providers: [] 
})
export class Billetera {
  mostrarModal = signal(false);

  // Lista de cuentas (Usando identificadores para el HTML)
  cuentas = signal([
    { 
      nombre: 'Bancolombia', 
      saldo: 2500000, 
      color: 'from-yellow-400 to-yellow-600', 
      numero: '**** 4521', 
      icon: 'CUSTOM_BANCOLOMBIA', 
      red: 'CUSTOM_VISA' 
    },
    { 
      nombre: 'Nu México', 
      saldo: 1200000, 
      color: 'from-purple-600 to-indigo-800', 
      numero: '**** 9901', 
      icon: 'CUSTOM_NUBANK', 
      red: 'CUSTOM_MASTERCARD' 
    },
    { 
      nombre: 'Efectivo', 
      saldo: 450000, 
      color: 'from-emerald-500 to-teal-700', 
      numero: 'Bolsillo', 
      icon: 'CUSTOM_WALLET', // Flag para SVG de billetera
      red: '' 
    }
  ]);

  nuevaCuenta = { nombre: '', saldo: 0, color: 'from-finq-primary to-indigo-700', numero: '' };

  coloresDisponibles = [
    { name: 'Azul FinQ', value: 'from-finq-primary to-indigo-700' },
    { name: 'Esmeralda', value: 'from-emerald-500 to-teal-700' },
    { name: 'Naranja Vivo', value: 'from-orange-400 to-red-600' },
    { name: 'Púrpura Nu', value: 'from-purple-600 to-indigo-900' },
    { name: 'Dark Mode', value: 'from-slate-700 to-slate-900' }
  ];

  abrirModal() {
    this.mostrarModal.set(true);
  }

  cerrarModal() {
    this.mostrarModal.set(false);
    this.limpiarFormulario();
  }

  // DETECCIÓN DE BANCOS POR STRING (Retorna el ID para el HTML)
  obtenerIconoBanco(nombre: string): string {
    const n = nombre.toLowerCase();
    if (n.includes('bancolombia')) return 'CUSTOM_BANCOLOMBIA';
    if (n.includes('nu')) return 'CUSTOM_NUBANK';
    if (n.includes('bbva')) return 'CUSTOM_BBVA';
    if (n.includes('santander')) return 'CUSTOM_SANTANDER';
    if (n.includes('efectivo') || n.includes('caja')) return 'CUSTOM_WALLET';
    return 'CUSTOM_BANK_GENERIC';
  }

  // DETECCIÓN DE REDES POR STRING (Retorna el ID para el HTML)
  obtenerIconoRed(nombre: string): string {
    const n = nombre.toLowerCase();
    if (n.includes('visa')) return 'CUSTOM_VISA';
    if (n.includes('master')) return 'CUSTOM_MASTERCARD';
    if (n.includes('amex') || n.includes('american')) return 'CUSTOM_AMEX';
    return ''; 
  }

  vincularNuevaCuenta() {
    if (this.nuevaCuenta.nombre) {
      const idCuenta = this.nuevaCuenta.numero || `**** ${Math.floor(1000 + Math.random() * 9000)}`;
      const cuentaFinal = {
        ...this.nuevaCuenta,
        numero: idCuenta,
        icon: this.obtenerIconoBanco(this.nuevaCuenta.nombre),
        red: this.obtenerIconoRed(this.nuevaCuenta.nombre)
      };
      this.cuentas.update(prev => [...prev, cuentaFinal]);
      this.cerrarModal();
    }
  }

  limpiarFormulario() {
    this.nuevaCuenta = { nombre: '', saldo: 0, color: 'from-finq-primary to-indigo-700', numero: '' };
  }
}