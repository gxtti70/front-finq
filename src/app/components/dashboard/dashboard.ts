import { Component, OnInit, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransaccionService } from '../../services/transaccion';
import { Transaccion } from '../../models/transaccion';
import { Chart, registerables } from 'chart.js';

// Registramos los módulos de Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe, FormsModule],
  templateUrl: './dashboard.html',
  providers: [CurrencyPipe] // Lo inyectamos aquí para usarlo en el TS
})
export class Dashboard implements OnInit {
  private transaccionService = inject(TransaccionService);
  private currencyPipe = inject(CurrencyPipe);

  // --- REFERENCIAS A LA UI ---
  @ViewChild('finqChart') chartCanvas!: ElementRef;
  chart: any;

  // --- ESTADOS DE LA UI (SIGNALS) ---
  saldoTotal = signal<number>(0);
  ingresos = signal<number>(0);
  gastos = signal<number>(0);
  mostrarModal = signal(false);

  // Signal para la notificación tipo Toast
  notificacion = signal<{ mostrar: boolean, mensaje: string, exito: boolean }>({
    mostrar: false,
    mensaje: '',
    exito: true
  });

  // --- DATOS FIJOS ---
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

  // --- FORMULARIO ---
  nuevaTransaccion = {
    descripcion: '',
    monto: 0,
    tipo: 'GASTO'
  };

  ngOnInit() {
    this.cargarDatos();
  }

  // --- LÓGICA DE DATOS ---

  cargarDatos() {
    this.transaccionService.getTransacciones().subscribe({
      next: (transacciones) => {
        this.calcularResumen(transacciones);
        this.actualizarGrafica(transacciones);
      },
      error: (err) => {
        console.error('Error al cargar datos:', err);
        this.mostrarAviso('Error al conectar con el servidor', false);
      }
    });
  }

  calcularResumen(transacciones: Transaccion[]) {
    let sumaIngresos = 0;
    let sumaGastos = 0;

    transacciones.forEach(t => {
      const monto = Number(t.monto) || 0;
      const tipoReal = t.categoria?.tipo?.toUpperCase().trim() || t.tipo?.toUpperCase().trim();

      if (tipoReal === 'INGRESO') {
        sumaIngresos += monto;
      } else {
        sumaGastos += monto;
      }
    });

    this.ingresos.set(sumaIngresos);
    this.gastos.set(sumaGastos);
    this.saldoTotal.set(sumaIngresos - sumaGastos);
  }

  // --- MOTOR DE LA GRÁFICA ---

  actualizarGrafica(transacciones: Transaccion[]) {
    const etiquetas = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
    const dataIngresos = [0, 0, 0, 0, 0, 0];
    const dataGastos = [0, 0, 0, 0, 0, 0];

    transacciones.forEach(t => {
      const fecha = new Date(t.fechaTransaccion);
      const mesIdx = fecha.getMonth();
      
      if (mesIdx < 6) {
        const tipoReal = t.categoria?.tipo?.toUpperCase().trim() || t.tipo?.toUpperCase().trim();
        if (tipoReal === 'INGRESO') {
          dataIngresos[mesIdx] += Number(t.monto);
        } else {
          dataGastos[mesIdx] += Number(t.monto);
        }
      }
    });

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: etiquetas,
        datasets: [
          {
            label: 'Ingresos',
            data: dataIngresos,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Gastos',
            data: dataGastos,
            borderColor: '#f43f5e',
            backgroundColor: 'rgba(244, 63, 94, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { display: false }, ticks: { display: false } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  guardarTransaccion() {
    console.log('Intentando guardar:', this.nuevaTransaccion);

    const esIngreso = this.nuevaTransaccion.tipo === 'INGRESO';
    
    // Formateamos el monto para el aviso
    const montoMsg = this.currencyPipe.transform(this.nuevaTransaccion.monto, 'COP', 'symbol-narrow', '1.0-0');

    const transaccionAEnviar: any = {
      descripcion: this.nuevaTransaccion.descripcion,
      monto: this.nuevaTransaccion.monto,
      fechaTransaccion: new Date().toISOString().split('T')[0],
      tipo: esIngreso ? 'INGRESO' : 'GASTO',
      categoria: { 
        id: esIngreso ? 2 : 1,
        tipo: esIngreso ? 'INGRESO' : 'GASTO'
      }
    };

    this.transaccionService.crearTransaccion(transaccionAEnviar).subscribe({
      next: (nueva) => {
        this.cerrarModal();
        this.cargarDatos(); 
        this.limpiarFormulario();
        
        // --- NOTIFICACIÓN TROCADA (Ingreso -> Gasto / Gasto -> Ingreso) ---
        this.mostrarAviso(`${esIngreso ? 'Gasto' : 'Ingreso'} de ${montoMsg} registrado`, true);
      },
      error: (err) => {
        console.error('Error al guardar:', err);
        this.mostrarAviso('Error al guardar el movimiento', false);
      }
    });
  }

  // --- UI HELPERS ---

  mostrarAviso(mensaje: string, exito: boolean) {
    this.notificacion.set({ mostrar: true, mensaje, exito });
    setTimeout(() => {
      this.notificacion.update(n => ({ ...n, mostrar: false }));
    }, 3500);
  }

  abrirModal() {
    this.mostrarModal.set(true);
  }

  cerrarModal() {
    this.notificacion.set({ mostrar: false, mensaje: '', exito: true }); // Reseteamos noti al cerrar
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