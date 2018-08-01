import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import {
  OrgUnitActionsTypes,
  AddOrgUnitsAction,
  LoadOrgUnitsFailAction,
  LoadOrgUnitsAction
} from '../actions';
import { OrgUnitService } from '../../services';
import { OrgUnit } from '../../models';

@Injectable()
export class OrgUnitEffects {
  constructor(
    private actions$: Actions,
    private orgUnitService: OrgUnitService
  ) {}

  @Effect()
  loadOrgUnits$: Observable<any> = this.actions$.pipe(
    ofType(OrgUnitActionsTypes.LoadOrgUnits),
    switchMap((action: LoadOrgUnitsAction) =>
      this.orgUnitService.loadAll(action.orgUnitFilterConfig).pipe(
        map((OrgUnits: OrgUnit[]) => new AddOrgUnitsAction(OrgUnits)),
        catchError((error: any) => of(new LoadOrgUnitsFailAction(error)))
      )
    )
  );
}
