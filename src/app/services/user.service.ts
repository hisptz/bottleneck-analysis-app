import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { Observable, zip } from 'rxjs';
import { map } from 'rxjs/operators';

import { isSuperUser } from '../dashboard/helpers';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  /**
   * Load current user information
   * @returns {Observable<User>}
   */
  loadCurrentUser(): Observable<User> {
    return zip(
      this.httpClient.get(
        'me.json?fields=id,name,displayName,created,lastUpdated,' +
          'email,dataViewOrganisationUnits[id,name,level],organisationUnits' +
          '[id,name,level],userCredentials[username],userGroups[id,name]'
      ),
      this.httpClient.get('me/authorization')
    ).pipe(
      map((currentUserResults: any[]) => {
        return {
          ...currentUserResults[0],
          authorities: currentUserResults[1],
          isSuperUser: isSuperUser(currentUserResults[1])
        };
      })
    );
  }
}
