import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import {
  switchMap,
  map,
  catchError,
  tap,
  withLatestFrom,
  mergeMap
} from 'rxjs/operators';
import {
  OrgUnitActionsTypes,
  AddOrgUnitsAction,
  LoadOrgUnitsFailAction,
  LoadOrgUnitsAction,
  LoadOrgUnitsInitiatedAction
} from '../actions';
import { OrgUnitService } from '../../services';
import { OrgUnit } from '../../models';
import { Store } from '@ngrx/store';
import { OrgUnitFilterState } from '../reducers';
import {
  getOrgUnitLoading,
  getOrgUnitLoaded,
  getOrgUnitLoadingInitiated
} from '../selectors/org-unit.selectors';

@Injectable()
export class OrgUnitEffects {
  constructor(
    private actions$: Actions,
    private store: Store<OrgUnitFilterState>,
    private orgUnitService: OrgUnitService
  ) {}

  @Effect({ dispatch: false })
  loadOrgUnits$: Observable<any> = this.actions$.pipe(
    ofType(OrgUnitActionsTypes.LoadOrgUnits),
    withLatestFrom(this.store.select(getOrgUnitLoadingInitiated)),
    tap(([action, orgUnitLoadingInitiated]: [LoadOrgUnitsAction, boolean]) => {
      if (!orgUnitLoadingInitiated) {
        this.store.dispatch(new LoadOrgUnitsInitiatedAction());
        this.orgUnitService.loadAll(action.orgUnitFilterConfig).subscribe(
          (OrgUnits: OrgUnit[]) => {
            this.store.dispatch(new AddOrgUnitsAction(OrgUnits));
          },
          (error: any) => {
            this.store.dispatch(new LoadOrgUnitsFailAction(error));
          }
        );
      }
    })
  );
}
