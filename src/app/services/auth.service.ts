import { FilesService } from './files.service';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';
import { IonicService } from './ionic.service';
import { take, tap, catchError, switchMap } from 'rxjs/operators';
import { baseUrl } from './../baseUrl';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, ReplaySubject } from 'rxjs';
import { User } from '../interfaces/user';
import { JwtHelperService } from "@auth0/angular-jwt";

export interface LoginCredentials {
  userCredentials: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private filesService: FilesService,
    private ionicService: IonicService, private router: Router,
    private localStorageService: LocalStorageService) {

      const helper = new JwtHelperService();
      const storageData = this.localStorageService.getDataFromStorage('jwt-second');

      if(storageData != null) {
        const isExpired = helper.isTokenExpired(storageData);
        const decodedToken = helper.decodeToken(storageData);

        if(isExpired == false) {
          this.refreshToken(decodedToken.id).pipe(
            switchMap(user => {
              if(user.photo == 'user-default.png') {
                const defaultPhotoUrl = 'https://res.cloudinary.com/bion/image/upload/v1660870707/CRUD-MOBILE/user/user-default_mtme1j.png';
                const mappedUser: User = { ...user, photo: defaultPhotoUrl };
                this._users.next(mappedUser);
                return of();
              } else {
                return this.filesService.getUserPhoto(user.photo).pipe(
                  tap(photo => {
                    const mappedUser: User = { ...user, photo: photo };
                    this._users.next(mappedUser);
                  })
                )
              }
            })
          ).subscribe();
        }
      }
  }

  private _users = new ReplaySubject<User>(1);

  login(data: LoginCredentials): Observable<User> {
    return this.http.post<User>(`${baseUrl}/auth/login`, data, { withCredentials: true }).pipe(
      tap(data => {
        this._users.next(data);
        this.localStorageService.saveDataToStorage('jwt-second', data.jwt);
      }),
      take(1)
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${baseUrl}/auth/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.localStorageService.removeDataFromStorage('jwt-second');
      })
    );
  }

  refreshToken(id: number): Observable<User> {
    return this.http.get<User>(`${baseUrl}/auth/authenticated/refresh/${id}`, { withCredentials: true }).pipe(
      tap(data => {
        this.localStorageService.removeDataFromStorage('jwt-second');
        this.localStorageService.saveDataToStorage('jwt-second', data.password);
      }),
      take(1)
    )
  }

  get users(): Observable<User> {
    return this._users.asObservable();
  }

  nextUsers(user: User): void {
    this._users.next(user);
  }
}
