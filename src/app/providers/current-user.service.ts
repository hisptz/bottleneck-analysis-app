import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClientService} from './http-client.service';

@Injectable()
export class CurrentUserService {

  constructor(private http: HttpClientService) { }

  getUserInformation(rootUrl): Observable <any> {
    return this.http.get(rootUrl + 'me.json?fields=id,name,displayName,created,lastUpdated,email,dataViewOrganisationUnits[id,name,level],userCredentials[username]')
  }

}
