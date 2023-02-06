import { FilesService } from './../services/files.service';
import { IonicService } from './../services/ionic.service';
import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { User } from '../interfaces/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private authService: AuthService, private router: Router,
    private filesService: FilesService,
    private ionicService: IonicService, private formBuilder: FormBuilder) { }

  loginForm: FormGroup = this.formBuilder.group({
    userCredentials: ['', Validators.required],
    password: ['', Validators.required]
  });

  login$!: Subscription;

  ngOnInit() {

  }

  login(): void {
    this.login$ = this.ionicService.obsShowLoading('Logged in to the app, please wait...').pipe(
      switchMap(() => {
        return this.authService.login(this.loginForm.getRawValue()).pipe(
          switchMap(data => {
            if(data.photo == 'user-default.png') {
              const defaultPhotoUrl = 'https://res.cloudinary.com/bion/image/upload/v1660870707/CRUD-MOBILE/user/user-default_mtme1j.png';
              const mappedUser: User = { ...data, photo: defaultPhotoUrl };
              this.authService.nextUsers(mappedUser);
              this.router.navigate(['/admin']);

              return this.ionicService.obsSuccessToast(`Welcome ${data.full_name}`).pipe(
                switchMap(() => {
                  return this.ionicService.obsDismissLoading();
                })
              )
            } else {
              return this.filesService.getUserPhoto(data.photo).pipe(
                switchMap(photo => {
                  const mappedUser: User = { photo: photo, ...data };
                  this.authService.nextUsers(mappedUser);
                  this.router.navigate(['/admin']);

                  return this.ionicService.obsSuccessToast(`Welcome ${data.full_name}`).pipe(
                    switchMap(() => {
                      return this.ionicService.obsDismissLoading();
                    })
                  )
                })
              )
            }
          }),
          catchError((e: any): any => {
            console.log(e);
            return this.ionicService.obsErrorToast('Invalid Username / Password').pipe(
              switchMap(() => {
                return this.ionicService.obsDismissLoading();
              })
            )
          }),
        )
      })
    ).subscribe()
  }

}
