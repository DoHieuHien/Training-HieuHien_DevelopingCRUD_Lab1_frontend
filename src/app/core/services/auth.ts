import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Token } from './token';
import { LoginRequest, LoginResponse } from '../models/auth.model';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class Auth {
  private http = inject(HttpClient);
  private router = inject(Router);
  private tokenService = inject(Token);

  login(req: LoginRequest): Observable<LoginResponse>{
      return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, req).pipe(
        tap((res) => this.tokenService.save(res.token, {username: res.username, role: res.role})),
     );
  }

  logout(): void{
    this.tokenService.clear();
    this.router.navigate(["/login"]);
  }

  isLoggedIn(): boolean{
    const token= this.tokenService.getToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return !payload.exp || payload.exp * 1000 > Date.now();
    }
    catch {
      return false;
    }
  }

  getUsername(): string{
    return this.tokenService.getUser()?.username ?? '';
  }

  getRole(): string{
    return (this.tokenService.getUser()?.role ?? '').replace(/^ROLE_/, '').toUpperCase();
  }

  hasAnyRole(roles: string[]): boolean{
    return roles.includes(this.getRole());
  }
}
