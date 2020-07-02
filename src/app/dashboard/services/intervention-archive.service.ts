import { Injectable } from '@angular/core';
import {
  NgxDhis2HttpClientService,
  ErrorMessage,
} from '@iapps/ngx-dhis2-http-client';
import { InterventionArchive } from '../models/intervention-archive.model';
import { map, switchMap, catchError, mergeMap } from 'rxjs/operators';
import { of, throwError, zip } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InterventionArchiveService {
  private dataStoreNamespace = 'dataStore/intervention-archives';
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  save(interventionArchive: InterventionArchive) {
    return this.findOne(interventionArchive.id).pipe(
      mergeMap((interventionArchiveFromServer) => {
        return !interventionArchiveFromServer
          ? this.httpClient.post(
              `${this.dataStoreNamespace}/${interventionArchive.id}`,
              interventionArchive
            )
          : this.httpClient.put(
              `${this.dataStoreNamespace}/${interventionArchive.id}`,
              interventionArchive
            );
      })
    );
  }

  findOne(id: string) {
    return this.httpClient
      .get(`${this.dataStoreNamespace}/${id}`)
      .pipe(
        catchError((error: ErrorMessage) =>
          error.status === 404 ? of(null) : throwError(error)
        )
      );
  }

  findByIntervention(interventionId: string) {
    return this.httpClient.get(this.dataStoreNamespace).pipe(
      catchError(() => of([])),
      mergeMap((interventionArchiveIds: string[]) => {
        const filteredInterventionArchiveIds = interventionArchiveIds.filter(
          (id) => id.indexOf(interventionId) !== -1
        );

        return zip(
          ...filteredInterventionArchiveIds.map((id) => this.findOne(id))
        );
      })
    );
  }
}
