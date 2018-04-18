import { Injectable } from '@angular/core';
import {Http, RequestOptions, Headers} from "@angular/http";
import {AuthenticationService} from "./authentication.service";
import {Observable} from "rxjs";
import {Patient} from "../models/patient";
import {Doctor} from "../models/doctor";
import {Autorisation} from "../models/autorisation";
import {User} from "../models/user";
import {Post} from "../models/post";
import {environment} from "../../../environments/environment";

@Injectable()
export class MedicalFileService {
  url: string;

  constructor(private http: Http, private authentication: AuthenticationService) {
    this.url = environment.siteurl+'/api/';
  }


  getCurrentPatient() {
    return this.http.get(this.url + 'patients/' + this.authentication.currentUserId(), this.authentication.getRequestOptions())
      .map(res => res.json());
  }

  getUserByEmail(email: string) {
    return this.http.get(this.url + 'users/byEmail/' + email, this.authentication.getRequestOptions())
      .map(res => res.json());
  }
  getUserById(id: string) {
    return this.http.get(this.url + 'users/' + id, this.authentication.getRequestOptions())
      .map(res => res.json());
  }

  addGeneralDoctor(doctor: Doctor, id: string) {
    //console.log('id of the patient: ', id);
    return this.http.put(this.url + 'patient/' + id, doctor, this.authentication.getRequestOptions())
      .map(res => res);
  }

  getPosts(sender_id: string, receiver_id: string) {
    return this.http.get(this.url + 'post/' + sender_id + '/' + receiver_id, this.authentication.getRequestOptions())
      .map(res => res.json());
  }
  addPost(post: Post) {
    return this.http.post(this.url + 'post', post, this.authentication.getRequestOptions())
      .map(res => res);
  }
}
