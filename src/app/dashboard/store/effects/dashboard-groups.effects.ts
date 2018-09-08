import { Injectable } from '@angular/core';
import { Observable, defer, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, switchMap, withLatestFrom, tap } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { State } from '../../../store/reducers';

// actions
import * as fromDashboardActions from '../actions';

// selectors
import * as fromDashboardSelectors from '../selectors';

// TODO: Move this hardcoding to data store
const GROUPS_PAYLOAD = [];

@Injectable()
export class DashboardGroupsEffects {
  constructor(private actions$: Actions, private store: Store<State>) {}

  @Effect({ dispatch: false })
  setCurrentDashboardGroup$: Observable<any> = this.actions$.pipe(
    ofType<fromDashboardActions.SetActiveDashboardGroupsAction>(
      fromDashboardActions.DashboardGroupsActionTypes.SetActiveDashboardGroup
    ),
    withLatestFrom(
      this.store.select(fromDashboardSelectors.getCurrentDashboardId)
    ),
    tap(
      ([action, dashboardId]: [
        fromDashboardActions.SetActiveDashboardGroupsAction,
        string
      ]) => {
        const currentDashboardId = action.activeGroup.dashboards.includes(
          dashboardId
        )
          ? dashboardId
          : action.activeGroup.dashboards[0];
        if (currentDashboardId) {
          this.store.dispatch(
            new fromDashboardActions.SetCurrentDashboardAction(
              currentDashboardId
            )
          );
        }
      }
    )
  );

  @Effect()
  initializeDashboardGroups$: Observable<any> = this.actions$.pipe(
    ofType<fromDashboardActions.InitializeDashboardGroupsAction>(
      fromDashboardActions.DashboardGroupsActionTypes.InitializeDashboardGroups
    ),
    switchMap(() => [
      new fromDashboardActions.InitializeDashboardGroupsActionSuccess(
        GROUPS_PAYLOAD,
        GROUPS_PAYLOAD[0].id
      )
    ]),
    catchError(error =>
      of(new fromDashboardActions.SetActiveDashboardGroupsActionFail(error))
    )
  );

  // remember to put this at the end of all effects
  @Effect()
  init$: Observable<Action> = defer(() =>
    of(new fromDashboardActions.InitializeDashboardGroupsAction())
  );
}
