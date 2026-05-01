import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
// 🟢 Rutas de importación
import { CuentaService } from '../../services/cuenta.service';
import { Cuenta } from '../../models/cuenta';

@Component({
  selector: 'app-billetera',
  standalone: true,
  imports: [CurrencyPipe, FormsModule], 
  templateUrl: './billetera.html',
  providers: [] 
})
export class Billetera implements OnInit {
  
  private cuentaService = inject(CuentaService);

  // Estados de la UI
  mostrarModal = signal(false);
  cuentaSeleccionada = signal<Cuenta | null>(null); // 🟢 Para ver detalles
  cuentas = signal<Cuenta[]>([]);

  nuevaCuenta: Partial<Cuenta> = { 
    nombre: '', 
    saldo: 0, 
    color: 'from-blue-600 to-indigo-800', 
    numero: '' 
  };

  coloresDisponibles = [
    { name: 'Azul FinQ', value: 'from-blue-600 to-indigo-800' },
    { name: 'Esmeralda', value: 'from-emerald-500 to-teal-700' },
    { name: 'Naranja Vivo', value: 'from-orange-400 to-red-600' },
    { name: 'Púrpura Nu', value: 'from-purple-600 to-indigo-900' },
    { name: 'Dark Mode', value: 'from-slate-700 to-slate-900' }
  ];

  ngOnInit() {
    this.cargarCuentas();
  }

  cargarCuentas() {
    this.cuentaService.getCuentas().subscribe({
      next: (cuentasBackend) => {
        const cuentasAdaptadas = cuentasBackend.map(c => ({
          ...c,
          color: c.colorHex ? `from-[${c.colorHex}] to-gray-800` : 'from-blue-600 to-indigo-800',
          numero: '**** ' + Math.floor(1000 + Math.random() * 9000), 
          icon: this.obtenerIconoBanco(c.nombre),
          red: this.obtenerIconoRed(c.nombre)
        }));
        this.cuentas.set(cuentasAdaptadas);
      },
      error: (err) => console.error('Error cargando cuentas:', err)
    });
  }

  // --- MÉTODOS DEL MODAL NUEVA CUENTA ---
  abrirModal() {
    this.mostrarModal.set(true);
  }

  cerrarModal() {
    this.mostrarModal.set(false);
    this.limpiarFormulario();
  }

  vincularNuevaCuenta() {
    if (this.nuevaCuenta.nombre) {
      const cuentaAEnviar: any = {
        nombre: this.nuevaCuenta.nombre,
        tipo: 'DEBITO',
        saldo: this.nuevaCuenta.saldo,
        colorHex: this.nuevaCuenta.color === 'from-blue-600 to-indigo-800' ? '#2563eb' : '#000000' 
      };

      this.cuentaService.crearCuenta(cuentaAEnviar).subscribe({
        next: (res) => {
          this.cargarCuentas();
          this.cerrarModal();
        },
        error: (err) => console.error('Error al crear cuenta:', err)
      });
    }
  }

  limpiarFormulario() {
    this.nuevaCuenta = { nombre: '', saldo: 0, color: 'from-blue-600 to-indigo-800', numero: '' };
  }

  // --- 🟢 MÉTODOS DE DETALLES (Lo que se había confundido) ---
  abrirDetalle(cuenta: Cuenta) {
    this.cuentaSeleccionada.set(cuenta);
  }

  cerrarDetalle() {
    this.cuentaSeleccionada.set(null);
  }

  // --- HELPERS DE ICONOS ---
  obtenerIconoBanco(nombre: string | undefined): string {
    if (!nombre) return 'CUSTOM_BANK_GENERIC';
    const n = nombre.toLowerCase();
    if (n.includes('bancolombia')) return 'CUSTOM_BANCOLOMBIA';
    if (n.includes('nu')) return 'CUSTOM_NUBANK';
    if (n.includes('bbva')) return 'CUSTOM_BBVA';
    if (n.includes('santander')) return 'CUSTOM_SANTANDER';
    if (n.includes('efectivo') || n.includes('caja')) return 'CUSTOM_WALLET';
    return 'CUSTOM_BANK_GENERIC';
  }

  obtenerIconoRed(nombre: string | undefined): string {
    if (!nombre) return '';
    const n = nombre.toLowerCase();
    if (n.includes('visa')) return 'CUSTOM_VISA';
    if (n.includes('master')) return 'CUSTOM_MASTERCARD';
    if (n.includes('amex') || n.includes('american')) return 'CUSTOM_AMEX';
    return ''; 
  }
}