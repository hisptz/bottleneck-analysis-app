import { Injectable } from '@angular/core';
import {Actions, Effect} from "@ngrx/effects";
import {Action} from "@ngrx/store";
import {Observable} from "rxjs";
import {LOAD_DASHBOARDS_ACTION, DashboardsLoadedAction, ADD_DASHBOARD_ACTION, DashboardAddedAction} from "../actions";
import {DashboardService} from "../../services/dashboard.service";


@Injectable()
export class AddDashboardEffectService {

  constructor(
    private actions$: Actions,
    private dashboardService: DashboardService
  ) { }

  /**
   *
   * @type {Float32Array|wdpromise.Promise<T[]>|DashboardsLoadedAction[]|promise.Promise<any[]>|any|Int32Array}
   */
  @Effect() dashboards$: Observable<Action> = this.actions$
    .ofType(ADD_DASHBOARD_ACTION)
    .switchMap(action => this.dashboardService.add(action.payload))
    .map(dashboardData => new DashboardAddedAction(dashboardData));


}
