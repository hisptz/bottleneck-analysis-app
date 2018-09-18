import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import {
  NgxDhis2HttpClientService,
  ManifestService,
  Manifest
} from '@hisptz/ngx-dhis2-http-client';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { forkJoin, of, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardSettingsService {
  private _dataStoreUrl: string;
  constructor(
    private httpClient: NgxDhis2HttpClientService,
    private manifestService: ManifestService
  ) {
    this._dataStoreUrl = 'dataStore/dashboard-settings';
  }

  load() {
    return this.manifestService.getManifest().pipe(
      mergeMap((manifestObject: any) => {
        // const namespace =
        //   manifestObject &&
        //   manifestObject.activities &&
        //   manifestObject.activities.dhis
        //     ? manifestObject.activities.dhis.namespace
        //     : 'default';
        // TODO FIND DYNAMIC WAY TO GET DASHBOARD NAMESPACE
        const namespace = 'bna-dashboard';
        return this.httpClient.get(this._dataStoreUrl).pipe(
          mergeMap((dashboardSettingsList: Array<string>) => {
            return dashboardSettingsList.indexOf(namespace) !== -1
              ? this.httpClient
                  .get(`${this._dataStoreUrl}/${namespace}`)
                  .pipe(map((dashboardSettings: any) => dashboardSettings))
              : this.create(namespace);
          }),
          catchError((error: any) => {
            if (error.status !== 404) {
              return throwError(error);
            }

            return this.create(namespace);
          })
        );
      })
    );
  }

  create(namespace: string) {
    // TODO FIND A GENERIC WAY TO CREATE DASHBOARD PREFERENCES
    const dashboardSettings = {
      id: namespace,
      useDataStoreAsSource: true,
      allowAdditionalAttributes: true,
      additionalAttributes: ['globalSelections']
    };
    return this.httpClient
      .post(`${this._dataStoreUrl}/${namespace}`, dashboardSettings)
      .pipe(map(() => dashboardSettings));
  }
}
