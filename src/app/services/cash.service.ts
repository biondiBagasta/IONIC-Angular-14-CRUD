import { baseUrl } from './../baseUrl';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cash } from '../interfaces/cash';

@Injectable({
  providedIn: 'root'
})
export class CashService {

  constructor(private http: HttpClient) { }

  findUnique(): Observable<Cash> {
    return this.http.get<Cash>(`${baseUrl}/cash/1`, { withCredentials: true });
  }

  update(total: string): Observable<Cash> {
    return this.http.put<Cash>(`${baseUrl}/cash/1`, { total: total }, { withCredentials: true });
  }
}
