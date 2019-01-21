import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { NgxDhis2HttpClientService } from '@hisptz/ngx-dhis2-http-client';
import { switchMap, catchError, map } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { Intervention } from '../models/intervention.model';
import { getSanitizedInterventions } from '../helpers';

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
      catchError((error: any) =>
        error.status !== 404 ? of([]) : this.generatePredifinedInterventions()
      )
    );
  }

  generatePredifinedInterventions() {
    return this.loadPredefinedInterventions().pipe(
      switchMap((interventions: any[]) => {
        return forkJoin(
          _.map(
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
      .get('config/default-interventions.json', { useRootUrl: true })
      .pipe(catchError(() => of([])));
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
