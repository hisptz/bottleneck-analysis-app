import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { NgxDhis2HttpClientService, ManifestService, Manifest } from '@hisptz/ngx-dhis2-http-client';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardSettingsService {
  constructor(private httpClient: NgxDhis2HttpClientService, private manifestService: ManifestService) {}

  loadAll() {
    return this.manifestService.getManifest().pipe(
      mergeMap((manifestObject: any) => {
        // const namespace =
        //   manifestObject &&
        //   manifestObject.activities &&
        //   manifestObject.activities.dhis
        //     ? manifestObject.activities.dhis.namespace
        //     : 'default';
        // TODO FIND DYNAMIC WAY
        const namespace = 'who-malaria';
        return this.httpClient.get('dataStore/dashboard-settings').pipe(
          mergeMap((dashboardSettingsList: Array<string>) => {
            return dashboardSettingsList.indexOf(namespace) !== -1
              ? this.httpClient.get(`dataStore/dashboard-settings/${namespace}`).pipe(
                  map((dashboardSettings: any) => dashboardSettings),
                  catchError((error: any) => of(null))
                )
              : of(null);
          }),
          catchError((error: any) => of(null))
        );
      }),
      catchError((error: any) => of(null))
    );
  }
}
