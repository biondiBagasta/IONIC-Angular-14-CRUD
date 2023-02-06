import { User } from './../interfaces/user';
import { Subscription } from 'rxjs';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  constructor(private authService: AuthService) { }

  user$!: Subscription;
  user: User = {} as User;

  ngOnInit() {
    this.user$ = this.authService.users.subscribe(data => {
      this.user = data;
    })
  }

}
