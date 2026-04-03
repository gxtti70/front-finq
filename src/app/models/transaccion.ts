export interface Transaccion {
  id?: number;
  descripcion: string;
  monto: number;
  fechaTransaccion: string; 
  tipo?: string; // IMPORTANTE: Para que calcularResumen funcione
  categoria?: {
    id: number;
    nombre?: string;
    tipo: string;
  };
}