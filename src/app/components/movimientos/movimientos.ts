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

  //Datos originales de la DB
  historial = signal<Transaccion[]>([]);
  cargando = signal(true);

  //Signals para los filtros (Estado de la búsqueda)
  filtroTexto = signal('');
  filtroTipo = signal('TODOS');

  // Se actualiza sola cuando cambie 'historial', 'filtroTexto' o 'filtroTipo'
  movimientosFiltrados = computed(() => {
    const texto = this.filtroTexto().toLowerCase();
    const tipo = this.filtroTipo();

    return this.historial().filter(mov => {
      const cumpleTexto = mov.descripcion.toLowerCase().includes(texto);
      
      const tipoReal = (mov.categoria?.tipo || mov.tipo || '').toUpperCase().trim();
      const cumpleTipo = tipo === 'TODOS' || tipoReal === tipo;

      return cumpleTexto && cumpleTipo;
    });
  });

  ngOnInit() {
    this.cargarHistorial();
  }

  cargarHistorial() {
    this.transaccionService.getTransacciones().subscribe({
      next: (datos) => {
        // Invertimos para ver lo más reciente primero
        this.historial.set(datos.reverse());
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar el historial:', err);
        this.cargando.set(false);
      }
    });
  }

  esIngreso(mov: Transaccion): boolean {
    const tipoReal = (mov.categoria?.tipo || mov.tipo || '').toUpperCase().trim();
    return tipoReal === 'INGRESO';
  }
}