import { Component, OnInit } from '@angular/core';
import { PocketBaseService } from '../core/services/pocketbase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
  email:string ='';
  password:string ='';

  constructor(
    private pocketBaseService: PocketBaseService,
    private router: Router
  ) { }

  ngOnInit() {
    this.pocketBaseService.authStateChanged$.subscribe(authState => {
      console.log(authState);
      if (authState) {
        this.router.navigate(['/', 'notes']);
      }
    });
  }

  onSignUp() {
    console.log('email', this.email);
    console.log('password', this.password);
    this.pocketBaseService.signUp(this.email, this.password).then(res => {
      this.router.navigate(['/', 'notes']);
    });
  }

  onSignIn() {
    console.log('email', this.email);
    console.log('password', this.password);
    this.pocketBaseService.signIn(this.email, this.password).then(res => {
      this.router.navigate(['/', 'notes']);
    });
  }
}
