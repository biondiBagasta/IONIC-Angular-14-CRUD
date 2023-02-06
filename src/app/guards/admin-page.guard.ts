import { LocalStorageService } from './../services/local-storage.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminPageGuard implements CanLoad {
  constructor(private router: Router, private localStorageService: LocalStorageService){}
  canLoad(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const helper = new JwtHelperService();
      const storageData = this.localStorageService.getDataFromStorage('jwt-second');
      const isExpired = helper.isTokenExpired(storageData);
      if(isExpired == true || storageData == null) {
        this.router.navigate(['/login']);
      }
      return true;
  }
}
