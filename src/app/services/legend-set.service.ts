import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { NgxDhis2HttpClientService } from '@hisptz/ngx-dhis2-http-client';
import { LegendSet } from '../models/legend-set.model';

@Injectable({ providedIn: 'root' })
export class LegendSetService {
  constructor(private http: NgxDhis2HttpClientService) {}

  // @todo update url to data store
  getLegendSets(): Observable<LegendSet[]> {
    const legendUrl = `dataStore/legendSets/configuration`;
    return new Observable(observer => {
      this.http.get(legendUrl).subscribe(
        (response: any) => {
          const legendSets = response.legendSets || [];
          observer.next(legendSets);
          observer.complete();
        },
        () => {
          const legendSets = [];
          this.http.post(legendUrl, { legendSets }).subscribe(
            () => {
              observer.next([]);
              observer.complete();
            },
            error => {
              observer.error(error);
            }
          );
        }
      );
    });
  }

  updateLegendSets(legendSets: LegendSet[]): Observable<any> {
    const legendUrl = `dataStore/legendSets/configuration`;
    return this.http.put(legendUrl, { legendSets });
  }
}
