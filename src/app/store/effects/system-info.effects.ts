import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

import { SystemInfoService } from '@hisptz/ngx-dhis2-http-client';

import {
  AddSystemInfo,
  LoadSystemInfoFail,
  SystemInfoActionTypes
} from '../actions/system-info.actions';
import { LoadCurrentUser } from '../actions/user.actions';
import { getSanitizedSystemInfo } from '../../helpers';

@Injectable()
export class SystemInfoEffects {
  constructor(
    private actions$: Actions,
    private systemInfoService: SystemInfoService
  ) {}

  @Effect()
  loadSystemInfo$: Observable<any> = this.actions$.pipe(
    ofType(SystemInfoActionTypes.LoadSystemInfo),
    switchMap(() =>
      this.systemInfoService.getSystemInfo().pipe(
        map(
          (systemInfo: any) =>
            new AddSystemInfo(getSanitizedSystemInfo(systemInfo))
        ),
        catchError((error: any) => of(new LoadSystemInfoFail(error)))
      )
    )
  );

  @Effect()
  systemInfoLoaded$: Observable<any> = this.actions$.pipe(
    ofType(SystemInfoActionTypes.AddSystemInfo),
    map(() => new LoadCurrentUser())
  );
}
