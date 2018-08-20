import { Injectable } from '@angular/core';
import { Observable, defer, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { InitializeDashboardGroupsAction } from '../actions/dashboard-groups.action';

@Injectable()
export class DashboardGroupsEffects {
  // remember to put this at the end of all effects
  @Effect()
  init$: Observable<Action> = defer(() => {
    return of(new InitializeDashboardGroupsAction());
  });
  constructor(private actions$: Actions) {}
}
