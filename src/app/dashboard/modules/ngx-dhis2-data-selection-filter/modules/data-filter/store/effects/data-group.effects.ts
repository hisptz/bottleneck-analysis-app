import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { withLatestFrom, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromDataGroupActions from '../actions/data-group.actions';
import * as fromDataGroupReducer from '../reducers/data-group.reducer';
import * as fromDataGroupSelectors from '../selectors/data-group.selectors';
import { DataGroupService } from '../../services/data-group.service';
import { DataGroup } from '../../models/data-group.model';

@Injectable()
export class DataGroupEffects {
  @Effect({ dispatch: false })
  loadDataGroups$: Observable<any> = this.actions$.pipe(
    ofType(fromDataGroupActions.DataGroupActionTypes.LoadDataGroups),
    withLatestFrom(
      this.dataGroupStore.select(
        fromDataGroupSelectors.getDataGroupLoadInitializedStatus
      )
    ),
    tap(
      ([action, dataGroupInitiated]: [
        fromDataGroupActions.LoadDataGroups,
        boolean
      ]) => {
        if (!dataGroupInitiated) {
          this.dataGroupStore.dispatch(
            new fromDataGroupActions.LoadDataGroupsInitiated()
          );
          this.dataGroupService.getDataGroups().subscribe(
            (dataGroups: DataGroup[]) => {
              this.dataGroupStore.dispatch(
                new fromDataGroupActions.AddDataGroups(dataGroups)
              );
            },
            (error: any) => {
              this.dataGroupStore.dispatch(
                new fromDataGroupActions.LoadDataGroupsFail(error)
              );
            }
          );
        }
      }
    )
  );

  constructor(
    private actions$: Actions,
    private dataGroupStore: Store<fromDataGroupReducer.State>,
    private dataGroupService: DataGroupService
  ) {}
}
