import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Token } from '../services/token';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(Token);
  const router = inject(Router);

  const token = tokenService.getToken();
  const authReq = token ? req.clone({setHeaders: {Authorization: `Bearer ${token}`}}) : req;

  return next(authReq).pipe(
    catchError((err :HttpErrorResponse) => {
      const isLoginCall = req.url.includes('/auth/login');
      if (err.status === 401 && isLoginCall){
        tokenService.clear();
        router.navigate(['/login']);
      } else if (err.status === 403){
        router.navigate(['/forbidden']);
      }
      return throwError(() => err);
      }),
  );

}
