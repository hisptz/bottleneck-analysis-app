import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { withLatestFrom, tap, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromDataGroupActions from '../actions/data-group.actions';
import * as fromRootReducer from '../reducers';
import * as fromDataGroupSelectors from '../selectors/data-group.selectors';
import { DataGroupService } from '../../services/data-group.service';
import { DataGroup } from '../../models/data-group.model';
import { LoadDashboardsAction } from '../actions';

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
            (dataGroups: DataGroup[]) => {
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

  // TODO rethink of this approach to achieve a generic app
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
    private store: Store<fromRootReducer.State>,
    private dataGroupService: DataGroupService
  ) {}
}
