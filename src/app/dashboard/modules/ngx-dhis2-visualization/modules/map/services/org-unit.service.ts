import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class OrgUnitService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  getOrganisationUnitGroupSets(uid: string): Observable<any> {
    return this.httpClient
      .get(
        `organisationUnitGroupSets/${uid}.json?fields=organisationUnitGroups%5Bid,displayShortName~rename(name),symbol%5D&_dc=1516105315642`
      )
      .pipe(catchError((error: any) => observableThrowError(error.json())));
  }
}
