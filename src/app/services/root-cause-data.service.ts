import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { filter, map, catchError } from 'rxjs/operators';

interface RootCauseDataStore {
  loaded: boolean;
  rootCauseDataIds: string[];
}

@Injectable({
  providedIn: 'root'
})
export class RootCauseDataService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  getIds(): Observable<string[]> {
    return this.httpClient
      .get(`dataStore/rca-data`)
      .pipe(catchError(() => of([])));
  }
}
