import { Injectable } from '@angular/core';
import {Actions, Effect} from "@ngrx/effects";
import {Action} from "@ngrx/store";
import {Observable} from "rxjs";
import {LOAD_DASHBOARDS_ACTION, DashboardsLoadedAction} from "../actions";
import {DashboardService} from "../../services/dashboard.service";


@Injectable()
export class LoadDashboardsEffectService {

  constructor(
    private actions$: Actions,
    private dashboardService: DashboardService
  ) { }

  /**
   *
   * @type {Float32Array|wdpromise.Promise<T[]>|DashboardsLoadedAction[]|promise.Promise<any[]>|any|Int32Array}
   */
  @Effect() dashboards$: Observable<Action> = this.actions$
    .ofType(LOAD_DASHBOARDS_ACTION)
    .switchMap(() => this.dashboardService.loadAll())
    .map(dashboardData => new DashboardsLoadedAction(dashboardData.dashboards));


}
