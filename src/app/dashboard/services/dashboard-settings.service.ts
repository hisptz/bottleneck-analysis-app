import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DashboardSettingsService {
  private _dataStoreUrl: string;
  constructor(private httpClient: NgxDhis2HttpClientService) {
    this._dataStoreUrl = 'dataStore/dashboard-settings';
  }

  load() {
    return this.httpClient.manifest().pipe(
      mergeMap(() => {
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
      additionalAttributes: ['globalSelections'],
    };
    return this.httpClient
      .post(`${this._dataStoreUrl}/${namespace}`, dashboardSettings)
      .pipe(map(() => dashboardSettings));
  }
}
