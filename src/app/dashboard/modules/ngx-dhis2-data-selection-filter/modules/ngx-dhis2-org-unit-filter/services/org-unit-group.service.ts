import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { OrgUnitGroup } from '../models';
import { AppDatabaseService } from 'src/app/services/app-database.service';

@Injectable({ providedIn: 'root' })
export class OrgUnitGroupService {
  constructor(
    private httpClient: NgxDhis2HttpClientService,
    private appDatabaseService: AppDatabaseService
  ) {}

  loadFromServer() {
    return this.httpClient
      .get(`organisationUnitGroups.json?fields=id,name&paging=false`)
      .pipe(map((res: any) => res.organisationUnitGroups || []));
  }

  loadAll(): Observable<OrgUnitGroup[]> {
    return this.appDatabaseService.getAll('organisationUnitGroups').pipe(
      catchError(() => of([])),
      switchMap((orgUnitGroups: OrgUnitGroup[]) =>
        orgUnitGroups.length > 0
          ? of(orgUnitGroups)
          : this.loadFromServer().pipe(
              tap((orgUnitGroupsFromServer: OrgUnitGroup[]) => {
                this.appDatabaseService
                  .saveBulk('organisationUnitGroups', orgUnitGroupsFromServer)
                  .subscribe(() => {});
              })
            )
      )
    );
  }
}
