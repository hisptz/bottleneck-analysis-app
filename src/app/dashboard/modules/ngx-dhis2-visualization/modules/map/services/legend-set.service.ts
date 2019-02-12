import { throwError as observableThrowError, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LegendSetService {
  constructor(private httpClient: HttpClient) {}

  getMapLegendSet(legendId: string) {
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
    const url = `../../../api/legendSets/${legendId}.json?fields=${fields.join(',')}`;

    return this.httpClient.get(url).pipe(catchError((error: any) => observableThrowError(error.json())));
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
      '!userGroupAccesses'
    ];
    const url = `../../../api/legendSets.json?fields=${fields.join(',')}&paging=false`;
    return this.httpClient.get(url).pipe(catchError((error: any) => observableThrowError(error.json())));
  }
}
