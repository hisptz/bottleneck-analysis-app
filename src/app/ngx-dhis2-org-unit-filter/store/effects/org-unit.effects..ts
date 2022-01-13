import { Injectable } from "@angular/core";
import { NgxDhis2HttpClientService, User } from "@iapps/ngx-dhis2-http-client";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { concatMap, map, switchMap, tap, withLatestFrom } from "rxjs/operators";

import { getUserOrgUnitIds } from "../../helpers/get-user-org-unit-ids.helper";
import { OrgUnit } from "../../models/org-unit.model";
import { OrgUnitService } from "../../services/org-unit.service";
import {
  addOrgUnits,
  initiateOrgUnits,
  loadOrgUnitFail,
  loadOrgUnits,
  setHighestLevelOrgUnits,
} from "../actions/org-unit.actions";
import { OrgUnitFilterState } from "../reducers/org-unit-filter.reducer";
import { getOrgUnitLoadingInitiated } from "../selectors/org-unit.selectors";

@Injectable()
export class OrgUnitEffects {
  loadOrgUnits$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadOrgUnits),
        concatMap((action) =>
          of(action).pipe(
            withLatestFrom(this.store.select(getOrgUnitLoadingInitiated))
          )
        ),
        tap(([action, orgUnitLoadingInitiated]) => {
          if (!orgUnitLoadingInitiated) {
            this.store.dispatch(initiateOrgUnits());
            this.httClient
              .me()
              .pipe(
                switchMap((currentUser: User) => {
                  const userOrgUnits = getUserOrgUnitIds(
                    currentUser,
                    action.orgUnitFilterConfig.reportUse
                  );

                  this.store.dispatch(
                    setHighestLevelOrgUnits({
                      highestLevelOrgUnits: userOrgUnits,
                    })
                  );

                  return this.orgUnitService
                    .loadAll(action.orgUnitFilterConfig, userOrgUnits)
                    .pipe(
                      map((orgUnits: OrgUnit[]) => ({
                        orgUnits,
                        currentUser,
                      }))
                    );
                })
              )
              .subscribe(
                ({ orgUnits }) => {
                  this.store.dispatch(addOrgUnits({ orgUnits }));
                },
                (error: any) => {
                  this.store.dispatch(loadOrgUnitFail({ error }));
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
    private orgUnitService: OrgUnitService,
    private httClient: NgxDhis2HttpClientService
  ) {}
}
