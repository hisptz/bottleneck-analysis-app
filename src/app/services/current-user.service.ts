import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {Http, Response} from "@angular/http";

@Injectable()
export class CurrentUserService {

  constructor(private http: Http) { }

  getUserInformation(): Observable <any> {
    return this.http.get('../../../api/me.json?fields=*,dataViewOrganisationUnits[id,name,level],organisationUnits[id,name,level]')
      .map((response: Response) => response.json())
      .catch(error => Observable.throw(new Error(error)));
  }

}
