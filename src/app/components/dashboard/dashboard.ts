import { Component, OnInit, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; 
import { forkJoin } from 'rxjs';

import { TransaccionService } from '../../services/transaccion';
import { CuentaService } from '../../services/cuenta.service'; 
import { Transaccion } from '../../models/transaccion';
import { Chart, registerables } from 'chart.js';
import { SuscripcionService } from '../../services/suscripcion.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe, FormsModule],
  templateUrl: './dashboard.html',
  providers: [CurrencyPipe] 
})
export class Dashboard implements OnInit {
  private transaccionService = inject(TransaccionService);
  private cuentaService = inject(CuentaService); 
  private router = inject(Router); 
  private currencyPipe = inject(CurrencyPipe);
  private suscripcionService = inject(SuscripcionService);
  
  nombreUsuario: string = 'Usuario';

  @ViewChild('finqChart') chartCanvas!: ElementRef;
  chart: any;

  // --- ESTADOS DE LA UI ---
  cargando = signal<boolean>(true); 
  sinCuentas = signal<boolean>(false); 

  saldoBaseCuentas = signal<number>(0); // Suma de las tarjetas

  saldoTotal = signal<number>(0);
  ingresos = signal<number>(0);
  gastos = signal<number>(0);
  mostrarModal = signal(false);

  notificacion = signal<{ mostrar: boolean, mensaje: string, exito: boolean }>({
    mostrar: false, mensaje: '', exito: true
  });

  // --- DATOS DINÁMICOS ---
  gastosAplicaciones = signal<any[]>([]);

  nuevaTransaccion = { 
    descripcion: '', 
    monto: 0, 
    tipo: 'GASTO', // 'GASTO' | 'INGRESO' | 'SUSCRIPCION'
    cicloFacturacion: 'MENSUAL',
    proximoCobro: new Date().toISOString().split('T')[0]
  };

  gastosRapidos = [
    { nombre: 'Comida', icono: 'bx-restaurant' },
    { nombre: 'Transporte', icono: 'bx-car' },
    { nombre: 'Café', icono: 'bx-coffee' },
    { nombre: 'Mercado', icono: 'bx-shopping-bag' },
    { nombre: 'Entretenimiento', icono: 'bx-film' },
    { nombre: 'Hogar', icono: 'bx-home-alt' },
    { nombre: 'Salud', icono: 'bx-heart' },
    { nombre: 'Otros', icono: 'bx-dots-horizontal-rounded' }
  ];

  // --- AUTOCOMPLETADO DE SUSCRIPCIONES ---
  mostrarSugerencias = signal<boolean>(false);

  suscripcionesPopulares: string[] = [
    'Netflix', 'Spotify', 'Amazon Prime', 'Disney+', 'Max (HBO)', 
    'YouTube Premium', 'Apple iCloud', 'Apple Music', 'ChatGPT Plus', 
    'Xbox Game Pass', 'PlayStation Plus', 'Crunchyroll', 'Canva', 
    'Adobe Creative Cloud', 'Duolingo', 'Starlink', 'GitHub Copilot'
  ];

  sugerenciasFiltradas = signal<string[]>([...this.suscripcionesPopulares]);

  filtrarSugerencias() {
    const busqueda = this.nuevaTransaccion.descripcion.toLowerCase().trim();
    
    if (!busqueda) {
      this.sugerenciasFiltradas.set(this.suscripcionesPopulares);
    } else {
      const filtradas = this.suscripcionesPopulares.filter(suscripcion =>
        suscripcion.toLowerCase().includes(busqueda)
      );
      this.sugerenciasFiltradas.set(filtradas);
    }
  }

  seleccionarSugerencia(nombre: string) {
    this.nuevaTransaccion.descripcion = nombre;
    this.mostrarSugerencias.set(false);
  }

  limpiarFormulario() { 
    this.nuevaTransaccion = { 
      descripcion: '', 
      monto: 0, 
      tipo: 'GASTO',
      cicloFacturacion: 'MENSUAL',
      proximoCobro: new Date().toISOString().split('T')[0]
    }; 
    this.mostrarSugerencias.set(false);
    this.sugerenciasFiltradas.set([...this.suscripcionesPopulares]);
  }

  ngOnInit() {
    this.extraerNombreDelToken();
    this.verificarCuentas(); 
  }

  verificarCuentas() {
    this.cuentaService.getCuentas().subscribe({
      next: (cuentas) => {
        if (cuentas.length === 0) {
          this.sinCuentas.set(true);
          this.cargando.set(false);
        } else {
          const totalEnCuentas = cuentas.reduce((acumulado, cuenta) => acumulado + Number(cuenta.saldo || 0), 0);
          this.saldoBaseCuentas.set(totalEnCuentas);
          this.sinCuentas.set(false);
          this.cargarDatos(); 
        }
      },
      error: (err) => {
        console.error('Error verificando cuentas:', err);
        this.cargando.set(false);
      }
    });
  }

  irABilletera() {
    this.router.navigate(['/billetera']); 
  }

  // --- LÓGICA DE DATOS ---
  cargarDatos() {
    // forkJoin ejecuta ambas peticiones en paralelo y espera a que terminen las dos
    forkJoin({
      transacciones: this.transaccionService.getTransacciones(),
      suscripciones: this.suscripcionService.getSuscripciones()
    }).subscribe({
      next: ({ transacciones, suscripciones }) => {
        // 1. Procesamos las suscripciones para renderizarlas en la lista con sus logos
        this.procesarSuscripcionesLista(suscripciones);

        // 2. Calculamos el resumen global sumando transacciones normales + suscripciones
        this.calcularResumen(transacciones, suscripciones);

        // 3. Dibujamos la gráfica analítica
        this.actualizarGrafica(transacciones);

        this.cargando.set(false); 
      },
      error: (err) => {
        console.error('Error al cargar datos del dashboard:', err);
        this.mostrarAviso('Error al conectar con el servidor', false);
        this.cargando.set(false);
      }
    });
  }

  calcularResumen(transacciones: Transaccion[], suscripciones: any[]) {
    let sumaIngresos = 0;
    let sumaGastos = 0;

    // 1. Sumar transacciones estándar (Ingresos y Gastos comunes)
    transacciones.forEach(t => {
      const monto = Number(t.monto) || 0;
      const tipoReal = t.categoria?.tipo?.toUpperCase().trim() || t.tipo?.toUpperCase().trim();

      if (tipoReal === 'INGRESO') {
        sumaIngresos += monto;
      } else {
        sumaGastos += monto;
      }
    });

    // 2. Sumar las suscripciones fijas como parte de los Gastos del mes
    suscripciones.forEach(sub => {
      if (sub.activa) { // Opcional: Solo si manejas bandera de activa/inactiva
        sumaGastos += Number(sub.monto) || 0;
      }
    });

    // 3. Sincronizar las señales reactivas de la UI
    this.ingresos.set(sumaIngresos);
    this.gastos.set(sumaGastos);
    this.saldoTotal.set(this.saldoBaseCuentas() + sumaIngresos - sumaGastos);
  }

  procesarSuscripcionesLista(suscripciones: any[]) {
    const datosMapeados = suscripciones.map(sub => {
      const nombreLower = sub.nombre.toLowerCase();

      if (nombreLower.includes('netflix')) {
        return { nombre: sub.nombre, plan: sub.cicloFacturacion, monto: sub.monto, icono: '', imgUrl: 'https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/227_Netflix_logo-512.png', color: '', bg: 'bg-red-50' };
      }
      if (nombreLower.includes('spotify')) {
        return { nombre: sub.nombre, plan: sub.cicloFacturacion, monto: sub.monto, icono: 'bxl-spotify', imgUrl: '', color: 'text-green-500', bg: 'bg-green-50' };
      }
      if (nombreLower.includes('amazon') || nombreLower.includes('prime')) {
        return { nombre: sub.nombre, plan: sub.cicloFacturacion, monto: sub.monto, icono: 'bxl-amazon', imgUrl: '', color: 'text-gray-800', bg: 'bg-gray-100' };
      }
      if (nombreLower.includes('apple') || nombreLower.includes('icloud')) {
        return { nombre: sub.nombre, plan: sub.cicloFacturacion, monto: sub.monto, icono: 'bxl-apple', imgUrl: '', color: 'text-gray-900', bg: 'bg-gray-200' };
      }
      if (nombreLower.includes('youtube')) {
        return { nombre: sub.nombre, plan: sub.cicloFacturacion, monto: sub.monto, icono: 'bxl-youtube', imgUrl: '', color: 'text-red-600', bg: 'bg-red-50' };
      }

      return { nombre: sub.nombre, plan: sub.cicloFacturacion, monto: sub.monto, icono: 'bx-credit-card', imgUrl: '', color: 'text-indigo-600', bg: 'bg-indigo-50' };
    });

    this.gastosAplicaciones.set(datosMapeados);
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

    if (this.chart) this.chart.destroy();

    setTimeout(() => { 
      if (this.chartCanvas) {
        this.chart = new Chart(this.chartCanvas.nativeElement, {
          type: 'line',
          data: {
            labels: etiquetas,
            datasets: [
              { label: 'Ingresos', data: dataIngresos, borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', fill: true, tension: 0.4 },
              { label: 'Gastos', data: dataGastos, borderColor: '#f43f5e', backgroundColor: 'rgba(244, 63, 94, 0.1)', fill: true, tension: 0.4 }
            ]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, grid: { display: false }, ticks: { display: false } }, x: { grid: { display: false } } }
          }
        });
      }
    }, 100);
  }

  // --- ACCIONES DEL FORMULARIO ---
  guardarTransaccion() {
    if (this.nuevaTransaccion.tipo === 'SUSCRIPCION') {
      this.guardarSuscripcionReal();
      return;
    }

    const esIngreso = this.nuevaTransaccion.tipo === 'INGRESO';
    const montoMsg = this.currencyPipe.transform(this.nuevaTransaccion.monto, 'COP', 'symbol-narrow', '1.0-0');

    const transaccionAEnviar: any = {
      descripcion: this.nuevaTransaccion.descripcion,
      monto: this.nuevaTransaccion.monto,
      fechaTransaccion: new Date().toISOString().split('T')[0],
      tipo: esIngreso ? 'INGRESO' : 'GASTO',
      categoria: { id: esIngreso ? 2 : 1, tipo: esIngreso ? 'INGRESO' : 'GASTO' }
    };

    this.transaccionService.crearTransaccion(transaccionAEnviar).subscribe({
      next: () => {
        this.cerrarModal();
        this.cargarDatos(); 
        this.limpiarFormulario();
        this.mostrarAviso(`${esIngreso ? 'Ingreso' : 'Gasto'} de ${montoMsg} registrado`, true);
      },
      error: (err) => {
        if (err.status === 400 && String(err.error).includes("No tienes tarjetas")) {
          this.mostrarAviso("¡Pilas! 💳 Primero debes crear una cuenta en la sección de Billeteras", false);
        } else {
          this.mostrarAviso("Error al guardar el movimiento", false);
        }
      }
    });
  }

  guardarSuscripcionReal() {
    const montoMsg = this.currencyPipe.transform(this.nuevaTransaccion.monto, 'COP', 'symbol-narrow', '1.0-0');

    const suscripcionAEnviar: any = {
      nombre: this.nuevaTransaccion.descripcion,
      monto: this.nuevaTransaccion.monto,
      cicloFacturacion: this.nuevaTransaccion.cicloFacturacion,
      proximoCobro: this.nuevaTransaccion.proximoCobro,
      activa: true
    };

    this.suscripcionService.crearSuscripcion(suscripcionAEnviar).subscribe({
      next: () => {
        this.cerrarModal();
        this.cargarDatos();
        this.limpiarFormulario();
        this.mostrarAviso(`Suscripción a ${suscripcionAEnviar.nombre} de ${montoMsg} guardada exitosamente`, true);
      },
      error: (err) => {
        console.error('Error al guardar suscripción:', err);
        this.mostrarAviso("Error al intentar guardar la suscripción", false);
      }
    });
  }

  // --- UI HELPERS ---
  mostrarAviso(mensaje: string, exito: boolean) {
    this.notificacion.set({ mostrar: true, mensaje, exito });
    setTimeout(() => this.notificacion.update(n => ({ ...n, mostrar: false })), 3500);
  }

  abrirModal() { this.mostrarModal.set(true); }
  cerrarModal() { this.notificacion.set({ mostrar: false, mensaje: '', exito: true }); this.mostrarModal.set(false); }
  
  seleccionarGastoRapido(gasto: any) { 
    this.nuevaTransaccion.descripcion = gasto.nombre; 
    this.nuevaTransaccion.tipo = 'GASTO'; 
  }

  // --- EXTRAER NOMBRE DEL TOKEN ---
  extraerNombreDelToken() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        const email = JSON.parse(atob(payloadBase64)).sub; 
        if (email) {
          let nombreCortado = email.split('@')[0];
          this.nombreUsuario = nombreCortado.charAt(0).toUpperCase() + nombreCortado.slice(1);
        }
      } catch (e) { this.nombreUsuario = 'Usuario'; }
    } else { this.nombreUsuario = 'Usuario'; }
  }

  cargarSuscripcionesReales() {
    this.suscripcionService.getSuscripciones().subscribe({
      next: (suscripciones) => {
        const datosMapeados = suscripciones.map(sub => {
          const nombreLower = sub.nombre.toLowerCase();

          if (nombreLower.includes('netflix')) {
            return { nombre: sub.nombre, plan: sub.cicloFacturacion, monto: sub.monto, icono: '', imgUrl: 'https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/227_Netflix_logo-512.png', color: '', bg: 'bg-red-50' };
          }
          if (nombreLower.includes('spotify')) {
            return { nombre: sub.nombre, plan: sub.cicloFacturacion, monto: sub.monto, icono: 'bxl-spotify', imgUrl: '', color: 'text-green-500', bg: 'bg-green-50' };
          }
          if (nombreLower.includes('amazon') || nombreLower.includes('prime')) {
            return { nombre: sub.nombre, plan: sub.cicloFacturacion, monto: sub.monto, icono: 'bxl-amazon', imgUrl: '', color: 'text-gray-800', bg: 'bg-gray-100' };
          }
          if (nombreLower.includes('apple') || nombreLower.includes('icloud')) {
            return { nombre: sub.nombre, plan: sub.cicloFacturacion, monto: sub.monto, icono: 'bxl-apple', imgUrl: '', color: 'text-gray-900', bg: 'bg-gray-200' };
          }
          if (nombreLower.includes('youtube')) {
            return { nombre: sub.nombre, plan: sub.cicloFacturacion, monto: sub.monto, icono: 'bxl-youtube', imgUrl: '', color: 'text-red-600', bg: 'bg-red-50' };
          }

          return { nombre: sub.nombre, plan: sub.cicloFacturacion, monto: sub.monto, icono: 'bx-credit-card', imgUrl: '', color: 'text-indigo-600', bg: 'bg-indigo-50' };
        });

        this.gastosAplicaciones.set(datosMapeados);
      },
      error: (err) => {
        console.error('Error al cargar las suscripciones del backend:', err);
      }
    });
  }
}