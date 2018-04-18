import { Injectable } from '@angular/core';
import {Http} from "@angular/http";
import {Post} from "../models/post";
import {Observable} from "rxjs";
import {AuthenticationService} from "./authentication.service";
import {Autorisation} from "../models/autorisation";
import {environment} from "../../../environments/environment";

@Injectable()
export class AutorisationService {
  url: string;

  constructor(private http: Http, private authentication: AuthenticationService) {
    this.url = environment.siteurl+'/api/';
  }

  addAutorisation(autorisation: Autorisation) {
    return this.http.put(this.url + 'autorisation/', autorisation, this.authentication.getRequestOptions())
      .map(res => res);
  }
  getPostAutorisation(user_id: string) {
    // trier pour avoir que les types = post
    return this.http.get(this.url + 'autorisation/post/' + user_id, this.authentication.getRequestOptions())
      .map(res => res.json());
  }
  getRdvAutorisation(user_id: string) {
    return this.http.get(this.url + 'autorisation/rdv/' + user_id, this.authentication.getRequestOptions())
      .map(res => res.json());
  }

  getAutorisations(user_id: string) {
    return this.http.get(this.url + 'autorisation/' + user_id, this.authentication.getRequestOptions())
      .map(res => res.json());
  }

  getAutorisationDemands(user_id: string) {
    return this.http.get(this.url + 'autorisation/demand/' + user_id, this.authentication.getRequestOptions())
      .map(res => res.json());
  }
  deleteAutorisation(id: string) {
    return this.http.delete(this.url + 'autorisation/' + id, this.authentication.getRequestOptions())
      .map(res => res);
  }

  acceptAutorisation(demand_id: string) {
    return this.http.get(this.url + 'autorisation/accept/' + demand_id, this.authentication.getRequestOptions())
      .map(res => res.json());
  }

  refuseAutorisation(demand_id: string) {
    return this.http.get(this.url + 'autorisation/refuse/' + demand_id, this.authentication.getRequestOptions())
      .map(res => res.json());
  }
  getObserver(user_id: string) {
    return this.http.get(this.url + 'autorisation/getObserver/' + user_id, this.authentication.getRequestOptions())
      .map(res => res.json());
  }
  getSupervisor(user_id: string) {
    return this.http.get(this.url + 'autorisation/getSupervisor/' + user_id, this.authentication.getRequestOptions())
      .map(res => res.json());
  }


}
