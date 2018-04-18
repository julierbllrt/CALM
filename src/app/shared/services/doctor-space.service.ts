import { Injectable } from '@angular/core';
import {Http} from "@angular/http";
import {Post} from "../models/post";
import {Observable} from "rxjs";
import {AuthenticationService} from "./authentication.service";
import {Consultation} from "../models/consultation";
import {Disponnibilite} from "../models/disponibilite";
import {environment} from "../../../environments/environment";

@Injectable()
export class DoctorSpaceService {
  url: string;

  constructor(private http: Http, private authentication: AuthenticationService) {
    this.url = environment.siteurl+'/api/';
  }

  getPatientFromDoctor(id: string) {
    return this.http.get(this.url + 'patientsdoctor/'+id, this.authentication.getRequestOptions())
      .map(res => res.json());
  }

  getConsultations(doctor_id: string) {
    return this.http.get(this.url + 'consultation/' + doctor_id, this.authentication.getRequestOptions())
      .map(res => res.json());
  }
  getConsultationOfThisDay(doctor_id: string, date: Date) {
    //console.log('trying to get consultation of a particular date time');
    const myFormatDate = date.getDate()+':'+(date.getMonth()+1)+':'+date.getFullYear()+':'+date.getHours()+':'+date.getMinutes();
    return this.http.get(this.url + 'consultation/date/' + doctor_id + '/' + myFormatDate, this.authentication.getRequestOptions())
      .map(res => res.json());
  }

  getDoctorByUserId(user_id: string) {
    return this.http.get(this.url + 'userToDoctor/' + user_id, this.authentication.getRequestOptions())
      .map(res => res.json());
  }

  addConsultation(consult: Consultation) {
    return this.http.put(this.url + 'consultation/', consult, this.authentication.getRequestOptions())
      .map(res => res);
  }

  getPatientByUserId(user_id: string) {
    return this.http.get(this.url + 'userToPatient/' + user_id, this.authentication.getRequestOptions())
      .map(res => res.json());
  }

  getDisponnibiliteOf(doctor_id: string) {
    return this.http.get(this.url + 'disponnibilite/doctor/' + doctor_id, this.authentication.getRequestOptions())
      .map(res => res.json());
  }

  getDisponnibilite(id: string) {
    return this.http.get(this.url + 'disponnibilite/' + id, this.authentication.getRequestOptions())
      .map(res => res.json());
  }

  getDisponnibiliteOfThisDay(date: Date, doctor_id: string) {
    const myFormatDate = date.getDate()+':'+(date.getMonth()+1)+':'+date.getFullYear()+':'+date.getHours()+':'+date.getMinutes();
    return this.http.get(this.url + 'disponnibilite/date/' + doctor_id + '/' + myFormatDate, this.authentication.getRequestOptions())
      .map(res => res.json());
  }

  addDisponnibilite(disp: Disponnibilite) {
    return this.http.put(this.url + 'disponnibilite/', disp, this.authentication.getRequestOptions())
      .map(res => res);
  }

  modifyDisponnibilite(disp: Disponnibilite) {
    return this.http.post(this.url + 'disponnibilite/', disp, this.authentication.getRequestOptions())
      .map(res => res);
  }


}
