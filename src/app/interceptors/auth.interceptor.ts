import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  // Si hay token,clonamos la petición original y le inyectamos la cabecera 'Authorization'
  if (token) {
    const peticionClonada = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    // Mandamos la petición modificada hacia Spring Boot
    return next(peticionClonada);
  }

  return next(req);
};