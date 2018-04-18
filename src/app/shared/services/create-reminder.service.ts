import { Injectable } from '@angular/core';
import {Http} from "@angular/http";
import {Post} from "../models/post";
import {Observable} from "rxjs";
import {AuthenticationService} from "./authentication.service";
import {environment} from "../../../environments/environment";

@Injectable()
export class CreateReminderService {

  constructor(private http: Http, private authentication: AuthenticationService) {
  }

  createFirstReminder(treatment: string[]) {


    var treatement = [{
      takingState: "Avant-repas",
      quantity: 10,
      frequence: 1,
      typeFrequence: "jours",
      info: "Comprimé aspirine 500mg",
      name: "Aspirine",
      codeCIS: "42",
      start: new Date(),
      end: new Date().setDate(25),
      userId: "5a098f391f982053ef3665b3",
      _id: "5a0b0936fecaf0101d591ff9"
    }];
    return this.http.put(environment.siteurl+'/api/createFirstRappel/', treatement, this.authentication.getRequestOptions())
      .map(res => res.json());
  }
  createNextReminder(treatmentId: string) {
    return this.http.put(environment.siteurl+'/api/createNextRappel/', this.authentication.getRequestOptions())
      .map(res => res.json());
  }
}

