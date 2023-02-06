import { baseUrl } from './../baseUrl';
import { Product } from './../interfaces/product';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileResponse } from '../interfaces/file-response';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  findMany(): Observable<Product[]> {
    return this.http.get<Product[]>(`${baseUrl}/product`, { withCredentials: true }).pipe(
      map(data => {

        return data
      })
    );
  }

  filter(data: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${baseUrl}/product/search?data=${data}`, { withCredentials: true });
  }

  findUnique(id: number): Observable<Product> {
    return this.http.get<Product>(`${baseUrl}/product/${id}`, { withCredentials: true });
  }

  create(data: Product): Observable<Product> {
    return this.http.post<Product>(`${baseUrl}/product`, data, { withCredentials: true });
  }

  update(id: number, data: Product): Observable<Product> {
    return this.http.put<Product>(`${baseUrl}/product/${id}`, data, { withCredentials: true });
  }

  updateRestockStock(id: number, stock: number): Observable<Product> {
    return this.http.put<Product>(`${baseUrl}/product/${id}`, { stock: stock }, { withCredentials: true });
  }

  delete(id: number): Observable<Product> {
    return this.http.delete<Product>(`${baseUrl}/product/${id}`, { withCredentials: true });
  }

  getProductImage(image: string): Observable<string> {
    return this.http.get<FileResponse>(`${baseUrl}/files/product/image/${image}`, { withCredentials: true }).pipe(
      map(data => {
        return data.fileUrl;
      }),
      take(1)
    );
  }

  uploadProductImage(image: FormData): Observable<FileResponse> {
    return this.http.post<FileResponse>(`${baseUrl}/files/product`, image, { withCredentials: true });
  }

  deleteProductImage(image: string): Observable<void> {
    return this.http.post<void>(`${baseUrl}/files/product/destroy/${image}`, {}, { withCredentials: true });
  }
}
