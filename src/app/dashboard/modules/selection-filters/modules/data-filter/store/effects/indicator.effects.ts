import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { withLatestFrom, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromIndicatorReducer from '../reducers/indicator.reducer';

import * as fromIndicatorActions from '../actions/indicator.actions';
import * as fromIndicatorSelectors from '../selectors/indicator.selectors';
import * as fromHelpers from '../../helpers';
import * as fromServices from '../../services';

@Injectable()
export class IndicatorEffects {
  @Effect({ dispatch: false })
  loadIndicators$: Observable<any> = this.actions$.pipe(
    ofType(fromIndicatorActions.IndicatorActionTypes.LoadIndicators),
    withLatestFrom(
      this.indicatorStore.select(
        fromIndicatorSelectors.getIndicatorsInitiatedStatus
      )
    ),
    tap(
      ([action, indicatorInitiated]: [
        fromIndicatorActions.LoadIndicators,
        boolean
      ]) => {
        if (!indicatorInitiated) {
          this.indicatorStore.dispatch(
            new fromIndicatorActions.LoadIndicatorsInitiated()
          );
          this.indicatorService.loadAll().subscribe(
            (indicators: any[]) => {
              this.indicatorStore.dispatch(
                new fromIndicatorActions.AddIndicators(
                  fromHelpers.getStandardizedIndicators(indicators)
                )
              );
            },
            (error: any) => {
              this.indicatorStore.dispatch(
                new fromIndicatorActions.LoadIndicatorsFail(error)
              );
            }
          );
        }
      }
    )
  );

  constructor(
    private actions$: Actions,
    private indicatorService: fromServices.IndicatorService,
    private indicatorStore: Store<fromIndicatorReducer.State>
  ) {}
}
