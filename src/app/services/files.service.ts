import { baseUrl } from './../baseUrl';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';

interface FileResponse {
  fileUrl: string;
  fileName: string;
}

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  constructor(private http: HttpClient) { }

  uploadUserPhoto(image: FormData): Observable<FileResponse> {
    return this.http.post<FileResponse>(`${baseUrl}/files/user`, image, { withCredentials: true });
  }

  getUserPhoto(image: string): Observable<string> {
    return this.http.get<FileResponse>(`${baseUrl}/files/user/photo/${image}`, { withCredentials: true }).pipe(
      map(data => {
        return data.fileUrl
      }),
      take(1)
    )
  }

  deleteUserPhoto(image: string): Observable<void> {
    return this.http.post<void>(`${baseUrl}/files/user/destroy/${image}`, {}, { withCredentials: true });
  }
}
