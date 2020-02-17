import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import {
  mergeMap,
  map,
  catchError,
  tap,
  switchMap,
  filter,
  take,
} from 'rxjs/operators';

import { DashboardSettingsService } from '../../services/dashboard-settings.service';

import * as fromDashboardSettingsActions from '../actions/dashboard-settings.action';
import { Action, Store } from '@ngrx/store';
import { State, getCurrentUser, getSystemInfo } from '../../../store';
import { SystemInfo } from '../../../models';
import { User } from '@iapps/ngx-dhis2-http-client';
import { LoadDeterminants } from 'src/app/store/actions/determinant.actions';

@Injectable()
export class DashboardSettingsEffects {
  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private dashboardSettingsService: DashboardSettingsService
  ) {}

  @Effect({ dispatch: false })
  initializeDashboardSettings$: Observable<Action> = this.actions$.pipe(
    ofType<fromDashboardSettingsActions.InitializeDashboardSettingsAction>(
      fromDashboardSettingsActions.DashboardSettingsActionTypes
        .InitializeDashboardSettings
    ),
    tap(() => {
      this.store
        .select(getCurrentUser)
        .pipe(
          filter((currentUser: User) => currentUser !== null),
          switchMap((currentUser: User) =>
            this.store.select(getSystemInfo).pipe(
              filter((systemInfo: SystemInfo) => systemInfo !== null),
              map((systemInfo: SystemInfo) => {
                return { currentUser, systemInfo };
              })
            )
          ),
          take(1)
        )
        .subscribe((result: { currentUser: User; systemInfo: SystemInfo }) => {
          this.store.dispatch(
            new fromDashboardSettingsActions.LoadDashboardSettingsAction(
              result.currentUser,
              result.systemInfo
            )
          );
        });
    })
  );

  @Effect()
  loadDashboardSettings$: Observable<any> = this.actions$.pipe(
    ofType<fromDashboardSettingsActions.LoadDashboardSettingsAction>(
      fromDashboardSettingsActions.DashboardSettingsActionTypes
        .LoadDashboardSettings
    ),
    mergeMap(
      (action: fromDashboardSettingsActions.LoadDashboardSettingsAction) =>
        this.dashboardSettingsService.load().pipe(
          map(
            (dashboardSettings: any) =>
              new fromDashboardSettingsActions.AddDashboardSettingsAction(
                dashboardSettings,
                action.currentUser,
                action.systemInfo
              )
          ),
          catchError((error: any) =>
            of(
              new fromDashboardSettingsActions.LoadDashboardSettingsFailAction(
                error,
                action.currentUser
              )
            )
          )
        )
    )
  );

  @Effect()
  dashboardSettingsLoaded$: Observable<any> = this.actions$.pipe(
    ofType(
      fromDashboardSettingsActions.DashboardSettingsActionTypes
        .AddDashboardSettings
    ),
    map(
      (action: fromDashboardSettingsActions.AddDashboardSettingsAction) =>
        new LoadDeterminants(
          action.dashboardSettings,
          action.currentUser,
          action.systemInfo
        )
    )
  );
}
