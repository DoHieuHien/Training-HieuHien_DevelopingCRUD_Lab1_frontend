import { Injectable } from '@angular/core';

const TOKEN_KEY = 'access_token';
const USER_KEY = "user_info";

@Injectable({ providedIn: 'root'})
export class Token {
  getToken():  string|null{
    return localStorage.getItem(TOKEN_KEY);
  }

  save(token: string, user: {username: string; role: string}): void{
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getUser() : { username: string; role: string}|null{
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  clear(): void{
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}
