import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';
import { ALL_ROLES, IMPORT_ROLES } from './core/models/role';
import { Login } from './features/auth/login/login';
import { Dashboard } from './features/dashboard/dashboard';
import { DetailData } from './features/detail-data/detail-data';
import { Forbidden } from './features/forbidden/forbidden';
import { ImportData } from './features/import-data/import-data';
import { ListData } from './features/list-data/list-data';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'forbidden', component: Forbidden },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      {
        path: 'import',
        component: ImportData,
        canActivate: [roleGuard],
        data: { roles: IMPORT_ROLES },
      },
      { path: 'list', component: ListData, canActivate: [roleGuard], data: { roles: ALL_ROLES } },
      {
        path: 'list/:id',
        component: DetailData,
        canActivate: [roleGuard],
        data: { roles: ALL_ROLES },
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
