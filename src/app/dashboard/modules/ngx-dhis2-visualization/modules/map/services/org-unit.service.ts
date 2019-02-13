
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';


@Injectable()
export class OrgUnitService {
  constructor(private httpClient: HttpClient) {}

  getOrganisationUnitGroupSets(uid: string): Observable<any> {
    return this.httpClient
      .get(
        `../../../api/organisationUnitGroupSets/${uid}.json?fields=organisationUnitGroups%5Bid,displayShortName~rename(name),symbol%5D&_dc=1516105315642`
      )
      .pipe(catchError((error: any) => observableThrowError(error.json())));
  }
}
