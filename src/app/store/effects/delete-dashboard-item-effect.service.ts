import { Injectable } from '@angular/core';
import {Actions, Effect} from "@ngrx/effects";
import {Action} from "@ngrx/store";
import {Observable} from "rxjs";
import {
  DashboardsLoadedAction, DashboardItemDeletedAction, DELETE_DASHBOARD_ITEM_ACTION
} from "../actions";
import {DashboardService} from "../../services/dashboard.service";


@Injectable()
export class DeleteDashboardItemEffectService {

  constructor(
    private actions$: Actions,
    private dashboardService: DashboardService
  ) { }

  /**
   *
   * @type {Float32Array|wdpromise.Promise<T[]>|DashboardsLoadedAction[]|promise.Promise<any[]>|any|Int32Array}
   */
  @Effect() dashboards$: Observable<Action> = this.actions$
    .ofType(DELETE_DASHBOARD_ITEM_ACTION)
    .switchMap(action => this.dashboardService.deleteItem(action.payload))
    .map(dashboardData => new DashboardItemDeletedAction(dashboardData));


}
