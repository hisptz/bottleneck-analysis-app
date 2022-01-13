import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { concatMap, tap, withLatestFrom } from "rxjs/operators";

import { OrgUnitGroup } from "../../models/org-unit-group.model";
import { OrgUnitGroupService } from "../../services/org-unit-group.service";
import {
  addOrgUnitGroups,
  initiateOrgUnitGroups,
  loadOrgUnitGroups,
  loadOrgUnitGroupsFail,
} from "../actions/org-unit-group.actions";
import { OrgUnitFilterState } from "../reducers/org-unit-filter.reducer";
import { getOrgUnitGroupLoadInitiated } from "../selectors/org-unit-group.selectors";

@Injectable()
export class OrgUnitGroupEffects {
  loadOrgUnitGroups$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadOrgUnitGroups),
        concatMap((action) =>
          of(action).pipe(
            withLatestFrom(this.store.select(getOrgUnitGroupLoadInitiated))
          )
        ),
        tap(([action, loadInitiated]) => {
          if (!loadInitiated) {
            this.store.dispatch(initiateOrgUnitGroups());
            this.orgUnitGroupService.loadAll().subscribe(
              (orgUnitGroups: OrgUnitGroup[]) => {
                this.store.dispatch(addOrgUnitGroups({ orgUnitGroups }));
              },
              (error: any) => {
                this.store.dispatch(loadOrgUnitGroupsFail({ error }));
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
    private orgUnitGroupService: OrgUnitGroupService
  ) {}
}
