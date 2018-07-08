import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { DashboardService } from '../services';
import {
  DashboardActions,
  DashboardActionTypes
} from '../actions/dashboard.actions';
import { Observable } from 'rxjs';

@Injectable()
export class DashboardEffects {
  @Effect()
  loadDashboards$: Observable<any> = this.actions$.pipe(
    ofType(DashboardActionTypes.LoadDashboards)
  );

  constructor(
    private actions$: Actions,
    private dashboardService: DashboardService
  ) {}
}
