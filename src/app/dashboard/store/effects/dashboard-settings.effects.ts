import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { DashboardSettingsService } from '../../services/dashboard-settings.service';
import { Observable, of } from 'rxjs';
import {
  DashboardSettingsActionTypes,
  AddDashboardSettingsAction,
  LoadDashboardSettingsFailAction,
  LoadDashboardSettingsAction,
  LoadDashboardsAction,
  InitializeDashboardSettingsAction
} from '../actions';
import {
  mergeMap,
  map,
  catchError,
  withLatestFrom,
  tap,
  filter,
  take
} from 'rxjs/operators';
import {
  UserActionTypes,
  AddCurrentUser,
  State,
  getCurrentUser
} from '../../../store';
import { Store } from '@ngrx/store';
import { User } from '../../../models';
import { DashboardSettingsState } from '../reducers';
import { getDashboardSettingsLoaded } from '../selectors';

@Injectable()
export class DashboardSettingsEffects {
  @Effect({ dispatch: false })
  initializeDashboardSettings$: Observable<any> = this.actions$.pipe(
    ofType(DashboardSettingsActionTypes.InitializeDashboardSettings),
    tap((action: InitializeDashboardSettingsAction) => {
      this.store
        .select(getDashboardSettingsLoaded)
        .pipe(take(1))
        .subscribe((loaded: boolean) => {
          if (!loaded) {
            this.rootStore
              .select(getCurrentUser)
              .subscribe((currentUser: User) => {
                if (currentUser) {
                  this.store.dispatch(
                    new LoadDashboardSettingsAction(currentUser)
                  );
                }
              });
          }
        });
    })
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
    private rootStore: Store<State>,
    private store: Store<DashboardSettingsState>,
    private dashboardSettingsService: DashboardSettingsService
  ) {}
}
