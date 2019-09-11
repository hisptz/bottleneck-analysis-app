import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { map, mergeMap, tap, catchError } from 'rxjs/operators';
import * as _ from 'lodash';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { OrgUnit } from '../models';
import { OrgUnitFilterConfig } from '../models/org-unit-filter-config.model';
import { AppDatabaseService } from 'src/app/services/app-database.service';

@Injectable({ providedIn: 'root' })
export class OrgUnitService {
  constructor(
    private httpClient: NgxDhis2HttpClientService,
    private appDatabaseService: AppDatabaseService
  ) {}

  loadFromServer(
    orgUnitFilterConfig: OrgUnitFilterConfig
  ): Observable<OrgUnit[]> {
    return this.httpClient
      .get('me.json?fields=organisationUnits,dataViewOrganisationUnits')
      .pipe(
        mergeMap((userInfo: any) => {
          const userOrgUnits = _.uniq(
            _.map(
              [
                ...userInfo.organisationUnits,
                ...userInfo.dataViewOrganisationUnits
              ],
              orgUnit => orgUnit.id
            )
          );
          return this.httpClient
            .get(
              'organisationUnits.json?fields=!:all&paging=false&filter=path:ilike:' +
                userOrgUnits.join(';') +
                (orgUnitFilterConfig.minLevel
                  ? '&filter=level:le:' + orgUnitFilterConfig.minLevel
                  : '')
            )
            .pipe(
              map((res: any) => res && res.organisationUnits.length),
              mergeMap((orgUnitLength: number) => {
                const pageSize = 5000;
                const pageCount = Math.ceil(orgUnitLength / pageSize);
                return from(
                  _.map(
                    _.range(1, pageCount + 1),
                    pageNumber =>
                      'organisationUnits.json?fields=id,name,level,created,lastUpdated,' +
                      'path&page=' +
                      pageNumber +
                      '&pageSize=' +
                      pageSize +
                      '&order=level:asc&filter=path:ilike:' +
                      userOrgUnits.join(';')
                  )
                ).pipe(
                  mergeMap(
                    (orgUnitUrl: string) =>
                      this.httpClient
                        .get(orgUnitUrl)
                        .pipe(
                          map(
                            (orgUnitResult: any) =>
                              orgUnitResult.organisationUnits
                          )
                        ),
                    null,
                    1
                  )
                );
              })
            );
        })
      );
  }

  loadAll(orgUnitFilterConfig: OrgUnitFilterConfig): Observable<OrgUnit[]> {
    return this.appDatabaseService.getAll('organisationUnits').pipe(
      catchError(() => of([])),
      mergeMap((orgUnits: OrgUnit[]) =>
        orgUnits.length > 0
          ? of(orgUnits)
          : this.loadFromServer(orgUnitFilterConfig).pipe(
              tap((orgUnitsFromServer: OrgUnit[]) => {
                this.appDatabaseService
                  .saveBulk('organisationUnits', orgUnitsFromServer)
                  .subscribe(() => {});
              })
            )
      )
    );
  }
}
