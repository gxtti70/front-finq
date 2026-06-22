# 💰 FinQ - Frontend | Gestión Financiera Personal

<div align="center">
  <img src="https://img.shields.io/badge/status-TERMINADO%20%7C%20Listo%20para%20desplegar-brightgreen?style=for-the-badge" alt="Estado">
  <img src="https://img.shields.io/badge/Angular-19-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular 19">
  <img src="https://img.shields.io/badge/TypeScript-5.7-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Angular_Signals-State_Management-FF0000?style=for-the-badge" alt="Angular Signals">
</div>

**FinQ** es una aplicación web moderna de gestión financiera personal que permite a los usuarios registrar, categorizar y visualizar sus ingresos y gastos de forma intuitiva. Construida con **Angular 19**, **Tailwind CSS** y una interfaz **Glassmorphism**, ofrece una experiencia visual fluida y responsiva en cualquier dispositivo.

> ✅ **Estado del Proyecto:** El proyecto está **100% TERMINADO Y FUNCIONAL**. Solo falta el despliegue en producción.

---

## ✨ Características Principales

* 📊 **Dashboard Dinámico:** Resumen visual en tiempo real del saldo total, ingresos (verdes) y gastos (rojos) con indicadores clave.
* 💳 **Gestión de Transacciones:** CRUD completo para registrar movimientos financieros con categorización automática.
* 🏷️ **Sistema de Categorías:** Clasificación inteligente de gastos (Alimentación, Transporte, Entretenimiento, etc.).
* ⚡ **Botones de Acceso Rápido:** Sugerencias contextuales para gastos frecuentes (Netflix, Servicios, Compras, etc.).
* 🎨 **Diseño Glassmorphism:** Interfaz moderna con efectos visuales de vidrio esmerilado y degradados suaves.
* 📱 **100% Responsivo:** Optimizado para celulares, tablets y escritorio mediante diseño Mobile-First.
* ⚙️ **State Management Moderno:** Gestión de estado con **Angular Signals** para reactividad sin dependencias externas.
* ✔️ **Completamente Testeado:** Código limpio, funcionalidades validadas y listas para producción.

---

## 🛠️ Stack Tecnológico

**Frontend:**
* **Framework:** Angular 19
* **Lenguaje:** TypeScript 5.7
* **Estilos:** Tailwind CSS 3.x
* **State Management:** Angular Signals
* **Build Tool:** Angular CLI & Vite

**Backend & Infraestructura:**
* **API:** Spring Boot (back-finq)
* **Comunicación:** HTTP Client / REST
* **Despliegue:** Vercel

---

## 🎯 Funcionalidades Implementadas

### ✅ Dashboard
- [x] Visualización de saldo actual, ingresos totales y gastos totales
- [x] Tarjetas informativas con íconos categorizados
- [x] Historial de últimas transacciones con acciones rápidas
- [x] Indicadores visuales de balance

### ✅ Gestión de Transacciones
- [x] Formulario intuitivo para crear transacciones
- [x] Selección de categorías predefinidas
- [x] Edición y eliminación de registros existentes
- [x] Filtrado por tipo (ingreso/gasto) y período
- [x] Validación de datos en tiempo real

### ✅ Sistema de Categorías
- [x] Categorías predefinidas con íconos
- [x] Soporte para crear categorías personalizadas
- [x] Colores diferenciadores para mejor visualización
- [x] Gestión completa de categorías

### ✅ Interfaz y UX
- [x] Diseño Glassmorphism
- [x] Responsividad Mobile-First
- [x] Animaciones suaves
- [x] Interfaz intuitiva y accesible

---

## 🚀 Instalación y Uso Local

### Requisitos Previos
- **Node.js** versión 20+
- **npm** versión 10+
- **Angular CLI** (opcional pero recomendado)

### Pasos de Instalación

1. **Clona el repositorio:**
```bash
git clone https://github.com/gxtti70/front-finq.git
cd front-finq
```

2. **Instala las dependencias:**
```bash
npm install
```

3. **Configura las variables de entorno:**
   Crea un archivo `.env` en la raíz del proyecto:
```env
VITE_API_URL=http://localhost:8080
```

4. **Inicia el servidor de desarrollo:**
```bash
ng serve
```
o con Vite:
```bash
npm run dev
```

5. **Abre tu navegador en:**
   - http://localhost:4200 (Angular CLI)
   - http://localhost:5173 (Vite)

### Build para Producción
```bash
ng build --configuration production
# o
npm run build
```

---

## 📂 Estructura del Proyecto

```
src/
├── app/
│   ├── components/          # Componentes reutilizables
│   │   ├── dashboard/
│   │   ├── transactions/
│   │   └── categories/
│   ├── services/            # Servicios HTTP y lógica
│   │   ├── transaction.service.ts
│   │   ├── category.service.ts
│   │   └── api.service.ts
│   ├── models/              # Interfaces y tipos TypeScript
│   └── app.component.ts     # Componente raíz
├── assets/                  # Imágenes, fuentes, datos estáticos
└── main.ts                  # Punto de entrada
```

---

## 🎯 Checklist de Completitud

- [x] Dashboard funcional con resumen de finanzas
- [x] CRUD de transacciones
- [x] Sistema de categorías
- [x] Interfaz Glassmorphism
- [x] Diseño completamente responsivo
- [x] Integración con backend (API REST)
- [x] State management con Angular Signals
- [x] Validación de formularios
- [x] Interfaz de usuario intuitiva
- [x] Optimización de performance
- [x] **Proyecto completamente terminado**
- [ ] 🚀 **Despliegue en Vercel** (PRÓXIMO PASO)

---

## 🚀 Próximo Paso: Despliegue

El proyecto está listo para ser desplegado en **Vercel**. Solo necesita:

1. Conectar el repositorio a Vercel
2. Configurar las variables de entorno en la plataforma
3. Ejecutar el build automático
4. ¡Listo! La aplicación estará en vivo

---

## 🔗 Enlaces Relacionados

* **Backend API:** [back-finq](https://github.com/gxtti70/back-finq)
* **Documentación Angular:** https://angular.io
* **Documentación Tailwind CSS:** https://tailwindcss.com
* **Despliegue:** https://vercel.com

---

## 📄 Licencia

Este proyecto está bajo licencia **MIT**. Siéntete libre de usar, modificar y distribuir este código.

---

## 👤 Autor

**Santiago Muñoz** - Full Stack Developer Junior

* GitHub: [@gxtti70](https://github.com/gxtti70)
* Portfolio: [porta-front-ten.vercel.app](https://porta-front-ten.vercel.app)

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Si deseas mejorar este proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

<div align="center">
  <p>⭐ Si te gusta este proyecto, no olvides darle una estrella</p>
  <p>Hecho con ❤️ por Santiago Muñoz</p>
</div>
