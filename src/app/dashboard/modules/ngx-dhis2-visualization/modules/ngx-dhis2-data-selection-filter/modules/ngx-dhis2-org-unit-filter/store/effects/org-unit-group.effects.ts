import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import {
  OrgUnitGroupActionsTypes,
  AddOrgUnitGroupsAction,
  LoadOrgUnitGroupsFailAction
} from '../actions';
import { OrgUnitGroupService } from '../../services';
import { OrgUnitGroup } from '../../models';

@Injectable()
export class OrgUnitGroupEffects {
  constructor(
    private actions$: Actions,
    private orgUnitGroupService: OrgUnitGroupService
  ) {}

  @Effect()
  loadOrgUnitGroups$: Observable<any> = this.actions$.pipe(
    ofType(OrgUnitGroupActionsTypes.LoadOrgUnitGroups),
    switchMap(() =>
      this.orgUnitGroupService.loadAll().pipe(
        map(
          (orgUnitGroups: OrgUnitGroup[]) =>
            new AddOrgUnitGroupsAction(orgUnitGroups)
        ),
        catchError((error: any) => of(new LoadOrgUnitGroupsFailAction(error)))
      )
    )
  );
}
