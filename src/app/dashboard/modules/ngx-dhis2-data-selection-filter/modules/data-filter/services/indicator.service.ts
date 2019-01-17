import { Injectable } from '@angular/core';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { NgxDhis2HttpClientService } from '@hisptz/ngx-dhis2-http-client';
import { AppDatabaseService } from 'src/app/services/app-database.service';
import { of } from 'rxjs';
import { Indicator } from '../model/indicator';

@Injectable({ providedIn: 'root' })
export class IndicatorService {
  constructor(
    private http: NgxDhis2HttpClientService,
    private appDatabaseService: AppDatabaseService
  ) {}

  loadAll() {
    return this.appDatabaseService.getAll('indicators').pipe(
      catchError(() => of([])),
      switchMap((indicators: Indicator[]) =>
        indicators.length > 0
          ? of(indicators)
          : this._loadFromApi().pipe(
              tap((indicatorsFromServer: Indicator[]) => {
                this.appDatabaseService
                  .saveBulk('indicators', indicatorsFromServer)
                  .subscribe(() => {});
              })
            )
      )
    );
  }

  private _loadFromApi() {
    return this.http
      .get('indicators.json?fields=id,name,code&paging=false')
      .pipe(map(res => res.indicators || []));
  }
}
