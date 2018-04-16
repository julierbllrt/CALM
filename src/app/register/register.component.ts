import {Component, OnInit, ChangeDetectorRef, NgModule, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../shared/services/authentication.service';
import {User} from "../shared/models/user";
import {Address} from '../shared/models/address';
import {GooglemapsService} from "../shared/services/googlemaps.service";
import {MailService} from "../shared/services/mail.service";
import {ReCaptchaComponent} from 'angular2-recaptcha';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})



export class RegisterComponent implements OnInit {
  @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;
  user = new User(null);
  submitted: boolean = true;

  lat: number = 50.6315144;
  lng: number = 3.056218;
  zoom: number = 8;
  numberFetchAddressTry: number = 0;

  //private base64textString:string;

  constructor(private router: Router, private authentication: AuthenticationService,
              private googlemapsService: GooglemapsService,
              private mailService: MailService) { }

  ngOnInit() {
  }

  /*handleFileSelect(evt){
    var files = evt.target.files;
    var file = files[0];

    if (files && file) {
      var reader = new FileReader();
      reader.onload =this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
      console.log(file);
    }
  }

  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.base64textString= btoa(binaryString);
  }*/

  displayAddress() {
    if (this.numberFetchAddressTry < 8 && this.numberFetchAddressTry > 5) {
      console.log('fetch the coord of the address');
      const add = this.user.address.num.toString() + this.user.address.street_address + this.user.address.city;
      this.googlemapsService.convertAddresstoCode(add)
        .subscribe( resp => {
          console.log(resp);
          console.log(resp.results[0].geometry.location);
          this.user.address.latitude = resp.results[0].geometry.location.lat;
          this.user.address.longitude = resp.results[0].geometry.location.lng;
          // on cree un marker
          console.log(this.user);
        });
    }
    this.numberFetchAddressTry ++;
  }

  // signin the new user if signup successfully
  login(email: string, password: string) {
    this.user.password = password;
    this.user.email = email;
    this.authentication.login(this.user)
      .subscribe(
        res => {
          this.submitted = true;
          this.authentication.saveToken(res.token);

          // envoi mail de confirmation
          const confText = "Bonjour, \n\nPour confirmer votre inscription au site CALM, veuillez vérifier votre adresse mail en vous " +
            "rendant sur cette page :" + ", nous vous remercions de votre confiance.\n" +
            "Prenez votre premier rendez-vous grâce à CALM ! \n\n Cordialement, \n\n CALM";
          this.mailService.sendMail(this.user.email, "[CALM] Confirmation d'inscription", confText)
            .subscribe( resp => {
              console.log(resp);
              this.login(this.user.email, this.user.password);
              this.router.navigate(['/profile']);
              location.reload();
            });
        });
  }

  // create the new user
  register() {
    let resp = this.captcha.getResponse();
    this.authentication.register(this.user, resp)
      .subscribe(
        res => {
          if (res.response === "Failed") {
            alert("Please check the captcha before clicking");
          }
          else {
            this.submitted = true;
            this.login(this.user.email, this.user.password);
            this.router.navigate(['/profile']);
            location.reload();
          }
        });
    this.submitted = false;
  }
}










