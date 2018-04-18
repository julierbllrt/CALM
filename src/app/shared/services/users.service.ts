/**
 * Created by Romain on 08/03/2017.
 */
import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {User} from "../models/user";
import {Observable} from "rxjs";
import {AuthenticationService} from './authentication.service';
import {Address} from "../models/address";
import {environment} from "../../../environments/environment";

@Injectable()
export class UsersService {
  url: string;

  constructor(private http: Http, private authentication: AuthenticationService) {
    this.url = environment.siteurl+'/api/';
  }

  // Get all users from the API
  getUsers() {
    return this.http.get(this.url + 'users', this.authentication.getRequestOptions())
      .map(res => res.json());
  }

  getUser(id: string) {
    return this.http.get(environment.siteurl+'/api/user/' + id, this.authentication.getRequestOptions())
      .map(res => res.json());
  }

  deleteUser(id: string): Observable<void> {
    if (this.authentication.currentUserId() === id) {
      this.authentication.logout();
    }
    return this.http.delete(this.url + 'users/' + id, this.authentication.getRequestOptions())
      .map(res => console.log("Users Service : delete user code : " + res));
  }

  deleteAddress(id : string) : Observable<void> {
    return this.http.delete(this.url + 'addresses/' + id, this.authentication.getRequestOptions())
      .map(res => console.log("Users Service : delete address code : " + res));
  }

  getProfile() {
    return this.http.get(this.url + 'profile', this.authentication.getRequestOptions())
      .map(res => res.json());
  }

  getAddressById(id : string) {
    return this.http.get(this.url + 'addresses/' + id, this.authentication.getRequestOptions())
      .map(res => res.json());
  }

  getAddresses() {
    return this.http.get(this.url + 'addresses', this.authentication.getRequestOptions())
      .map(res => res.json());
  }

  getDoctors() {
    return this.http.get(this.url + 'doctors', this.authentication.getRequestOptions())
      .map(res => res.json());
  }

}
