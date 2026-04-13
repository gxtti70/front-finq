import { Component, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-billetera',
  standalone: true,
  imports: [CurrencyPipe, FormsModule],
  templateUrl: './billetera.html'
})
export class Billetera {
  mostrarModal = signal(false);

  // Lista de cuentas (Signal inicial)
  cuentas = signal([
    { nombre: 'Ahorros Bancolombia', saldo: 2500000, color: 'from-yellow-400 to-yellow-600', numero: '**** 4521' },
    { nombre: 'Efectivo', saldo: 450000, color: 'from-emerald-500 to-teal-700', numero: 'Efectivo' }
  ]);

  // Modelo para la nueva cuenta
  nuevaCuenta = {
    nombre: '',
    saldo: 0,
    color: 'from-finq-primary to-indigo-700',
    numero: '' 
  };

  // Paleta de colores "pro" para las tarjetas
  coloresDisponibles = [
    { name: 'Azul FinQ', value: 'from-finq-primary to-indigo-700' },
    { name: 'Esmeralda', value: 'from-emerald-500 to-teal-700' },
    { name: 'Naranja Vivo', value: 'from-orange-400 to-red-600' },
    { name: 'Púrpura Tech', value: 'from-purple-500 to-pink-600' },
    { name: 'Dark Mode', value: 'from-slate-700 to-slate-900' }
  ];

  abrirModal() {
    this.mostrarModal.set(true);
  }

  cerrarModal() {
    this.mostrarModal.set(false);
    this.limpiarFormulario();
  }

  // MÉTODO ÚNICO Y LIMPIO
  vincularNuevaCuenta() {
    if (this.nuevaCuenta.nombre && this.nuevaCuenta.saldo >= 0) {
      
      // Lógica de número: Lo que puso el usuario OR un número generado si está vacío
      const idCuenta = this.nuevaCuenta.numero 
        ? this.nuevaCuenta.numero 
        : `**** ${Math.floor(1000 + Math.random() * 9000)}`;
      
      const cuentaFinal = {
        ...this.nuevaCuenta,
        numero: idCuenta
      };

      // Actualizamos el Signal con el nuevo array
      this.cuentas.update(prev => [...prev, cuentaFinal]);
      
      this.cerrarModal();
    }
  }

  limpiarFormulario() {
    this.nuevaCuenta = {
      nombre: '',
      saldo: 0,
      color: 'from-finq-primary to-indigo-700',
      numero: ''
    };
  }
}