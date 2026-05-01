export interface Cuenta {
    id?: string;
    nombre: string;
    tipo: string;
    saldo: number;
    colorHex: string;
    // Agregamos estos atributos visuales opcionales para no romper su HTML actual
    numero?: string;
    color?: string; // Para clases de Tailwind
    icon?: string;
    red?: string;
}