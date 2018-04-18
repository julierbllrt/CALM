import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "./shared/services/authentication.service";
import {Router} from "@angular/router";
import {User} from "./shared/models/user";
import {UsersService} from "./shared/services/users.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app';
  isLogged: boolean; // if user is logged or not
  user= new User(null);
  image = require('./shared/img/logo_calm.png');
  

  constructor(private authenticationService: AuthenticationService,private router: Router, private usersService : UsersService) {}

  ngOnInit() {
    this.isLogged = this.authenticationService.isLoggedIn();
    if (this.isLogged) {
      this.getProfile();
    }
  }

  getProfile() {
    this.usersService.getProfile()
      .subscribe(user => {
        console.log("User received from API", user);
        this.user = new User(user);
      });
    //this.getAddress(this.user.address_id);
  }

  getAddress(address_id : string) {
       this.usersService.getAddressById(address_id)
         .subscribe(address => {
           this.user.address = address;
         })
     }

  logout() {
    this.authenticationService.logout();
    this.router.navigateByUrl('/');
    location.reload();
  }
}
