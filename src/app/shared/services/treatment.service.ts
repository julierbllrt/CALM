import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {AuthenticationService} from './authentication.service';
import {Treatment} from '../models/treatment';
import {environment} from "../../../environments/environment";

@Injectable()
export class TreatmentService {
  constructor(private http: Http, private authentication: AuthenticationService) {
  }

  getUserTreatment(id: string): Observable<any> {
    return this.http.get(environment.siteurl+'/api/treatment/' + id, this.authentication.getRequestOptions())
      .map(res => res.json());
  }

  updateUserTreatment(id: string, updatedTreatment: Treatment): Observable<any> {
    console.log(updatedTreatment);
    return this.http.put(environment.siteurl+'/api/updateTreatment/' + id, updatedTreatment, this.authentication.getRequestOptions())
      .map(res => res.json());
  }

  getMedicamentList(medicName: string): Observable<any> {
    return this.http.get(environment.siteurl+'/api/getMedicName/' + medicName , this.authentication.getRequestOptions()).map(res => res.json());
  }

  deleteTreatment(id: string): Observable<any> {
    return this.http.delete(environment.siteurl+'/api/treatment/' + id, this.authentication.getRequestOptions())
      .map(res => res.json());
  }

  addTreatment(id: string, newTreatment: Treatment): Observable<any> {
    return this.http.put(environment.siteurl+'/api/treatment/' + id, newTreatment, this.authentication.getRequestOptions())
      .map(res => res.json());
  }

  getTreatmentInfo(codeCIS: string): Observable<any> {
    return this.http.get(environment.siteurl+'/api/getMedicInfo/' + codeCIS, this.authentication.getRequestOptions())
      .map(res => res.json());
  }

  getTreatmentInteraction(ids: string): Observable<any> {
    return this.http.get(environment.siteurl+'/api/getMedicInteraction/' + ids, this.authentication.getRequestOptions())
      .map(res => res.json());
  }

}
