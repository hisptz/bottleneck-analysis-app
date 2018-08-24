import { Injectable } from '@angular/core';
import { Observable, defer, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  InitializeDashboardGroupsAction,
  SetActiveDashboardGroupsAction,
  SetActiveDashboardGroupsActionFail,
  DashboardGroupsActionTypes
} from '../actions/dashboard-groups.action';
import { SetCurrentDashboardAction } from '../actions/dashboard.actions';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class DashboardGroupsEffects {
  @Effect()
  setCurrentDashBoard$: Observable<Action> = this.actions$.pipe(
    ofType<SetActiveDashboardGroupsAction>(DashboardGroupsActionTypes.SetActiveDashboardGroup),
    map(({ activeGroup }) => new SetCurrentDashboardAction(activeGroup.dashboards[0])),
    catchError(error => of(new SetActiveDashboardGroupsActionFail(error)))
  );
  // remember to put this at the end of all effects
  @Effect()
  init$: Observable<Action> = defer(() => {
    return of(new InitializeDashboardGroupsAction());
  });
  constructor(private actions$: Actions) {}
}
