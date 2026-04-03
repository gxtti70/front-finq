export interface Categoria {
  id?: number; // El signo de interrogación significa que es opcional al crear una nueva
  nombre: string;
  tipo: 'INGRESO' | 'GASTO';
  colorHex: string;
}