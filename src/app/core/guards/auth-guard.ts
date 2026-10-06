import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) =>{
  const auth = inject(Auth);
  const router = inject(Router);

  return auth.isLoggedIn() ? true
    : router.createUrlTree(['/login'], {queryParams: { returnUrl: state.url}});
};
