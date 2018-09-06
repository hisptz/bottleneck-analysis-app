import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of, defer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

import { SystemInfoService } from '@hisptz/ngx-dhis2-http-client';

import {
  AddSystemInfo,
  LoadSystemInfoFail,
  SystemInfoActionTypes,
  LoadSystemInfo
} from '../actions/system-info.actions';
import { LoadCurrentUser } from '../actions/user.actions';
import { getSanitizedSystemInfo } from '../../helpers';
import { Action } from '@ngrx/store';

@Injectable()
export class SystemInfoEffects {
  constructor(
    private actions$: Actions,
    private systemInfoService: SystemInfoService
  ) {}

  @Effect()
  loadSystemInfo$: Observable<any> = this.actions$.pipe(
    ofType(SystemInfoActionTypes.LoadSystemInfo),
    switchMap(() => this.systemInfoService.getSystemInfo()),
    map(
      (systemInfo: any) => new AddSystemInfo(getSanitizedSystemInfo(systemInfo))
    ),
    catchError((error: any) => of(new LoadSystemInfoFail(error)))
  );

  @Effect()
  systemInfoLoaded$: Observable<Action> = this.actions$.pipe(
    ofType(SystemInfoActionTypes.AddSystemInfo),
    map((action: AddSystemInfo) => new LoadCurrentUser(action.systemInfo))
  );

  @Effect()
  init$: Observable<Action> = defer(() => of(new LoadSystemInfo()));
}
