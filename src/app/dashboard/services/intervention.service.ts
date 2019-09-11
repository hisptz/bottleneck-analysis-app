import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import * as _ from 'lodash';
import { of, zip } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { getSanitizedInterventions } from '../helpers';
import { Intervention } from '../models/intervention.model';

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
        zip(
          ..._.map(interventionIds, (interventionId: string) =>
            this.http.get(`${this.dataStoreUrl}/${interventionId}`)
          )
        )
      ),
      catchError((error: any) =>
        error.status !== 404 ? of([]) : this.getPredifinedInterventions()
      )
    );
  }

  getPredifinedInterventions() {
    return this.loadPredefinedInterventions().pipe(
      switchMap((interventions: any[]) => {
        return zip(
          ..._.map(
            getSanitizedInterventions(interventions),
            (sanitizedIntervention: Intervention) =>
              this.createIntervention(sanitizedIntervention)
          )
        );
      })
    );
  }

  loadPredefinedInterventions() {
    return this.http
      .get('predefined-metadata.json', { isExternalLink: true })
      .pipe(
        map((res: any) => res.dashboards || []),
        catchError(() => of([]))
      );
  }

  createIntervention(intervention: Intervention) {
    return this.http
      .post(`${this.dataStoreUrl}/${intervention.id}`, intervention)
      .pipe(map(() => intervention));
  }

  updateIntervention(intervention: Intervention) {
    return this.http.put(
      `${this.dataStoreUrl}/${intervention.id}`,
      _.omit(intervention, ['showEditForm', 'showDeleteDialog', 'deleting'])
    );
  }

  deleteIntervention(id: string) {
    return this.http.delete(`${this.dataStoreUrl}/${id}`);
  }
}
