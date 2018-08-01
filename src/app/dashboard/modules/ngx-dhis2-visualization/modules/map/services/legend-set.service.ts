import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@hisptz/ngx-dhis2-http-client';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LegendSetService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  getMapLegendSet(legendId: string): Observable<any> {
    const fields = [
      'id',
      'displayName~rename(name)',
      'legends[*,!created',
      '!lastUpdated',
      '!displayName',
      '!externalAccess',
      '!access',
      '!userGroupAccesses'
    ];
    const url = `legendSets/${legendId}.json?fields=${fields.join(',')}`;

    return this.httpClient.get(url);
  }

  getAllLegendSets(): Observable<any> {
    const fields = [
      'id',
      'displayName~rename(name)',
      'legends[*,!created',
      '!lastUpdated',
      '!displayName',
      '!externalAccess',
      '!access',
      '!userGroupAccesses'
    ];
    const url = `legendSets.json?fields=${fields.join(',')}&paging=false`;
    return this.httpClient.get(url);
  }
}
