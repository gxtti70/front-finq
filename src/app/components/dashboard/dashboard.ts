import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransaccionService } from '../../services/transaccion';
import { Transaccion } from '../../models/transaccion';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe, FormsModule],
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {
  private transaccionService = inject(TransaccionService);

  // Estados de la UI
  saldoTotal = signal<number>(0);
  ingresos = signal<number>(0);
  gastos = signal<number>(0);
  mostrarModal = signal(false);

  // Formulario
  nuevaTransaccion = {
    descripcion: '',
    monto: 0,
    tipo: 'GASTO'
  };

  // Datos fijos de la UI
  gastosAplicaciones = signal([
    { nombre: 'Netflix', plan: 'Premium', monto: 45000, icono: '', imgUrl: 'https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/227_Netflix_logo-512.png', color: '', bg: 'bg-red-50' },
    { nombre: 'Spotify', plan: 'Duo', monto: 21400, icono: 'bxl-spotify', imgUrl: '', color: 'text-green-500', bg: 'bg-green-50' },
    { nombre: 'Amazon', plan: 'Prime Video', monto: 25000, icono: 'bxl-amazon', imgUrl: '', color: 'text-gray-800', bg: 'bg-gray-100' },
    { nombre: 'Apple', plan: 'iCloud+', monto: 12900, icono: 'bxl-apple', imgUrl: '', color: 'text-gray-900', bg: 'bg-gray-200' },
    { nombre: 'YouTube', plan: 'Premium', monto: 17900, icono: 'bxl-youtube', imgUrl: '', color: 'text-red-600', bg: 'bg-red-50' }
  ]);

  gastosRapidos = [
    { nombre: 'Netflix', icono: 'bxl-netflix', color: 'text-red-600' },
    { nombre: 'Spotify', icono: 'bxl-spotify', color: 'text-green-500' },
    { nombre: 'Mercado', icono: 'bx-cart', color: 'text-orange-500' },
    { nombre: 'Transporte', icono: 'bx-bus', color: 'text-blue-500' },
    { nombre: 'Arriendo', icono: 'bx-home', color: 'text-indigo-500' },
    { nombre: 'Servicios', icono: 'bx-plug', color: 'text-yellow-600' },
    { nombre: 'Salud / EPS', icono: 'bx-plus-medical', color: 'text-teal-500' }
  ];

  ngOnInit() {
    this.cargarDatos();
  }

  // --- LÓGICA DE DATOS ---

  cargarDatos() {
    this.transaccionService.getTransacciones().subscribe({
      next: (transacciones) => {
        console.log('Datos del Backend:', transacciones);
        this.calcularResumen(transacciones);
      },
      error: (err) => console.error('Error al cargar datos:', err)
    });
  }

  calcularResumen(transacciones: Transaccion[]) {
    let sumaIngresos = 0;
    let sumaGastos = 0;

    transacciones.forEach(t => {
      const monto = Number(t.monto) || 0;
      
      // LA UNIÓN: Buscamos el tipo real en la categoría
      const tipoReal = t.categoria?.tipo?.toUpperCase().trim();

      if (tipoReal === 'INGRESO') {
        sumaIngresos += monto;
      } else if (tipoReal === 'GASTO') {
        sumaGastos += monto;
      }
    });

    // Actualizamos los signals para la UI
    this.ingresos.set(sumaIngresos);
    this.gastos.set(sumaGastos);
    // MATEMÁTICA: Ingresos - Gastos
    this.saldoTotal.set(sumaIngresos - sumaGastos);

    console.log('Balance Final:', {
      ing: sumaIngresos,
      gas: sumaGastos,
      saldo: sumaIngresos - sumaGastos
    });
  }

  guardarTransaccion() {
    console.log('Intentando guardar:', this.nuevaTransaccion);

    const esIngreso = this.nuevaTransaccion.tipo === 'INGRESO';

    const transaccionAEnviar: any = {
      descripcion: this.nuevaTransaccion.descripcion,
      monto: this.nuevaTransaccion.monto,
      fechaTransaccion: new Date().toISOString().split('T')[0],
      // Importante para el back y para que calcularResumen no falle
      tipo: esIngreso ? 'INGRESO' : 'GASTO',
      categoria: { 
        id: esIngreso ? 2 : 1,
        tipo: esIngreso ? 'INGRESO' : 'GASTO'
      }
    };

    this.transaccionService.crearTransaccion(transaccionAEnviar).subscribe({
      next: (nueva) => {
        console.log('¡Guardado exitoso!', nueva);
        this.cerrarModal();
        this.cargarDatos(); // RECALCULAR TODO
        this.limpiarFormulario();
      },
      error: (err) => {
        console.error('Error al guardar:', err);
        alert('No se pudo guardar. Mira la consola del navegador.');
      }
    });
  }

  // --- UI HELPERS ---

  abrirModal() {
    this.mostrarModal.set(true);
  }

  cerrarModal() {
    this.mostrarModal.set(false);
  }

  limpiarFormulario() {
    this.nuevaTransaccion = { descripcion: '', monto: 0, tipo: 'GASTO' };
  }

  seleccionarGastoRapido(gasto: any) {
    this.nuevaTransaccion.descripcion = gasto.nombre;
    this.nuevaTransaccion.tipo = 'GASTO';
  }
}