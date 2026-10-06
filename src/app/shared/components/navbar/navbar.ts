import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IMPORT_ROLES } from '../../../core/models/role';
import { Auth } from '../../../core/services/auth';
import { HasRole } from '../../directives/has-role';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, HasRole],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  auth = inject(Auth);
  importRoles = IMPORT_ROLES;
}
