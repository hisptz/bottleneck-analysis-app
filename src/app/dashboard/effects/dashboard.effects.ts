import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DashboardActions, DashboardActionTypes } from '../actions/dashboard.actions';

@Injectable()
export class DashboardEffects {

  @Effect()
  effect$ = this.actions$.ofType(DashboardActionTypes.LoadDashboards);

  constructor(private actions$: Actions) {}
}
