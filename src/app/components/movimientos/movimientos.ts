import { Component, OnInit, inject, signal, computed } from '@angular/core'; 
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { TransaccionService } from '../../services/transaccion';
import { Transaccion } from '../../models/transaccion';

@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, FormsModule], 
  templateUrl: './movimientos.html'
})
export class Movimientos implements OnInit {
  private transaccionService = inject(TransaccionService);

  historial = signal<Transaccion[]>([]);
  cargando = signal(true);

  // --- NUEVO: Signal para el Modal ---
  transaccionSeleccionada = signal<Transaccion | null>(null);

  filtroTexto = signal('');
  filtroTipo = signal('TODOS');
  filtroMes = signal('TODOS');
  filtroSemana = signal('TODOS');

  meses = [
    { id: '0', nombre: 'Enero' }, { id: '1', nombre: 'Febrero' }, { id: '2', nombre: 'Marzo' },
    { id: '3', nombre: 'Abril' }, { id: '4', nombre: 'Mayo' }, { id: '5', nombre: 'Junio' },
    { id: '6', nombre: 'Julio' }, { id: '7', nombre: 'Agosto' }, { id: '8', nombre: 'Septiembre' },
    { id: '9', nombre: 'Octubre' }, { id: '10', nombre: 'Noviembre' }, { id: '11', nombre: 'Diciembre' }
  ];

  movimientosFiltrados = computed(() => {
    const texto = this.filtroTexto().toLowerCase();
    const tipo = this.filtroTipo();
    const mes = this.filtroMes();
    const semana = this.filtroSemana();

    return this.historial().filter(mov => {
      const fecha = new Date(mov.fechaTransaccion);
      const cumpleTexto = mov.descripcion.toLowerCase().includes(texto);
      const tipoReal = (mov.categoria?.tipo || mov.tipo || '').toUpperCase().trim();
      const cumpleTipo = tipo === 'TODOS' || tipoReal === tipo;
      const cumpleMes = mes === 'TODOS' || fecha.getMonth().toString() === mes;
      const cumpleSemana = semana === 'TODOS' || this.getNumeroSemana(fecha).toString() === semana;

      return cumpleTexto && cumpleTipo && cumpleMes && cumpleSemana;
    });
  });

  totalIngresos = computed(() => 
    this.movimientosFiltrados()
      .filter(m => this.esIngreso(m))
      .reduce((acc, m) => acc + (m.monto || 0), 0)
  );

  totalGastos = computed(() => 
    this.movimientosFiltrados()
      .filter(m => !this.esIngreso(m))
      .reduce((acc, m) => acc + (m.monto || 0), 0)
  );

  balanceFiltrado = computed(() => this.totalIngresos() - this.totalGastos());

  ngOnInit() { this.cargarHistorial(); }

  cargarHistorial() {
    this.transaccionService.getTransacciones().subscribe({
      next: (datos) => {
        this.historial.set(datos.reverse());
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  // --- FUNCIONES DEL MODAL ---
  verDetalle(mov: Transaccion) {
    this.transaccionSeleccionada.set(mov);
  }

  cerrarModal() {
    this.transaccionSeleccionada.set(null);
  }

  getNumeroSemana(fecha: Date): number {
    const d = new Date(Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }

  esIngreso(mov: Transaccion): boolean {
    const tipoReal = (mov.categoria?.tipo || mov.tipo || '').toUpperCase().trim();
    return tipoReal === 'INGRESO';
  }

  limpiarFiltros() {
    this.filtroTexto.set('');
    this.filtroTipo.set('TODOS');
    this.filtroMes.set('TODOS');
    this.filtroSemana.set('TODOS');
  }
}