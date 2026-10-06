import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HasRole } from '../../shared/directives/has-role';
import { Auth } from '../../core/services/auth';
import { IMPORT_ROLES } from '../../core/models/role';

@Component({
  imports: [RouterLink, HasRole],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  auth = inject(Auth);
  importRoles = IMPORT_ROLES;
}
