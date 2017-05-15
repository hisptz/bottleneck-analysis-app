import { Injectable } from '@angular/core';
import {Actions, Effect} from "@ngrx/effects";
import {Action} from "@ngrx/store";
import {Observable} from "rxjs";
import {
  LOAD_DASHBOARDS_ACTION, DashboardsLoadedAction, ADD_DASHBOARD_ACTION, DashboardAddedAction,
  DashboardDeletedAction, DELETE_DASHBOARD_ACTION
} from "../actions";
import {DashboardService} from "../../services/dashboard.service";


@Injectable()
export class DeleteDashboardEffectService {

  constructor(
    private actions$: Actions,
    private dashboardService: DashboardService
  ) { }

  /**
   *
   * @type {Float32Array|wdpromise.Promise<T[]>|DashboardsLoadedAction[]|promise.Promise<any[]>|any|Int32Array}
   */
  @Effect() dashboards$: Observable<Action> = this.actions$
    .ofType(DELETE_DASHBOARD_ACTION)
    .switchMap(action => this.dashboardService.delete(action.payload))
    .map(dashboardData => new DashboardDeletedAction(dashboardData));


}
