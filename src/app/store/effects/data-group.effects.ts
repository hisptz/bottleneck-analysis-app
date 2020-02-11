import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { withLatestFrom, tap, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

// root state
import { State } from '../reducers';

// actions
import * as fromDataGroupActions from '../actions/data-group.actions';

// selectors
import * as fromDataGroupSelectors from '../selectors/data-group.selectors';

// services
import { DataGroupService } from '../../services/data-group.service';

// models
import { Determinant } from '../../models/determinant.model';
import { LoadDashboardsAction } from '../../dashboard/store/actions';

@Injectable()
export class DataGroupEffects {
  @Effect({ dispatch: false })
  loadDataGroups$: Observable<any> = this.actions$.pipe(
    ofType(fromDataGroupActions.DataGroupActionTypes.LoadDataGroups),
    withLatestFrom(
      this.store.select(
        fromDataGroupSelectors.getDataGroupLoadInitializedStatus
      )
    ),
    tap(
      ([action, dataGroupInitiated]: [
        fromDataGroupActions.LoadDataGroups,
        boolean
      ]) => {
        if (!dataGroupInitiated) {
          this.store.dispatch(
            new fromDataGroupActions.LoadDataGroupsInitiated()
          );
          this.dataGroupService.getDataGroups().subscribe(
            (dataGroups: Determinant[]) => {
              this.store.dispatch(
                new fromDataGroupActions.AddDataGroups(
                  dataGroups,
                  action.dashboardSettings,
                  action.currentUser,
                  action.systemInfo
                )
              );
            },
            (error: any) => {
              this.store.dispatch(
                new fromDataGroupActions.LoadDataGroupsFail(error)
              );
            }
          );
        }
      }
    )
  );

  // TODO: rethink of this approach to achieve a generic app
  @Effect()
  dataGroupsLoaded$: Observable<any> = this.actions$.pipe(
    ofType(fromDataGroupActions.DataGroupActionTypes.AddDataGroups),
    map(
      (action: fromDataGroupActions.AddDataGroups) =>
        new LoadDashboardsAction(
          action.currentUser,
          action.dashboardSettings,
          action.systemInfo,
          action.dataGroups
        )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private dataGroupService: DataGroupService
  ) {}
}
