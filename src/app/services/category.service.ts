import { baseUrl } from './../baseUrl';
import { Category } from './../interfaces/category';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) {

  }

  findMany(): Observable<Category[]> {
    return this.http.get<Category[]>(`${baseUrl}/category`, { withCredentials: true });
  }

  paginate(page: number): Observable<Category[]> {
    return this.http.get<Category[]>(`${baseUrl}/category/paginate?page=${page}`, { withCredentials: true });
  }

  count(): Observable<number> {
    return this.http.get<number>(`${baseUrl}/category/count`, { withCredentials: true });
  }

  filter(data: string): Observable<Category[]> {
    return this.http.get<Category[]>(`${baseUrl}/category/search?data=${data}`, { withCredentials: true });
  }

  findUnique(id: number): Observable<Category> {
    return this.http.get<Category>(`${baseUrl}/category/${id}`, { withCredentials: true });
  }

  create(data: Category): Observable<Category> {
    return this.http.post<Category>(`${baseUrl}/category`, data, { withCredentials: true });
  }

  update(id: number, data: Category): Observable<Category> {
    return this.http.put<Category>(`${baseUrl}/category/${id}`, data, { withCredentials: true });
  }

  delete(id: number): Observable<Category> {
    return this.http.delete<Category>(`${baseUrl}/category/${id}`, { withCredentials: true });
  }
}
