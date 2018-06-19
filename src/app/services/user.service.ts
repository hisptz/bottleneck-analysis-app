import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from 'ngx-dhis2-http-client';
import { Observable } from 'rxjs/index';
import { User } from '../models/user.model';

@Injectable({providedIn: 'root'})
export class UserService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  loadCurrentUser(): Observable<User> {
    return this.httpClient
      .get(`me.json?fields=id,name,displayName,created,lastUpdated,email,
    dataViewOrganisationUnits[id,name,level],organisationUnits[id,name,level],userCredentials[username]`);
  }
}
