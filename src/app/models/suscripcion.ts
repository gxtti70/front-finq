import { Usuario } from './usuario';
import { Categoria } from './categoria';

export interface Suscripcion {
  id?: string;
  nombre: string;
  monto: number;
  cicloFacturacion: 'MENSUAL' | 'ANUAL';
  proximoCobro: string | Date;
  activa: boolean;
  usuario: Usuario;
  categoria: Categoria;
  fechaRegistro?: Date;
}