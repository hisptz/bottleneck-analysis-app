import {Injectable} from "@angular/core";
import {Actions, Effect} from "@ngrx/effects";
import {DashboardService} from "../../services/dashboard.service";
import {Observable} from "rxjs";
import {Action} from "@ngrx/store";
import {UPDATE_DASHBOARD_ACTION, DashboardUpdatedAction} from "../actions";
@Injectable()
export class UpdateDashboardEffectService {
  constructor(
    private actions$: Actions,
    private dashboardService: DashboardService
  ) { }


  @Effect() dashboard$: Observable<Action> = this.actions$
    .ofType(UPDATE_DASHBOARD_ACTION)
    .switchMap(action => this.dashboardService.update(action.payload))
    .map(dashboardData => new DashboardUpdatedAction(dashboardData));

}
