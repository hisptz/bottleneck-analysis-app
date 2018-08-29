import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { NgxDhis2HttpClientService } from '@hisptz/ngx-dhis2-http-client';
import { switchMap, catchError, map } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { Intervention } from '../store/models/intervention.model';

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

  createIntervention(intervention: Intervention) {
    return this.http.post(
      `${this.dataStoreUrl}/${intervention.id}`,
      intervention
    );
  }

  updateIntervention(intervention: Intervention) {
    return this.http.put(
      `${this.dataStoreUrl}/${intervention.id}`,
      _.omit(intervention, ['showEditForm'])
    );
  }

  deleteIntervention(id: string) {
    return this.http.delete(`${this.dataStoreUrl}/${id}`);
  }
}
