import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import {
  switchMap,
  map,
  catchError,
  withLatestFrom,
  tap
} from 'rxjs/operators';
import {
  OrgUnitLevelActionsTypes,
  AddOrgUnitLevelsAction,
  LoadOrgUnitLevelsFailAction,
  InitiateOrgUnitLevelsAction
} from '../actions';
import { OrgUnitLevelService } from '../../services';
import { OrgUnitLevel } from '../../models';
import { Store } from '@ngrx/store';
import { OrgUnitFilterState } from '../reducers';
import { getOrgUnitLevelLoadInitiated } from '../selectors';

@Injectable()
export class OrgUnitLevelEffects {
  constructor(
    private actions$: Actions,
    private store: Store<OrgUnitFilterState>,
    private orgUnitLevelService: OrgUnitLevelService
  ) {}

  @Effect({ dispatch: false })
  loadOrgUnitLevels$: Observable<any> = this.actions$.pipe(
    ofType(OrgUnitLevelActionsTypes.LoadOrgUnitLevels),
    withLatestFrom(this.store.select(getOrgUnitLevelLoadInitiated)),
    tap(([action, loadInitiated]: [InitiateOrgUnitLevelsAction, boolean]) => {
      if (!loadInitiated) {
        this.store.dispatch(new InitiateOrgUnitLevelsAction());
        this.orgUnitLevelService.loadAll().subscribe(
          (orgUnitLevels: OrgUnitLevel[]) => {
            this.store.dispatch(new AddOrgUnitLevelsAction(orgUnitLevels));
          },
          (error: any) => {
            this.store.dispatch(new LoadOrgUnitLevelsFailAction(error));
          }
        );
      }
    })
  );
}
