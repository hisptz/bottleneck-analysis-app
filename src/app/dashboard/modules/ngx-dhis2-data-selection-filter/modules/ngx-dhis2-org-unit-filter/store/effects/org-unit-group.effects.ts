import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import {
  switchMap,
  map,
  catchError,
  tap,
  withLatestFrom
} from 'rxjs/operators';
import {
  OrgUnitGroupActionsTypes,
  AddOrgUnitGroupsAction,
  LoadOrgUnitGroupsFailAction,
  InitiateOrgUnitGroupsAction
} from '../actions';
import { OrgUnitGroupService } from '../../services';
import { OrgUnitGroup } from '../../models';
import { Store } from '@ngrx/store';
import { OrgUnitFilterState } from '../reducers';
import { getOrgUnitLoadingInitiated } from '../selectors/org-unit.selectors';
import { getOrgUnitGroupLoadInitiated } from '../selectors';

@Injectable()
export class OrgUnitGroupEffects {
  constructor(
    private actions$: Actions,
    private store: Store<OrgUnitFilterState>,
    private orgUnitGroupService: OrgUnitGroupService
  ) {}

  @Effect({ dispatch: false })
  loadOrgUnitGroups$: Observable<any> = this.actions$.pipe(
    ofType(OrgUnitGroupActionsTypes.LoadOrgUnitGroups),
    withLatestFrom(this.store.select(getOrgUnitGroupLoadInitiated)),
    tap(([action, loadInitiated]: [InitiateOrgUnitGroupsAction, boolean]) => {
      if (!loadInitiated) {
        this.store.dispatch(new InitiateOrgUnitGroupsAction());
        this.orgUnitGroupService.loadAll().subscribe(
          (orgUnitGroups: OrgUnitGroup[]) => {
            this.store.dispatch(new AddOrgUnitGroupsAction(orgUnitGroups));
          },
          (error: any) => {
            this.store.dispatch(new LoadOrgUnitGroupsFailAction(error));
          }
        );
      }
    })
  );
}
