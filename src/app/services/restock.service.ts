import { baseUrl } from './../baseUrl';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Restock } from '../interfaces/restock';

@Injectable({
  providedIn: 'root'
})
export class RestockService {

  constructor(private http: HttpClient) { }

  findMany(): Observable<Restock[]> {
    return this.http.get<Restock[]>(`${baseUrl}/restock`, { withCredentials: true });
  }

  filter(data: string): Observable<Restock[]> {
    return this.http.get<Restock[]>(`${baseUrl}/restock/search?data=${data}`, { withCredentials: true });
  }

  filterByDate(start: Date, end: Date): Observable<Restock[]> {
    return this.http.get<Restock[]>(`${baseUrl}/restock/filter/date?start=${start}&end=${end}`, { withCredentials: true });
  }

  findUnique(id: number): Observable<Restock> {
    return this.http.get<Restock>(`${baseUrl}/restock/${id}`, { withCredentials: true });
  }

  create(data: Restock): Observable<Restock> {
    return this.http.post<Restock>(`${baseUrl}/restock`, data, { withCredentials: true });
  }

  update(id: number, data: Restock): Observable<Restock> {
    return this.http.put<Restock>(`${baseUrl}/restock/${id}`, data, { withCredentials: true });
  }
}
