import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DataRecord {
  id: string;
  title: string;
  payload: Record<string, unknown>;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

@Injectable({ providedIn: 'root' })
export class Data {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/data`;

  list(page: number, size: number): Observable<Page<DataRecord>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<DataRecord>>(this.base, { params });
  }

  detail(id: string): Observable<DataRecord> {
    return this.http.get<DataRecord>(`${this.base}/${id}`);
  }

  import(file: File): Observable<{ message: string; count: number }> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<{ message: string; count: number }>(`${this.base}/import`, form);
  }

  export(): Observable<Blob> {
    return this.http.get(`${this.base}/export`, { responseType: 'blob' });
  }
}
