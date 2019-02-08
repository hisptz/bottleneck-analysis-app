import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';

import { NgxDhis2HttpClientService } from '@hisptz/ngx-dhis2-http-client';
import { AppDatabaseService } from 'src/app/services/app-database.service';
import { IndicatorGroup } from '../models';

@Injectable({ providedIn: 'root' })
export class IndicatorGroupService {
  constructor(
    private http: NgxDhis2HttpClientService,
    private appDatabaseService: AppDatabaseService
  ) {}

  loadAll() {
    return this.appDatabaseService.getAll('indicatorGroups').pipe(
      catchError(() => of([])),
      switchMap((indicatorGroups: IndicatorGroup[]) =>
        indicatorGroups.length > 0
          ? of(indicatorGroups)
          : this._loadFromApi().pipe(
              tap((indicatorGroupsFromServer: IndicatorGroup[]) => {
                this.appDatabaseService
                  .saveBulk('indicatorGroups', indicatorGroupsFromServer)
                  .subscribe(() => {});
              })
            )
      )
    );
  }

  private _loadFromApi() {
    return this.http
      .get('indicatorGroups.json?fields=id,name,indicators[id]&paging=false')
      .pipe(map(res => res.indicatorGroups || []));
  }
}
