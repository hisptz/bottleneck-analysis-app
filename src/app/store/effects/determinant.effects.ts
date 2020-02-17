import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { withLatestFrom, tap, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

// root state
import { State } from '../reducers';

// actions
import * as fromDeterminantActions from '../actions/determinant.actions';

// selectors
import * as fromDeterminantSelectors from '../selectors/determinant.selectors';

// models
import { Determinant } from '../../models/determinant.model';
import { LoadDashboardsAction } from '../../dashboard/store/actions';
import { DeterminantService } from 'src/app/services/determinant.service';

@Injectable()
export class DeterminantEffects {
  @Effect({ dispatch: false })
  loadDeterminants$: Observable<any> = this.actions$.pipe(
    ofType(fromDeterminantActions.DeterminantActionTypes.LoadDeterminants),
    withLatestFrom(
      this.store.select(
        fromDeterminantSelectors.getDeterminantLoadInitializedStatus
      )
    ),
    tap(
      ([action, determinantInitiated]: [
        fromDeterminantActions.LoadDeterminants,
        boolean
      ]) => {
        if (!determinantInitiated) {
          this.store.dispatch(
            new fromDeterminantActions.LoadDeterminantsInitiated()
          );
          this.determinantService.getDeterminants().subscribe(
            (determinants: Determinant[]) => {
              this.store.dispatch(
                new fromDeterminantActions.AddDeterminants(
                  determinants,
                  action.dashboardSettings,
                  action.currentUser,
                  action.systemInfo
                )
              );
            },
            (error: any) => {
              this.store.dispatch(
                new fromDeterminantActions.LoadDeterminantsFail(error)
              );
            }
          );
        }
      }
    )
  );

  // TODO: rethink of this approach to achieve a generic app
  @Effect()
  determinantsLoaded$: Observable<any> = this.actions$.pipe(
    ofType(fromDeterminantActions.DeterminantActionTypes.AddDeterminants),
    map(
      (action: fromDeterminantActions.AddDeterminants) =>
        new LoadDashboardsAction(
          action.currentUser,
          action.dashboardSettings,
          action.systemInfo,
          action.determinants
        )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private determinantService: DeterminantService
  ) {}
}
