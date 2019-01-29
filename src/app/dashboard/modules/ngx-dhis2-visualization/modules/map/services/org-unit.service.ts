import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@hisptz/ngx-dhis2-http-client';

@Injectable({ providedIn: 'root' })
export class OrgUnitService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  getOrganisationUnitGroupSets(uid: string): Observable<any> {
    return this.httpClient.get(
      `organisationUnitGroupSets/${uid}.json?fields=organisationUnitGroups%5Bid,displayShortName~rename(name),symbol%5D&_dc=1516105315642`
    );
  }
}
