import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import * as _ from 'lodash';
import { of, zip } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FunctionService {
  private _dataStoreUrl: string;
  constructor(private http: NgxDhis2HttpClientService) {
    this._dataStoreUrl = 'dataStore/functions';
  }

  loadAll() {
    return this.http.get(this._dataStoreUrl).pipe(
      mergeMap((functionIds: Array<string>) =>
        zip(
          ..._.map(functionIds, (functionId: string) => this.load(functionId))
        ).pipe(catchError(() => of([])))
      ),
      catchError(() => of([]))
    );
  }

  load(id: string) {
    return this.http.get(`${this._dataStoreUrl}/${id}`);
  }
}
