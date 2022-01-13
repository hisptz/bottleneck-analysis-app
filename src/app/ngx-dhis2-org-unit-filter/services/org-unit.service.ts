import { Injectable } from "@angular/core";
import { NgxDhis2HttpClientService } from "@iapps/ngx-dhis2-http-client";
import { from, Observable, of } from "rxjs";
import { catchError, map, mergeMap, switchMap } from "rxjs/operators";

import { getOrgUnitUrls } from "../helpers/get-org-unit-urls.helper";
import { OrgUnitFilterConfig } from "../models/org-unit-filter-config.model";
import { OrgUnit } from "../models/org-unit.model";
import { DEFAULT_ORG_UNIT_FIELDS } from "../constants/default-org-unit-fields.constants";
import * as _ from "lodash";

@Injectable()
export class OrgUnitService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  loadAll(
    orgUnitFilterConfig: OrgUnitFilterConfig,
    userOrgUnits: string[]
  ): Observable<OrgUnit[]> {
    const pageSize = orgUnitFilterConfig.batchSize || 500;
    const orgUnitFields = _.join(
      _.uniq([
        ...DEFAULT_ORG_UNIT_FIELDS,
        ...(orgUnitFilterConfig.additionalQueryFields || []),
      ]),
      ","
    );
    console.log({userOrgUnits});
    return this.httpClient
      .get("organisationUnits.json", {
        useIndexDb: true,
        fetchOnlineIfNotExist: false,
      })
      .pipe(
        catchError(() => of({ organisationUnits: [] })),
        switchMap((indexDBResponse: any) => {
          const indexDBOrgUnits = indexDBResponse
            ? indexDBResponse.organisationUnits || []
            : [];

          return indexDBOrgUnits.length > 0
            ? of(indexDBOrgUnits)
            : this._getInitialOrgUnits(
                userOrgUnits,
                pageSize,
                orgUnitFilterConfig.minLevel,
                orgUnitFields
              ).pipe(
                mergeMap((orgUnitResponse: any) => {
                  const orgUnitLength =
                    orgUnitResponse && orgUnitResponse.pager
                      ? orgUnitResponse.pager.total
                      : 0;

                  if (orgUnitLength === 0) {
                    return of([]);
                  }

                  const pageCount = Math.ceil(orgUnitLength / pageSize);
                  return from(
                    getOrgUnitUrls(
                      userOrgUnits,
                      pageCount,
                      pageSize,
                      orgUnitFilterConfig.minLevel,
                      orgUnitFields
                    )
                  ).pipe(
                    mergeMap((orgUnitUrl: string, index: number) => {
                      return index === 0
                        ? of(orgUnitResponse.organisationUnits || [])
                        : this._loadOrgUnitsByUrl(orgUnitUrl);
                    })
                  );
                })
              );
        })
      );
  }

  private _getInitialOrgUnits(
    userOrgUnits: string[],
    pageSize: number,
    minLevel: number,
    orgUnitFields
  ) {
    return this.httpClient.get(
      "organisationUnits.json?fields=" +
        orgUnitFields +
        "&filter=path:ilike:" +
        userOrgUnits.join(";") +
        "&pageSize=" +
        pageSize +
        (minLevel ? "&filter=level:le:" + minLevel : ""),
      { useIndexDb: true }
    ).pipe(
      map((orgUnitResult: any) => {
        return {
          pager : orgUnitResult.pager || {},
          organisationUnits : _.sortBy(orgUnitResult.organisationUnits, ['level','name'])
        };
      })
    );
  }

  private _loadOrgUnitsByUrl(orgUnitUrl: string) {
    return this.httpClient
      .get(orgUnitUrl, {
        useIndexDb: true,
      })
      .pipe(
        map((orgUnitResult: any) => {
          return _.sortBy(orgUnitResult.organisationUnits, ['level','name']);
        })
      );
  }
}
