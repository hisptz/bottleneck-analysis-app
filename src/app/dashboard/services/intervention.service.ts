import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { NgxDhis2HttpClientService } from '@hisptz/ngx-dhis2-http-client';
import { switchMap, catchError } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterventionService {
  dataStoreUrl: string;
  constructor(private http: NgxDhis2HttpClientService) {
    this.dataStoreUrl = 'dataStore/bna-intervention';
  }

  getInterventions() {
    return this.http.get(this.dataStoreUrl).pipe(
      switchMap((interventionIds: string[]) =>
        forkJoin(
          _.map(interventionIds, (interventionId: string) =>
            this.http.get(`${this.dataStoreUrl}/${interventionId}`)
          )
        )
      ),
      catchError(() => of([]))
    );
  }
}
