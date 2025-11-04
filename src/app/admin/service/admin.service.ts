import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserStorageService } from 'src/app/services/storage/user-storage.service';

const BASIC_URL = 'http://localhost:8080/';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private http: HttpClient) {}

  addCategory(categoryDto: any): Observable<any> {
    // JSON request is fine to set Content-Type
    const headers = this.authJsonHeaders();
    return this.http.post(BASIC_URL + 'api/admin/category', categoryDto, { headers });
  }

  getAllCategories(): Observable<any> {
    const headers = this.authJsonHeaders();
    return this.http.get(BASIC_URL + 'api/admin', { headers });
  }

  addProduct(productFormData: FormData): Observable<any> {
    // IMPORTANT: no 'Content-Type' here
    const headers = this.authMultipartHeaders();
    return this.http.post(BASIC_URL + 'api/admin/product', productFormData, { headers });
  }

  /** For JSON requests */
  private authJsonHeaders(): HttpHeaders {
    const token = UserStorageService.getToken();
    const base = new HttpHeaders({ 'Content-Type': 'application/json' });
    return token ? base.set('Authorization', `Bearer ${token}`) : base;
  }

  /** For multipart/form-data requests */
  private authMultipartHeaders(): HttpHeaders {
    const token = UserStorageService.getToken();
    // DO NOT set Content-Type; the browser will set it with boundary
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }
}