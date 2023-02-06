import { baseUrl } from './../baseUrl';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Supplier } from '../interfaces/supplier';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  constructor(private http: HttpClient) { }

  findMany(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${baseUrl}/supplier`, { withCredentials: true });
  }

  filter(data: string): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${baseUrl}/supplier/search?data=${data}`, { withCredentials: true });
  }

  findUnique(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(`${baseUrl}/supplier/${id}`, { withCredentials: true });
  }

  create(data: Supplier): Observable<Supplier> {
    return this.http.post<Supplier>(`${baseUrl}/supplier`, data, { withCredentials: true });
  }

  update(id: number, data: Supplier): Observable<Supplier> {
    return this.http.put<Supplier>(`${baseUrl}/supplier/${id}`, data, { withCredentials: true });
  }

  delete(id: number): Observable<Supplier> {
    return this.http.delete<Supplier>(`${baseUrl}/supplier/${id}`, { withCredentials: true });
  }
}
