import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { concatMap, tap, withLatestFrom } from "rxjs/operators";

import { OrgUnitLevel } from "../../models/org-unit-level.model";
import { OrgUnitLevelService } from "../../services/org-unit-level.service";
import {
  addOrgUnitLevels,
  initiateOrgUnitLevels,
  loadOrgUnitLevels,
  loadOrgUnitLevelsFail,
} from "../actions/org-unit-level.actions";
import { OrgUnitFilterState } from "../reducers/org-unit-filter.reducer";
import { getOrgUnitLevelLoadInitiated } from "../selectors/org-unit-level.selectors";

@Injectable()
export class OrgUnitLevelEffects {
  loadOrgUnitLevels$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadOrgUnitLevels),
        concatMap((action) =>
          of(action).pipe(
            withLatestFrom(this.store.select(getOrgUnitLevelLoadInitiated))
          )
        ),
        tap(([action, loadInitiated]) => {
          if (!loadInitiated) {
            this.store.dispatch(initiateOrgUnitLevels());
            this.orgUnitLevelService.loadAll().subscribe(
              (orgUnitLevels: OrgUnitLevel[]) => {
                this.store.dispatch(addOrgUnitLevels({ orgUnitLevels }));
              },
              (error: any) => {
                this.store.dispatch(loadOrgUnitLevelsFail({ error }));
              }
            );
          }
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store<OrgUnitFilterState>,
    private orgUnitLevelService: OrgUnitLevelService
  ) {}
}
