import { Injectable } from '@angular/core';
import { Observable, defer, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  InitializeDashboardGroupsAction,
  InitializeDashboardGroupsActionSuccess,
  SetActiveDashboardGroupsAction,
  SetActiveDashboardGroupsActionFail,
  DashboardGroupsActionTypes,
  DashboardGroupsActions
} from '../actions/dashboard-groups.action';
import { SetCurrentDashboardAction } from '../actions/dashboard.actions';
import { map, catchError, switchMap } from 'rxjs/operators';

const GROUPS_PAYLOAD = [
  {
    id: 'Xm4TNggmC8J',
    name: 'Malaria Burden Reduction Bulletin',
    dashboards: ['who-malaria_sLldHZZgnFx', 'who-malaria_zMdUF7qxNEt', 'who-malaria_QT4gSejEGCE']
  },
  {
    id: 'bxI7Q1agaN5',
    name: 'Malaria Elimination Bulletin',
    dashboards: ['who-malaria_b8F1kKlV9Fk', 'who-malaria_aBVHnhMvdEO']
  }
];

@Injectable()
export class DashboardGroupsEffects {
  @Effect()
  setCurrentDashBoard$: Observable<Action> = this.actions$.pipe(
    ofType<SetActiveDashboardGroupsAction>(DashboardGroupsActionTypes.SetActiveDashboardGroup),
    map(({ activeGroup }) => new SetCurrentDashboardAction(activeGroup.dashboards[0])),
    catchError(error => of(new SetActiveDashboardGroupsActionFail(error)))
  );

  @Effect()
  initializeDashboardGroups$: Observable<DashboardGroupsActions> = this.actions$.pipe(
    ofType<InitializeDashboardGroupsAction>(DashboardGroupsActionTypes.InitializeDashboardGroups),
    switchMap(() => [new InitializeDashboardGroupsActionSuccess(GROUPS_PAYLOAD, GROUPS_PAYLOAD[0].id)]),
    catchError(error => of(new SetActiveDashboardGroupsActionFail(error)))
  );

  // remember to put this at the end of all effects
  @Effect()
  init$: Observable<Action> = defer(() => of(new InitializeDashboardGroupsAction()));
  constructor(private actions$: Actions) {}
}
