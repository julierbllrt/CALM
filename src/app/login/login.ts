/**
 * Created by Romain on 15/03/2017.
 */
import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {Router} from '@angular/router';
import {User} from '../shared/models/user';
import {AuthenticationService} from '../shared/services/authentication.service';


@Component({
  selector: 'login-page',
  templateUrl: 'login.html',
  styleUrls: ['login.css']
})
export class LoginComponent implements OnInit{
  user = new User(null);
  submitted: boolean = false;

  constructor(private router: Router, private authentication: AuthenticationService){}

  ngOnInit() {

  }


  // signin the new user if signup successfully
  login(){
    this.authentication.login(this.user)
      .subscribe(
        res => {
          this.submitted = true;
          this.authentication.saveToken(res.token);
          this.router.navigate(['/profile']);
          location.reload(); // permet de recharger la page en se servant du cache
        }
      );
  }


}








