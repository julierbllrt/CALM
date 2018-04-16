import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Observable} from "rxjs";
import 'rxjs/Rx';

@Injectable()
export class AuthenticationService {

  constructor(private http: Http) {}

  // save the token in localStorage and change the navbar state
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // get the token stored in localStorage and change the navbar state
  getToken(): any {
    return localStorage.getItem('token');
  }

  // delete the token in localStorage and change the navbar state
  logout(): void {
    localStorage.removeItem('token');
    location.reload();
  }

  // return true if the user is authenticate
  isLoggedIn(): boolean {
    var token = this.getToken();
    var payload;

    // Verify if token is present and if it's still valid
    if(token){
      payload = token.split('.')[1];
      payload = atob(payload);
      payload = JSON.parse(payload);

      return payload.exp > Date.now() / 1000;
      // Return false if token is expired
    }else{
      return false;
    }
  }

  currentUser() {
    if(this.isLoggedIn()){
      var token = this.getToken();
      var payload = token.split('.')[1];
      payload = atob(payload);
      payload = JSON.parse(payload);
      return (payload.email);
    }
  };

  currentUserId() {
    if(this.isLoggedIn()){
      var token = this.getToken();
      var payload = token.split('.')[1];
      payload = atob(payload);
      payload = JSON.parse(payload);
      return (payload._id);
    }
  };

  register(user, resp): Observable<any> {
    return this.http.post('https://localhost:3000/api/register', [user, resp])
      .map(res => res.json())
      .catch(error => {
        return Observable.throw(error.json());
      });
  }

  login(user): Observable<any> {
    return this.http.post('https://localhost:3000/api/login', user)
      .map(res => res.json())
      .catch(error => {
        return Observable.throw(error.json());
      });
  }

  getRequestOptions() {
    let header: Headers = new Headers();
    header.append('Authorization', "Bearer " + this.getToken());
    let options = new RequestOptions({headers: header});
    return options;
  }


}
