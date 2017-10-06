import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {DashboardNotificationService} from '../../dashboard/providers/dashboard-notification.service';
import {Observable} from 'rxjs/Observable';
import {Action} from '@ngrx/store';
import {DashboardNotificationLoadedAction, ErrorOccurredAction, LOAD_DASHBOARD_NOTIFICATION_ACTION} from '../actions';
@Injectable()
export class DashboardNotificationEffect {
  constructor(
    private actions$: Actions,
    private dashboardNotificationService: DashboardNotificationService
  ) {}

  @Effect() dashboardNotification$: Observable<Action> = this.actions$
    .ofType(LOAD_DASHBOARD_NOTIFICATION_ACTION)
    .switchMap(action => this.dashboardNotificationService.load(action.payload))
    .map(dashboardNotification => new DashboardNotificationLoadedAction(dashboardNotification))
}
