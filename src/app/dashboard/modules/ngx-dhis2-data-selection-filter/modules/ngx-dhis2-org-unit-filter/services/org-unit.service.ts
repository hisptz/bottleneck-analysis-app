import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import * as _ from 'lodash';
import { NgxDhis2HttpClientService } from '@hisptz/ngx-dhis2-http-client';
import { OrgUnit } from '../models';
import { OrgUnitFilterConfig } from '../models/org-unit-filter-config.model';

@Injectable({ providedIn: 'root' })
export class OrgUnitService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  loadAll(orgUnitFilterConfig: OrgUnitFilterConfig): Observable<OrgUnit[]> {
    return this.httpClient
      .get('me.json?fields=organisationUnits,dataViewOrganisationUnits')
      .pipe(
        mergeMap((userInfo: any) => {
          const userOrgUnits = _.map(
            [
              ...userInfo.organisationUnits,
              ...userInfo.dataViewOrganisationUnits
            ],
            orgUnit => orgUnit.id
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
                    5
                  )
                );
              })
            );
        })
      );
  }
}
