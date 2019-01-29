import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { OrgUnit } from '../dashboard/modules/ngx-dhis2-data-selection-filter/modules/ngx-dhis2-org-unit-filter/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppDatabaseService extends Dexie {
  constructor() {
    super('dashboard');
    this.version(1).stores({
      organisationUnits: 'id',
      organisationUnitLevels: 'id',
      organisationUnitGroups: 'id',
      indicators: 'id',
      indicatorGroups: 'id',
      functions: 'id'
    });
  }

  getAll(schemaName: string): Observable<any> {
    return new Observable(observer => {
      this.table(schemaName)
        .toArray()
        .then(
          (orgUnits: OrgUnit[]) => {
            observer.next(orgUnits);
            observer.complete();
          },
          (error: any) => {
            observer.next(error);
          }
        );
    });
  }

  saveBulk(schemaName: string, data: any[]): Observable<any[]> {
    return new Observable(observer => {
      this.table(schemaName)
        .bulkPut(data)
        .then(
          () => {
            observer.next(data);
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
    });
  }
}
