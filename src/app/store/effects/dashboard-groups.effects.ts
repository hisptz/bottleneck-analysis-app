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
import {
  map,
  catchError,
  switchMap,
  withLatestFrom,
  tap
} from 'rxjs/operators';

// TODO: Move this hardcoding to data store
const GROUPS_PAYLOAD = [
  {
    id: 'Xm4TNggmC8J',
    name: 'Uncomplicated Malaria Diagnosis (OPD)',
    dashboards: [
      'nmcp-malaria_tFidynXMnDn',
      'nmcp-malaria_lUCZ9Rq344R',
      'nmcp-malaria_OMJ5l5Ic0C1',
      'nmcp-malaria_gLUc5SJjoXS'
    ]
  },
  {
    id: 'kquEMGaUMyn',
    name: 'Malaria Testing',
    dashboards: [
      'nmcp-malaria_emcZaaBYQ4j',
      'nmcp-malaria_n0ff9qrTqH9',
      'nmcp-malaria_kUMDv9RGdyq',
      'nmcp-malaria_jtK9L4yyaSL'
    ]
  },
  {
    id: 'HOzTDHYZwiE',
    name: 'Malaria Commodities (Pharm)',
    dashboards: [
      'nmcp-malaria_xfv6fKNeNuL',
      'nmcp-malaria_ElPSNI3mFf0',
      'nmcp-malaria_uDbJGRmnoPQ',
      'nmcp-malaria_Jj2trBJvOeG'
    ]
  },
  {
    id: 'AKVXOZUiE12',
    name: 'Severe Malaria Morbidity and Mortality (IPD)',
    dashboards: [
      'nmcp-malaria_UuyjEPGdeLK',
      'nmcp-malaria_nc6YfIQ4SRZ',
      'nmcp-malaria_nbDajKsJ2gG',
      'nmcp-malaria_W17wZSERoeB'
    ]
  },
  {
    id: 'dCBBM28wKfV',
    name: 'Preventive services (RCH)',
    dashboards: [
      'nmcp-malaria_skeLgxeb6HD',
      'nmcp-malaria_k6x9Pvvpt9u',
      'nmcp-malaria_uyOGOweH1bX',
      'nmcp-malaria_KhfYVW3ye34'
    ]
  },
  {
    id: 'BXEq47PU58f',
    name: 'Accountability Tool',
    dashboards: ['nmcp-malaria_azp3dWWf8dw']
  },
  {
    id: 'DoSVwKTsNvZ',
    name: 'MSDQI',
    dashboards: [
      'nmcp-malaria_LTxG4cBXA5z',
      'nmcp-malaria_XIr3W6qZ2rm',
      'nmcp-malaria_vKoaF1ObPE1',
      'nmcp-malaria_VweVuqTIC7X',
      'nmcp-malaria_iTrpiuF4ipk',
      'nmcp-malaria_BwfRHTu8rDc',
      'nmcp-malaria_jJjlmwGr0cG'
    ]
  }
];

@Injectable()
export class DashboardGroupsEffects {
  @Effect({ dispatch: false })
  setCurrentDashboardGroup$: Observable<any> = this.actions$.pipe(
    ofType<SetActiveDashboardGroupsAction>(
      DashboardGroupsActionTypes.SetActiveDashboardGroup
    ),
    withLatestFrom(this.store.select(getCurrentDashboardId)),
    tap(([action, dashboardId]: [SetActiveDashboardGroupsAction, string]) => {
      const currentDashboardId = action.activeGroup.dashboards.includes(
        dashboardId
      )
        ? dashboardId
        : action.activeGroup.dashboards[0];
      if (currentDashboardId) {
        this.store.dispatch(new SetCurrentDashboardAction(currentDashboardId));
      }
    })
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
