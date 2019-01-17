import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { OrgUnit } from '../dashboard/modules/ngx-dhis2-data-selection-filter/modules/ngx-dhis2-org-unit-filter/models';

@Injectable({
  providedIn: 'root'
})
export class AppDatabaseService extends Dexie {
  organisationUnits: Dexie.Table<OrgUnit, string>;
  constructor() {
    super('dashboard');
    this.version(1).stores({ organisationUnits: 'id,name' });
  }
}
