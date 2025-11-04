import { Injectable } from '@angular/core';

const TOKEN = 'ecom-token';
const USER = 'ecom-user';

@Injectable({
  providedIn: 'root'
})
export class UserStorageService {

  constructor() { }

  public saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN);
    window.localStorage.setItem(TOKEN, token);
  }

  public saveUser(user: any): void {
    window.localStorage.removeItem(USER);
    window.localStorage.setItem(USER, JSON.stringify(user));
  }

  // Return type can be null if not set
  static getToken(): string | null {
    return localStorage.getItem(TOKEN);
  }

  static getUser(): any | null {
    const raw = localStorage.getItem(USER);
    return raw ? JSON.parse(raw) : null;
  }

  static getUserId(): string {
    const user = this.getUser();
    return user?.userId ?? '';
  }

  static getUserRole(): string {
    const user = this.getUser();
    return user?.role ?? '';
  }

  static isAdminLoggedIn(): boolean {
    // CALL the function, don’t reference it
    const token = this.getToken();
    if (!token) return false;

    const role = this.getUserRole();
    // Adjust if your backend stores roles as 'ROLE_ADMIN'
    return role === 'ADMIN' || role === 'ROLE_ADMIN';
  }

  static isCustomerLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const role = this.getUserRole();
    return role === 'CUSTOMER' || role === 'ROLE_CUSTOMER';
  }

  static signOut(): void {
    window.localStorage.removeItem(TOKEN);
    window.localStorage.removeItem(USER);
  }
}
