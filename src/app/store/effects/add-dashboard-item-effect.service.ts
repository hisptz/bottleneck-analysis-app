import { Injectable } from '@angular/core';
import {Actions, Effect} from "@ngrx/effects";
import {Action} from "@ngrx/store";
import {Observable} from "rxjs";
import {
  DashboardItemAddedAction, ADD_DASHBOARD_ITEM_ACTION
} from "../actions";
import {DashboardService} from "../../services/dashboard.service";


@Injectable()
export class AddDashboardItemEffectService {

  constructor(
    private actions$: Actions,
    private dashboardService: DashboardService
  ) { }

  /**
   *
   * @type {promise.Promise<any[]>|DashboardItemAddedAction[]|Int8Array|Int32Array|any|Uint8Array}
   */
  @Effect() dashboards$: Observable<Action> = this.actions$
    .ofType(ADD_DASHBOARD_ITEM_ACTION)
    .switchMap(action => this.dashboardService.addItem(action.payload))
    .map(dashboard => new DashboardItemAddedAction(dashboard));


}
