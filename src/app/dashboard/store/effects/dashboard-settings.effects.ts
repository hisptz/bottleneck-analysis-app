import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';

import { DashboardSettingsService } from '../../../services/dashboard-settings.service';

import * as fromDashboardSettingsActions from '../actions/dashboard-settings.action';
import * as fromUserActions from '../../../store/actions/user.actions';
import { LoadDataGroups } from '../../../store/actions/data-group.actions';

@Injectable()
export class DashboardSettingsEffects {
  constructor(
    private actions$: Actions,
    private dashboardSettingsService: DashboardSettingsService
  ) {}

  @Effect()
  currentUserLoaded$: Observable<any> = this.actions$.pipe(
    ofType(fromUserActions.UserActionTypes.AddCurrentUser),
    map(
      (action: fromUserActions.AddCurrentUser) =>
        new fromDashboardSettingsActions.LoadDashboardSettingsAction(
          action.currentUser,
          action.systemInfo
        )
    )
  );

  @Effect()
  loadDashboardSettings$: Observable<any> = this.actions$.pipe(
    ofType<fromDashboardSettingsActions.LoadDashboardSettingsAction>(
      fromDashboardSettingsActions.DashboardSettingsActionTypes
        .LoadDashboardSettings
    ),
    mergeMap(
      (action: fromDashboardSettingsActions.LoadDashboardSettingsAction) =>
        this.dashboardSettingsService.loadAll().pipe(
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
        new LoadDataGroups(
          action.dashboardSettings,
          action.currentUser,
          action.systemInfo
        )
    )
  );
}
