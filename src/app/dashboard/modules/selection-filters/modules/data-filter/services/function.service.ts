import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import * as _ from 'lodash';
import { of, zip } from 'rxjs';
import { catchError, mergeMap, switchMap, tap } from 'rxjs/operators';
import { AppDatabaseService } from 'src/app/services/app-database.service';

import { FunctionObject } from '../models';

@Injectable({ providedIn: 'root' })
export class FunctionService {
  private _dataStoreUrl: string;
  constructor(
    private http: NgxDhis2HttpClientService,
    private appDatabaseService: AppDatabaseService
  ) {
    this._dataStoreUrl = 'dataStore/functions';
  }

  private _loadFromServer() {
    return this.http.get(this._dataStoreUrl).pipe(
      mergeMap((functionIds: Array<string>) =>
        zip(
          ..._.map(functionIds, (functionId: string) => this.load(functionId))
        ).pipe(catchError(() => of([])))
      ),
      catchError(() => of([]))
    );
  }

  loadAll() {
    return this.appDatabaseService.getAll('functions').pipe(
      catchError(() => of([])),
      switchMap((functions: FunctionObject[]) =>
        functions.length > 0
          ? of(functions)
          : this._loadFromServer().pipe(
              tap((functionsFromServer: FunctionObject[]) => {
                this.appDatabaseService
                  .saveBulk('functions', functionsFromServer)
                  .subscribe(() => {});
              })
            )
      )
    );
  }

  load(id: string) {
    return this.http.get(`${this._dataStoreUrl}/${id}`);
  }
}
