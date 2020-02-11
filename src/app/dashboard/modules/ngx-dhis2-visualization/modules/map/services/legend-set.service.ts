import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { throwError as observableThrowError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class LegendSetService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  getMapLegendSet(legendId: string) {
    const fields = [
      'id',
      'displayName~rename(name)',
      'legends[*,!created',
      '!lastUpdated',
      '!displayName',
      '!externalAccess',
      '!access',
      '!userGroupAccesses',
    ];
    const url = `legendSets/${legendId}.json?fields=${fields.join(',')}`;

    return this.httpClient
      .get(url)
      .pipe(catchError((error: any) => observableThrowError(error.json())));
  }

  getAllLegendSets() {
    const fields = [
      'id',
      'displayName~rename(name)',
      'legends[*,!created',
      '!lastUpdated',
      '!displayName',
      '!externalAccess',
      '!access',
      '!userGroupAccesses',
    ];
    const url = `legendSets.json?fields=${fields.join(',')}&paging=false`;
    return this.httpClient
      .get(url)
      .pipe(catchError((error: any) => observableThrowError(error.json())));
  }
}
