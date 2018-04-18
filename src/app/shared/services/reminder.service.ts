import { Injectable } from '@angular/core';
import {Http} from "@angular/http";
import {Post} from "../models/post";
import {Observable} from "rxjs";
import {AuthenticationService} from "./authentication.service";
import {environment} from "../../../environments/environment";

@Injectable()
export class ReminderService {

  constructor(private http: Http, private authentication: AuthenticationService) {
  }

  getRappel(userId: string) {
    console.log(userId);
    return this.http.get(environment.siteurl+'/api/getRappels/' + userId, this.authentication.getRequestOptions())
      .map(res => res.json());
  }

  reminderDone(reminderId: string) {
    console.log("i am here reminder service");
    return this.http.get(environment.siteurl+'/api/reminderDone/' + reminderId, this.authentication.getRequestOptions())
      .map(res => res.json());
  }


}
