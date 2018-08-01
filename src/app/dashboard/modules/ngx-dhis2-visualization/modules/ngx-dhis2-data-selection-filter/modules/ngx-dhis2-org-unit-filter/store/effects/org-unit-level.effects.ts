import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import {
  OrgUnitLevelActionsTypes,
  AddOrgUnitLevelsAction,
  LoadOrgUnitLevelsFailAction
} from '../actions';
import { OrgUnitLevelService } from '../../services';
import { OrgUnitLevel } from '../../models';

@Injectable()
export class OrgUnitLevelEffects {
  constructor(
    private actions$: Actions,
    private orgUnitLevelService: OrgUnitLevelService
  ) {}

  @Effect()
  loadOrgUnitLevels$: Observable<any> = this.actions$.pipe(
    ofType(OrgUnitLevelActionsTypes.LoadOrgUnitLevels),
    switchMap(() =>
      this.orgUnitLevelService.loadAll().pipe(
        map(
          (orgUnitLevels: OrgUnitLevel[]) =>
            new AddOrgUnitLevelsAction(orgUnitLevels)
        ),
        catchError((error: any) => of(new LoadOrgUnitLevelsFailAction(error)))
      )
    )
  );
}
