import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, switchMap, catchError, tap } from 'rxjs/operators';

import * as systemInfoActions from '../actions/system-info.action';
import * as fromServices from '../../services';

@Injectable()
export class SystemInfoEffects {
  constructor(private actions$: Actions, private systemInfoService: fromServices.SystemService) {}

  @Effect({ dispatch: false })
  addContextPath$ = this.actions$.pipe(
    ofType(systemInfoActions.ADD_CONTEXT_PATH),
    tap((action: systemInfoActions.AddContectPath) => {
      this.systemInfoService.getSystemInfo().subscribe(info => {
        localStorage.setItem('contextPath', info['contextPath']);
        localStorage.setItem('version', info['version']);
        localStorage.setItem('spatialSupport', info['databaseInfo']['spatialSupport']);
      });
    })
  );
}
