import { Injectable } from '@angular/core';
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import {AuthenticationService} from "./authentication.service";
import {environment} from "../../../environments/environment";

@Injectable()
export class MailService {
  url: string;

  constructor(private http: Http, private authentication: AuthenticationService) {
    this.url = environment.siteurl+'/api/';
  }

  sendTestMail() {
    console.log('From mailService : we call the API to send the mail.');
    return this.http.post(this.url + 'mail/test/', 'var useless', this.authentication.getRequestOptions())
      .map(res => res.json());
  }

  sendMail(to: string, subject: string, text: string) {
    console.log('From mailService : sending a mail.');
    return this.http.post(this.url + 'mail/', {to: to, subject: subject, text: text}, this.authentication.getRequestOptions())
      .map(res => res.json());
  }

}
