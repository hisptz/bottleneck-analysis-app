import { Injectable } from '@angular/core';
import { Observable, defer, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import {
  InitializeDashboardGroupsAction,
  InitializeDashboardGroupsActionSuccess,
  SetActiveDashboardGroupsAction,
  SetActiveDashboardGroupsActionFail,
  DashboardGroupsActionTypes,
  DashboardGroupsActions
} from '../actions/dashboard-groups.action';
import { getCurrentDashboardId } from '../selectors';
import { SetCurrentDashboardAction } from '../actions/dashboard.actions';
import { map, catchError, switchMap, withLatestFrom } from 'rxjs/operators';

const GROUPS_PAYLOAD = [];

@Injectable()
export class DashboardGroupsEffects {
  @Effect()
  setCurrentDashboardGroup$: Observable<Action> = this.actions$.pipe(
    ofType<SetActiveDashboardGroupsAction>(
      DashboardGroupsActionTypes.SetActiveDashboardGroup
    ),
    withLatestFrom(this.store.select(getCurrentDashboardId)),
    map(
      ([action, dashboardId]: [SetActiveDashboardGroupsAction, string]) =>
        new SetCurrentDashboardAction(
          action.activeGroup.dashboards.includes(dashboardId)
            ? dashboardId
            : action.activeGroup.dashboards[0]
        )
    ),
    catchError(error => of(new SetActiveDashboardGroupsActionFail(error)))
  );

  @Effect()
  initializeDashboardGroups$: Observable<
    DashboardGroupsActions
  > = this.actions$.pipe(
    ofType<InitializeDashboardGroupsAction>(
      DashboardGroupsActionTypes.InitializeDashboardGroups
    ),
    switchMap(() => [
      new InitializeDashboardGroupsActionSuccess(
        GROUPS_PAYLOAD,
        GROUPS_PAYLOAD[0].id
      )
    ]),
    catchError(error => of(new SetActiveDashboardGroupsActionFail(error)))
  );

  // remember to put this at the end of all effects
  @Effect()
  init$: Observable<Action> = defer(() =>
    of(new InitializeDashboardGroupsAction())
  );
  constructor(private actions$: Actions, private store: Store<State>) {}
}
