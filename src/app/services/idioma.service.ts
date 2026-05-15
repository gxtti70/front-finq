import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdiomaService {
  idiomaActual = signal<string>('es');

  private diccionarios: Record<string, Record<string, string>> = {
    es: {
      'CONFIG_TITULO': 'Configuración',
      'CONFIG_SUB': 'Administra tu cuenta y tus preferencias de FinQ',
      'BTN_PERFIL': 'Mi Perfil',
      'BTN_PREFERENCIAS': 'Preferencias',
      'BTN_SEGURIDAD': 'Seguridad',
      'ZONA_PELIGRO': 'Zona de Peligro',
      'CERRAR_SESION': 'Cerrar Sesión de FinQ',
      'EXITO_GUARDAR': 'Preferencias guardadas correctamente'
    },
    en: {
      'CONFIG_TITULO': 'Settings',
      'CONFIG_SUB': 'Manage your FinQ account and preferences',
      'BTN_PERFIL': 'My Profile',
      'BTN_PREFERENCIAS': 'Preferences',
      'BTN_SEGURIDAD': 'Security',
      'ZONA_PELIGRO': 'Danger Zone',
      'CERRAR_SESION': 'Log Out of FinQ',
      'EXITO_GUARDAR': 'Preferences saved successfully'
    }
  };

  constructor() {
    // Al cargar la app, miramos si ya tenía un idioma guardado
    const idiomaGuardado = localStorage.getItem('finq_idioma');
    if (idiomaGuardado) {
      this.idiomaActual.set(idiomaGuardado);
    }
  }

  // Cambia el idioma y lo guarda en el navegador
  cambiarIdioma(nuevoIdioma: string) {
    this.idiomaActual.set(nuevoIdioma);
    localStorage.setItem('finq_idioma', nuevoIdioma);
  }

  //Busca la palabra en el diccionario según el idioma actual
  t(llave: string): string {
    return this.diccionarios[this.idiomaActual()][llave] || llave;
  }
}