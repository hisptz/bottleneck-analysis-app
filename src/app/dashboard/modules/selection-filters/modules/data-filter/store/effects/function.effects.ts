import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { withLatestFrom, tap, map } from 'rxjs/operators';

import * as fromFunctionReducer from '../reducers/function.reducer';

import * as fromFunctionActions from '../actions/function.actions';
import * as fromFuctionSelectors from '../selectors/function.selectors';
import * as fromHelpers from '../../helpers';

import { FunctionObject } from '../../models/function.model';
import { FunctionService } from '../../services/function.service';

@Injectable()
export class FunctionEffects {
  @Effect({ dispatch: false })
  loadFunctions$: Observable<any> = this.actions$.pipe(
    ofType(fromFunctionActions.FunctionActionTypes.LoadFunctions),
    withLatestFrom(
      this.functionStore.select(fromFuctionSelectors.getFunctionInitiatedStatus)
    ),
    tap(
      ([action, functionInitiated]: [
        fromFunctionActions.LoadFunctions,
        boolean
      ]) => {
        if (!functionInitiated) {
          this.functionStore.dispatch(
            new fromFunctionActions.LoadFunctionsInitiated()
          );
          this.functionService.loadAll().subscribe(
            (functions: FunctionObject[]) => {
              this.functionStore.dispatch(
                new fromFunctionActions.AddFunctions(
                  fromHelpers.getStandardizedFunctions(
                    functions,
                    action.routeParams ? action.routeParams.function || '' : ''
                  ),
                  fromHelpers.getStandardizedFunctionRulesFromFunctionList(
                    functions,
                    action.routeParams ? action.routeParams.rule || '' : ''
                  )
                )
              );
            },
            (error: any) => {
              this.functionStore.dispatch(
                new fromFunctionActions.LoadFunctionsFail(error)
              );
            }
          );
        }
      }
    )
  );

  constructor(
    private actions$: Actions,
    private functionService: FunctionService,
    private functionStore: Store<fromFunctionReducer.State>
  ) {}
}
