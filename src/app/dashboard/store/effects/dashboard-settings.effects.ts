import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { DashboardSettingsService } from '../../services/dashboard-settings.service';
import { Observable, of } from 'rxjs';
import {
  DashboardSettingsActionTypes,
  AddDashboardSettingsAction,
  LoadDashboardSettingsFailAction,
  LoadDashboardSettingsAction,
  LoadDashboardsAction
} from '../actions';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { UserActionTypes, AddCurrentUser } from '../../../store';

@Injectable()
export class DashboardSettingsEffects {
  @Effect()
  currentUserLoaded$: Observable<any> = this.actions$.pipe(
    ofType(UserActionTypes.AddCurrentUser),
    map(
      (action: AddCurrentUser) =>
        new LoadDashboardSettingsAction(action.currentUser)
    )
  );

  @Effect()
  loadDashboardSettings$: Observable<any> = this.actions$.pipe(
    ofType(DashboardSettingsActionTypes.LoadDashboardSettings),
    mergeMap((action: LoadDashboardSettingsAction) =>
      this.dashboardSettingsService.loadAll().pipe(
        map(
          (dashboardSettings: any) =>
            new AddDashboardSettingsAction(
              dashboardSettings,
              action.currentUser
            )
        ),
        catchError((error: any) =>
          of(new LoadDashboardSettingsFailAction(error, action.currentUser))
        )
      )
    )
  );

  @Effect()
  dashboardSettingsLoaded$: Observable<any> = this.actions$.pipe(
    ofType(DashboardSettingsActionTypes.AddDashboardSettings),
    map(
      (action: AddDashboardSettingsAction) =>
        new LoadDashboardsAction(action.currentUser, action.dashboardSettings)
    )
  );

  constructor(
    private actions$: Actions,
    private dashboardSettingsService: DashboardSettingsService
  ) {}
}
