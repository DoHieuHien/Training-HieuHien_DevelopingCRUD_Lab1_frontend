import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';

export const roleGuard: CanActivateFn =(route) =>{
  const auth = inject(Auth);
  const router = inject(Router);
  const allowed = (route.data['role'] as string[]) ?? [];

  return auth.hasAnyRole(allowed) ? true : router.createUrlTree(['/forbidden']);
};
