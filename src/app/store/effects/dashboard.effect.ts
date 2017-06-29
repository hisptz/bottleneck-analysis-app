import {Injectable} from '@angular/core';
import {DashboardService} from '../../providers/dashboard.service';
import {Actions, Effect} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import {
  CREATE_DASHBOARD_ACTION, DashboardCreatedAction, DashboardDeletedAction, DashboardEditedAction,
  DashboardRezisedAction,
  DashboardsLoadedAction,
  DELETE_DASHBOARD_ACTION, EDIT_DASHBOARD_ACTION,
  ErrorOccurredAction,
  LOAD_DASHBOARDS_ACTION, RESIZE_DASHBOARD_ACTION
} from '../actions';
import {Action} from '@ngrx/store';
@Injectable()
export class DashboardEffect {
  constructor(
    private actions$: Actions,
    private dashboardService: DashboardService
  ) {}

  @Effect() dashboards$: Observable<Action> = this.actions$
    .ofType(LOAD_DASHBOARDS_ACTION)
    .switchMap(action => this.dashboardService.loadAll(action.payload))
    .map(dashboards => new DashboardsLoadedAction(dashboards))
    .catch((error) => Observable.of(new ErrorOccurredAction(error)));

  @Effect() createDashboard$: Observable<Action> = this.actions$
    .ofType(CREATE_DASHBOARD_ACTION)
    .switchMap(action => this.dashboardService.create(action.payload))
    .map(dashboard => new DashboardCreatedAction(dashboard))
    .catch((error) => Observable.of(new ErrorOccurredAction(error)));

  @Effect() editDashboard$: Observable<Action> = this.actions$
    .ofType(EDIT_DASHBOARD_ACTION)
    .switchMap(action => this.dashboardService.edit(action.payload))
    .map(dashboard => new DashboardEditedAction(dashboard))
    .catch((error) => Observable.of(new ErrorOccurredAction(error)));

  @Effect() deleteDashboard$: Observable<Action> = this.actions$
    .ofType(DELETE_DASHBOARD_ACTION)
    .switchMap(action => this.dashboardService.delete(action.payload))
    .map(dashboard => new DashboardDeletedAction(dashboard))
    .catch((error) => Observable.of(new ErrorOccurredAction(error)));

  @Effect() resizeDashboard$: Observable<Action> = this.actions$
    .ofType(RESIZE_DASHBOARD_ACTION)
    .switchMap(action => this.dashboardService.resize(action.payload))
    .map(() => new DashboardRezisedAction())
    .catch((error) => Observable.of(new ErrorOccurredAction(error)));

}
