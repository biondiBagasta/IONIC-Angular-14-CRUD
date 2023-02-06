import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageService } from './../services/local-storage.service';
import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginPageGuard implements CanLoad {
  constructor(private localStorageService: LocalStorageService, private router: Router){}
  canLoad(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const helper = new JwtHelperService();
      const storageData = this.localStorageService.getDataFromStorage('jwt-second');
      const isExpired = helper.isTokenExpired(storageData);
      if(isExpired == false) {
        this.router.navigate(['/admin']);
      }
      return true;
  }
}
